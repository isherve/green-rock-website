import { Router, Request, Response } from 'express';
import { ProjectStatus } from '@prisma/client';
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
  localizeProject,
  localizeList,
  multilingualSearch,
} from '../lib/locale';

const router = Router();

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  order: z.number().int().optional(),
});

const createProjectSchema = z.object({
  title: z.string().min(3),
  titleFr: z.string().optional(),
  titleRw: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().min(10),
  descriptionFr: z.string().optional(),
  descriptionRw: z.string().optional(),
  location: z.string().min(2),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  client: z.string().optional(),
  completionDate: z.string().datetime().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).optional(),
  servicesUsed: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  images: z.array(imageSchema).optional(),
});

const updateProjectSchema = createProjectSchema.partial();

const idParamSchema = z.object({ id: z.string().uuid() });
const slugParamSchema = z.object({ slug: z.string() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  locale: z.enum(['en', 'fr', 'rw']).optional(),
});

const projectInclude = {
  images: { orderBy: { order: 'asc' as const } },
};

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const locale = parseContentLocale(query.locale);
    const { page, limit, skip } = parsePagination(query);

    const where = {
      ...(query.status && { status: query.status }),
      ...(query.featured !== undefined && { featured: query.featured === 'true' }),
      ...(query.search && {
        OR: multilingualSearch(['title', 'description'], query.search).concat([
          { location: { contains: query.search, mode: 'insensitive' as const } },
          { client: { contains: query.search, mode: 'insensitive' as const } },
        ]),
      }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: projectInclude,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Projects retrieved',
      data: paginatedResponse(localizeList(projects, locale, localizeProject), total, page, limit),
    });
  })
);

router.get(
  '/:slug',
  validateParams(slugParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const locale = parseContentLocale(req.query.locale);
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: projectInclude,
    });

    if (!project) throw new AppError('Project not found', 404);

    res.json({ success: true, message: 'Project retrieved', data: localizeProject(project, locale) });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createProjectSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, images, completionDate, ...rest } = req.body;
    const finalSlug = slug || slugify(title);

    const existing = await prisma.project.findUnique({ where: { slug: finalSlug } });
    if (existing) throw new AppError('Project slug already exists', 409);

    const project = await prisma.project.create({
      data: {
        title,
        slug: finalSlug,
        ...rest,
        completionDate: completionDate ? new Date(completionDate) : undefined,
        images: images ? { create: images } : undefined,
      },
      include: projectInclude,
    });

    res.status(201).json({ success: true, message: 'Project created', data: project });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateProjectSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { images, completionDate, ...rest } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new AppError('Project not found', 404);

    if (rest.slug && rest.slug !== existing.slug) {
      const slugTaken = await prisma.project.findUnique({ where: { slug: rest.slug } });
      if (slugTaken) throw new AppError('Slug already in use', 409);
    }

    if (images) {
      await prisma.projectImage.deleteMany({ where: { projectId: id } });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(completionDate !== undefined && {
          completionDate: completionDate ? new Date(completionDate) : null,
        }),
        ...(images && { images: { create: images } }),
      },
      include: projectInclude,
    });

    res.json({ success: true, message: 'Project updated', data: project });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new AppError('Project not found', 404);

    await prisma.project.delete({ where: { id } });

    res.json({ success: true, message: 'Project deleted' });
  })
);

export default router;
