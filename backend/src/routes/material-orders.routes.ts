import { Router, Request, Response } from 'express';
import { OrderStatus } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

router.use(authenticate, requireAdmin);

const idParamSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});

const updateSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  notes: z.string().optional(),
});

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const { page, limit, skip } = parsePagination(query);
    const where = query.status ? { status: query.status } : {};

    const [orders, total] = await Promise.all([
      prisma.materialOrder.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.materialOrder.count({ where }),
    ]);

    res.json({ success: true, data: paginatedResponse(orders, total, page, limit) });
  })
);

router.patch(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const existing = await prisma.materialOrder.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Order not found', 404);

    const order = await prisma.materialOrder.update({
      where: { id: req.params.id },
      data: req.body,
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    res.json({ success: true, message: 'Order updated', data: order });
  })
);

export default router;
