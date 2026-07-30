import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

const createPartnerSchema = z.object({
  name: z.string().min(2),
  logo: z.string().url(),
  website: z.string().url().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

const updatePartnerSchema = createPartnerSchema.partial();

const idParamSchema = z.object({ id: z.string().uuid() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  showAll: z.enum(['true']).optional(),
});

router.get(
  '/',
  optionalAuth,
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const authReq = req as AuthRequest;
    const isAdmin = authReq.user && ['ADMIN', 'MANAGER'].includes(authReq.user.role);
    const showAll = query.showAll === 'true' && isAdmin;
    const { page, limit, skip } = parsePagination(query);

    const where = {
      ...(showAll ? {} : query.isActive !== undefined ? { isActive: query.isActive === 'true' } : { isActive: true }),
    };

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.partner.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Partners retrieved',
      data: paginatedResponse(partners, total, page, limit),
    });
  })
);

router.get(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const partner = await prisma.partner.findUnique({ where: { id: req.params.id } });
    if (!partner) throw new AppError('Partner not found', 404);
    res.json({ success: true, message: 'Partner retrieved', data: partner });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createPartnerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const partner = await prisma.partner.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Partner created', data: partner });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updatePartnerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const partner = await prisma.partner.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, message: 'Partner updated', data: partner });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.partner.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Partner deleted' });
  })
);

export default router;
