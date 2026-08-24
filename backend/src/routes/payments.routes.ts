import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PaymentStatus, InvoiceStatus } from '@prisma/client';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { requireCustomer } from '../middleware/portalAuth';
import { validateBody, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { generateNumber } from '../lib/roles';
import { initiateOnlinePayment } from '../lib/payment-gateway';
import { createUserNotification } from '../lib/notifications';
import { sendPaymentAdminNotification, notifyAsync } from '../lib/email';

const router = Router();

const createSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().positive(),
  method: z.string().min(1).optional(),
  reference: z.string().optional(),
  paidAt: z.string().optional(),
});

const initiateSchema = z.object({
  invoiceId: z.string().uuid(),
  method: z.enum(['MOMO', 'CARD', 'BANK']),
});

const webhookSchema = z.object({
  tx_ref: z.string(),
  status: z.string(),
  amount: z.number().optional(),
  currency: z.string().optional(),
});

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

/** Flutterwave webhook (no auth) */
router.post(
  '/webhook/flutterwave',
  validateBody(webhookSchema),
  asyncHandler(async (req, res: Response) => {
    const { tx_ref, status, amount } = req.body as z.infer<typeof webhookSchema>;
    if (status !== 'successful') {
      res.json({ success: true, message: 'Ignored non-success status' });
      return;
    }

    const payment = await prisma.payment.findFirst({
      where: { reference: tx_ref },
      include: {
        user: { select: { name: true, email: true } },
        invoice: { select: { invoiceNumber: true } },
      },
    });
    if (!payment) throw new AppError('Payment reference not found', 404);

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.COMPLETED, paidAt: new Date() },
    });

    if (payment.invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: payment.invoiceId },
        include: { payments: true },
      });
      if (invoice) {
        const paidTotal = invoice.payments
          .filter((p) => p.status === PaymentStatus.COMPLETED || p.id === payment.id)
          .reduce((sum, p) => sum + (p.id === payment.id ? (amount ?? p.amount) : p.amount), 0);
        if (paidTotal >= invoice.amount) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: InvoiceStatus.PAID },
          });
        }
      }
    }

    notifyAsync('payment-admin', () =>
      sendPaymentAdminNotification({
        customerName: payment.user.name,
        customerEmail: payment.user.email,
        amount: amount ?? payment.amount,
        currency: payment.currency,
        reference: tx_ref,
        invoiceNumber: payment.invoice?.invoiceNumber,
      })
    );

    createUserNotification({
      userId: payment.userId,
      title: 'Payment received',
      message: 'Your payment was processed successfully.',
      link: '/portal/payments',
      type: 'payment',
    }).catch(() => {});

    res.json({ success: true, message: 'Webhook processed' });
  })
);

/** Customer: initiate online payment */
router.post(
  '/initiate',
  authenticate,
  requireCustomer,
  validateBody(initiateSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { invoiceId, method } = req.body as z.infer<typeof initiateSchema>;
    const userId = req.user!.userId;

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });
    if (!invoice) throw new AppError('Invoice not found', 404);
    if (invoice.status === 'PAID') throw new AppError('Invoice is already paid', 400);

    const paidTotal = await prisma.payment.aggregate({
      where: { invoiceId, status: PaymentStatus.COMPLETED },
      _sum: { amount: true },
    });
    const remaining = invoice.amount - (paidTotal._sum.amount ?? 0);
    if (remaining <= 0) throw new AppError('Invoice is already paid', 400);

    const result = await initiateOnlinePayment({
      invoiceNumber: invoice.invoiceNumber,
      amount: remaining,
      currency: invoice.currency,
      customerEmail: invoice.user.email,
      customerName: invoice.user.name,
      customerPhone: invoice.user.phone,
      method,
    });

    await prisma.payment.create({
      data: {
        userId,
        invoiceId: invoice.id,
        amount: remaining,
        currency: invoice.currency,
        method: method === 'MOMO' ? 'Mobile Money' : method === 'CARD' ? 'Card' : 'Bank Transfer',
        reference: result.reference,
        status: PaymentStatus.PENDING,
      },
    });

    res.json({ success: true, data: result });
  })
);

router.use(authenticate, requireAdmin);

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query as z.infer<typeof listQuerySchema>);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          invoice: { select: { id: true, invoiceNumber: true, title: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count(),
    ]);

    res.json({ success: true, data: paginatedResponse(payments, total, page, limit) });
  })
);

router.post(
  '/',
  validateBody(createSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { invoiceId, amount, method, reference, paidAt } = req.body as z.infer<typeof createSchema>;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });
    if (!invoice) throw new AppError('Invoice not found', 404);

    const paidTotal = invoice.payments
      .filter((p) => p.status === PaymentStatus.COMPLETED)
      .reduce((sum, p) => sum + p.amount, 0);

    const payment = await prisma.payment.create({
      data: {
        userId: invoice.userId,
        invoiceId: invoice.id,
        amount,
        currency: invoice.currency,
        method: method ?? 'Manual',
        reference: reference ?? generateNumber('PAY'),
        status: PaymentStatus.COMPLETED,
        paidAt: paidAt ? new Date(paidAt) : new Date(),
      },
    });

    const newTotal = paidTotal + amount;
    if (newTotal >= invoice.amount) {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: InvoiceStatus.PAID },
      });
    }

    res.status(201).json({ success: true, message: 'Payment recorded', data: payment });
  })
);

export default router;
