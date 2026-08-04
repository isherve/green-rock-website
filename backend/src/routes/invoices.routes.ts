import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateParams, validateBody, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({ page: z.string().optional(), limit: z.string().optional(), status: z.string().optional() });
const updateSchema = z.object({ status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional() });

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
        include: { user: { select: { id: true, name: true, email: true } }, payments: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({ success: true, data: paginatedResponse(invoices, total, page, limit) });
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
    const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: invoice });
  })
);

export default router;
