import { Router, Request, Response } from 'express';
import { PaymentStatus, InvoiceStatus } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { generateNumber } from '../lib/roles';

const router = Router();

router.use(authenticate, requireAdmin);

const createSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().positive(),
  method: z.string().min(1).optional(),
  reference: z.string().optional(),
  paidAt: z.string().optional(),
});

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

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
