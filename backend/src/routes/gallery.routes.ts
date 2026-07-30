import { Router, Request, Response } from 'express';
import { GalleryType, GalleryCategory } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

const createGallerySchema = z.object({
  title: z.string().min(2),
  titleFr: z.string().optional(),
  titleRw: z.string().optional(),
  type: z.nativeEnum(GalleryType).optional(),
  category: z.nativeEnum(GalleryCategory).optional(),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  description: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

const updateGallerySchema = createGallerySchema.partial();

const idParamSchema = z.object({ id: z.string().uuid() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.nativeEnum(GalleryType).optional(),
  category: z.nativeEnum(GalleryCategory).optional(),
  featured: z.enum(['true', 'false']).optional(),
});

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const { page, limit, skip } = parsePagination(query);

    const where = {
      ...(query.type && { type: query.type }),
      ...(query.category && { category: query.category }),
      ...(query.featured !== undefined && { featured: query.featured === 'true' }),
    };

    const [items, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.gallery.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Gallery items retrieved',
      data: paginatedResponse(items, total, page, limit),
    });
  })
);

router.get(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await prisma.gallery.findUnique({ where: { id: req.params.id } });
    if (!item) throw new AppError('Gallery item not found', 404);
    res.json({ success: true, message: 'Gallery item retrieved', data: item });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createGallerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await prisma.gallery.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Gallery item created', data: item });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateGallerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await prisma.gallery.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, message: 'Gallery item updated', data: item });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Gallery item deleted' });
  })
);

export default router;
