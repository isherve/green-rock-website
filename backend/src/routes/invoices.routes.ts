import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateParams, validateBody, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { generateNumber } from '../lib/roles';
import { buildInvoicePdf, parseInvoiceItems } from '../lib/invoice-pdf';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({ page: z.string().optional(), limit: z.string().optional(), status: z.string().optional() });

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive().optional().default(1),
  unitPrice: z.number().nonnegative(),
});

const createSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  currency: z.string().default('RWF'),
  dueDate: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional().default('SENT'),
  items: z.array(lineItemSchema).min(1),
});

const updateSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  title: z.string().min(1).optional(),
  dueDate: z.string().optional().nullable(),
});

function computeTotal(items: z.infer<typeof lineItemSchema>[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function toPdfPayload(invoice: {
  invoiceNumber: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: Date | null;
  createdAt: Date;
  items: unknown;
  user: { name: string; email: string; phone: string | null };
}) {
  const items = parseInvoiceItems(invoice.items).map((item) => ({
    ...item,
    amount: item.amount || (item.unitPrice ?? 0) * (item.quantity ?? 1),
  }));

  return {
    invoiceNumber: invoice.invoiceNumber,
    title: invoice.title,
    amount: invoice.amount,
    currency: invoice.currency,
    status: invoice.status,
    dueDate: invoice.dueDate,
    createdAt: invoice.createdAt,
    items,
    customer: {
      name: invoice.user.name,
      email: invoice.user.email,
      phone: invoice.user.phone,
    },
  };
}

router.get(
  '/',
  authenticate,
  requireAdmin,
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const { page, limit, skip } = parsePagination(query);
    const where = query.status ? { status: query.status as never } : {};

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, phone: true } }, payments: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({ success: true, data: paginatedResponse(invoices, total, page, limit) });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, title, currency, dueDate, status, items } = req.body as z.infer<typeof createSchema>;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('Customer not found', 404);

    const normalizedItems = items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    }));
    const amount = computeTotal(items);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateNumber('GR-INV'),
        userId,
        title,
        amount,
        currency,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        items: normalizedItems,
      },
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    res.status(201).json({ success: true, message: 'Invoice created', data: invoice });
  })
);

router.get(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, name: true, email: true, phone: true } }, payments: true },
    });
    if (!invoice) throw new AppError('Invoice not found', 404);
    res.json({ success: true, data: invoice });
  })
);

router.get(
  '/:id/pdf',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });
    if (!invoice) throw new AppError('Invoice not found', 404);

    const pdf = await buildInvoicePdf(toPdfPayload(invoice));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    res.send(pdf);
  })
);

router.patch(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const existing = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Invoice not found', 404);

    const { dueDate, ...rest } = req.body as z.infer<typeof updateSchema>;
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json({ success: true, data: invoice });
  })
);

export default router;
