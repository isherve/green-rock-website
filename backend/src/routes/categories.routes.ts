import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { slugify } from '../utils/slug';

const router = Router();

const createCategorySchema = z.object({
  name: z.string().min(2),
  nameFr: z.string().optional(),
  nameRw: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

const idParamSchema = z.object({ id: z.string().uuid() });
const slugParamSchema = z.object({ slug: z.string() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const { page, limit, skip } = parsePagination(query);

    const where = {
      ...(query.parentId !== undefined && {
        parentId: query.parentId === 'null' ? null : query.parentId,
      }),
      ...(query.isActive !== undefined ? { isActive: query.isActive === 'true' } : { isActive: true }),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          children: { where: { isActive: true }, orderBy: { order: 'asc' } },
          _count: { select: { products: true } },
        },
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      }),
      prisma.category.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Categories retrieved',
      data: paginatedResponse(categories, total, page, limit),
    });
  })
);

router.get(
  '/:slug',
  validateParams(slugParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        children: { where: { isActive: true } },
        parent: true,
        products: { where: { availability: true }, take: 20 },
      },
    });

    if (!category) throw new AppError('Category not found', 404);

    res.json({ success: true, message: 'Category retrieved', data: category });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, slug, ...rest } = req.body;
    const finalSlug = slug || slugify(name);

    const existing = await prisma.category.findUnique({ where: { slug: finalSlug } });
    if (existing) throw new AppError('Category slug already exists', 409);

    const category = await prisma.category.create({
      data: { name, slug: finalSlug, ...rest },
    });

    res.status(201).json({ success: true, message: 'Category created', data: category });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new AppError('Category not found', 404);

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugTaken = await prisma.category.findUnique({ where: { slug: req.body.slug } });
      if (slugTaken) throw new AppError('Slug already in use', 409);
    }

    const category = await prisma.category.update({
      where: { id },
      data: req.body,
    });

    res.json({ success: true, message: 'Category updated', data: category });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new AppError('Cannot delete category with existing products', 400);
    }

    await prisma.category.delete({ where: { id } });

    res.json({ success: true, message: 'Category deleted' });
  })
);

export default router;
