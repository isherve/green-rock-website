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

const createProductSchema = z.object({
  name: z.string().min(2),
  nameFr: z.string().optional(),
  nameRw: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().min(10),
  descriptionFr: z.string().optional(),
  descriptionRw: z.string().optional(),
  price: z.number().positive(),
  currency: z.string().default('RWF'),
  stock: z.number().int().min(0).optional(),
  availability: z.boolean().optional(),
  deliveryOption: z.boolean().optional(),
  deliveryCharge: z.number().optional().nullable(),
  featured: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  categoryId: z.string().uuid(),
});

const updateProductSchema = createProductSchema.partial();

const idParamSchema = z.object({ id: z.string().uuid() });
const slugParamSchema = z.object({ slug: z.string() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  categorySlug: z.string().optional(),
  search: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  availability: z.enum(['true', 'false']).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
};

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const { page, limit, skip } = parsePagination(query);
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    let categoryId = query.categoryId;
    if (query.categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: query.categorySlug } });
      if (cat) categoryId = cat.id;
    }

    const where = {
      ...(categoryId && { categoryId }),
      ...(query.featured !== undefined && { featured: query.featured === 'true' }),
      ...(query.availability !== undefined && { availability: query.availability === 'true' }),
      ...(query.minPrice && { price: { gte: parseFloat(query.minPrice) } }),
      ...(query.maxPrice && {
        price: {
          ...(query.minPrice ? { gte: parseFloat(query.minPrice) } : {}),
          lte: parseFloat(query.maxPrice),
        },
      }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' as const } },
          { description: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Products retrieved',
      data: paginatedResponse(products, total, page, limit),
    });
  })
);

router.get(
  '/:slug',
  validateParams(slugParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: productInclude,
    });

    if (!product) throw new AppError('Product not found', 404);

    res.json({ success: true, message: 'Product retrieved', data: product });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createProductSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, slug, categoryId, ...rest } = req.body;
    const finalSlug = slug || slugify(name);

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new AppError('Category not found', 404);

    const existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
    if (existing) throw new AppError('Product slug already exists', 409);

    const product = await prisma.product.create({
      data: { name, slug: finalSlug, categoryId, ...rest },
      include: productInclude,
    });

    res.status(201).json({ success: true, message: 'Product created', data: product });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateProductSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError('Product not found', 404);

    if (req.body.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: req.body.categoryId } });
      if (!category) throw new AppError('Category not found', 404);
    }

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugTaken = await prisma.product.findUnique({ where: { slug: req.body.slug } });
      if (slugTaken) throw new AppError('Slug already in use', 409);
    }

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
      include: productInclude,
    });

    res.json({ success: true, message: 'Product updated', data: product });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError('Product not found', 404);

    await prisma.product.delete({ where: { id } });

    res.json({ success: true, message: 'Product deleted' });
  })
);

export default router;
