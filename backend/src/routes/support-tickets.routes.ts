import { Router, Response } from 'express';
import { TicketStatus, TicketPriority } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

router.use(authenticate, requireAdmin);

const idParamSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.nativeEnum(TicketStatus).optional(),
});

const updateSchema = z.object({
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
});

const replySchema = z.object({
  message: z.string().min(1),
});

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const { page, limit, skip } = parsePagination(query);
    const where = query.status ? { status: query.status } : {};

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          replies: { orderBy: { createdAt: 'asc' }, take: 1 },
          _count: { select: { replies: true } },
        },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    res.json({ success: true, data: paginatedResponse(tickets, total, page, limit) });
  })
);

router.get(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(async (req, res: Response) => {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        replies: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!ticket) throw new AppError('Ticket not found', 404);
    res.json({ success: true, data: ticket });
  })
);

router.post(
  '/:id/replies',
  validateParams(idParamSchema),
  validateBody(replySchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!ticket) throw new AppError('Ticket not found', 404);

    const staff = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { name: true },
    });

    const [reply] = await prisma.$transaction([
      prisma.ticketReply.create({
        data: {
          ticketId: ticket.id,
          message: req.body.message,
          isStaff: true,
          authorName: staff?.name ?? 'Green Rock Support',
        },
      }),
      prisma.supportTicket.update({
        where: { id: ticket.id },
        data: { status: ticket.status === 'OPEN' ? 'IN_PROGRESS' : ticket.status },
      }),
    ]);

    res.status(201).json({ success: true, message: 'Reply sent', data: reply });
  })
);

router.patch(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateSchema),
  asyncHandler(async (req, res: Response) => {
    const existing = await prisma.supportTicket.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Ticket not found', 404);

    const ticket = await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: req.body,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json({ success: true, data: ticket });
  })
);

export default router;
