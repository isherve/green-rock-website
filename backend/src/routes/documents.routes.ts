import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { createUserNotification } from '../lib/notifications';

const router = Router();

router.use(authenticate, requireAdmin);

const createSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string().optional(),
  category: z.string().default('general'),
});

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  userId: z.string().uuid().optional(),
});

const idParamSchema = z.object({ id: z.string().uuid() });

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const { page, limit, skip } = parsePagination(query);
    const where = query.userId ? { userId: query.userId } : {};

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.document.count({ where }),
    ]);

    res.json({ success: true, data: paginatedResponse(documents, total, page, limit) });
  })
);

router.post(
  '/',
  validateBody(createSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as z.infer<typeof createSchema>;
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new AppError('Customer not found', 404);

    const document = await prisma.document.create({ data });

    createUserNotification({
      userId: data.userId,
      title: 'New document shared',
      message: `${data.title} is now available in your portal.`,
      link: '/portal/documents',
      type: 'document',
    }).catch(() => {});

    res.status(201).json({ success: true, message: 'Document shared with customer', data: document });
  })
);

router.delete(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const existing = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Document not found', 404);
    await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Document removed' });
  })
);

export default router;
