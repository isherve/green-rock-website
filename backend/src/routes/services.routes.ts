import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { slugify } from '../utils/slug';
import {
  parseContentLocale,
  localizeService,
  localizeList,
} from '../lib/locale';

const router = Router();

const createServiceSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(2),
  titleFr: z.string().optional(),
  titleRw: z.string().optional(),
  description: z.string().min(10),
  descriptionFr: z.string().optional(),
  descriptionRw: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

const updateServiceSchema = createServiceSchema.partial();

const idParamSchema = z.object({ id: z.string().uuid() });
const slugParamSchema = z.object({ slug: z.string() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  parentId: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  locale: z.enum(['en', 'fr', 'rw']).optional(),
});

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { featured, parentId, isActive, locale: localeParam } = req.query as z.infer<typeof listQuerySchema>;
    const locale = parseContentLocale(localeParam);

    const where = {
      ...(featured !== undefined && { featured: featured === 'true' }),
      ...(parentId !== undefined && { parentId: parentId === 'null' ? null : parentId }),
      ...(isActive !== undefined ? { isActive: isActive === 'true' } : { isActive: true }),
    };

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { children: { where: { isActive: true }, orderBy: { order: 'asc' } } },
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { title: 'asc' }],
      }),
      prisma.service.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Services retrieved',
      data: paginatedResponse(localizeList(services, locale, localizeService), total, page, limit),
    });
  })
);

router.get(
  '/:slug',
  validateParams(slugParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const locale = parseContentLocale(req.query.locale);
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug },
      include: {
        children: { where: { isActive: true }, orderBy: { order: 'asc' } },
        parent: true,
      },
    });

    if (!service) throw new AppError('Service not found', 404);

    res.json({ success: true, message: 'Service retrieved', data: localizeService(service, locale) });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createServiceSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, ...rest } = req.body;
    const finalSlug = slug || slugify(title);

    const existing = await prisma.service.findUnique({ where: { slug: finalSlug } });
    if (existing) throw new AppError('Service slug already exists', 409);

    const service = await prisma.service.create({
      data: { title, slug: finalSlug, ...rest },
    });

    res.status(201).json({ success: true, message: 'Service created', data: service });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateServiceSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) throw new AppError('Service not found', 404);

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugTaken = await prisma.service.findUnique({ where: { slug: req.body.slug } });
      if (slugTaken) throw new AppError('Slug already in use', 409);
    }

    const service = await prisma.service.update({
      where: { id },
      data: req.body,
    });

    res.json({ success: true, message: 'Service updated', data: service });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) throw new AppError('Service not found', 404);

    await prisma.service.delete({ where: { id } });

    res.json({ success: true, message: 'Service deleted' });
  })
);

export default router;
