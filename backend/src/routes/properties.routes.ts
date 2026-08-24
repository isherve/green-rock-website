import { Router, Request, Response } from 'express';
import { PropertyType, PropertyPurpose, PropertyStatus } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { slugify } from '../utils/slug';
import {
  parseContentLocale,
  localizeProperty,
  localizeList,
  multilingualSearch,
} from '../lib/locale';

const router = Router();

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  order: z.number().int().optional(),
});

const videoSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
});

const createPropertySchema = z.object({
  title: z.string().min(3),
  titleFr: z.string().optional(),
  titleRw: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().min(10),
  descriptionFr: z.string().optional(),
  descriptionRw: z.string().optional(),
  price: z.number().positive(),
  currency: z.string().default('RWF'),
  location: z.string().min(2),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  area: z.number().positive().optional(),
  areaUnit: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType),
  purpose: z.nativeEnum(PropertyPurpose),
  status: z.nativeEnum(PropertyStatus).optional(),
  featured: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  agentId: z.string().uuid().optional().nullable(),
  images: z.array(imageSchema).optional(),
  videos: z.array(videoSchema).optional(),
});

const updatePropertySchema = createPropertySchema.partial();

const idParamSchema = z.object({ id: z.string().uuid() });
const slugParamSchema = z.object({ slug: z.string() });

const searchQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  purpose: z.nativeEnum(PropertyPurpose).optional(),
  status: z.nativeEnum(PropertyStatus).optional(),
  location: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minBedrooms: z.string().optional(),
  maxBedrooms: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['price', 'createdAt', 'area']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  locale: z.enum(['en', 'fr', 'rw']).optional(),
});

function buildPropertyWhere(query: z.infer<typeof searchQuerySchema>) {
  return {
    ...(query.propertyType && { propertyType: query.propertyType }),
    ...(query.purpose && { purpose: query.purpose }),
    ...(query.status && { status: query.status }),
    ...(query.location && {
      location: { contains: query.location, mode: 'insensitive' as const },
    }),
    ...(query.featured !== undefined && { featured: query.featured === 'true' }),
    ...(query.minPrice && { price: { gte: parseFloat(query.minPrice) } }),
    ...(query.maxPrice && {
      price: {
        ...(query.minPrice ? { gte: parseFloat(query.minPrice) } : {}),
        lte: parseFloat(query.maxPrice),
      },
    }),
    ...(query.minBedrooms && { bedrooms: { gte: parseInt(query.minBedrooms, 10) } }),
    ...(query.maxBedrooms && {
      bedrooms: {
        ...(query.minBedrooms ? { gte: parseInt(query.minBedrooms, 10) } : {}),
        lte: parseInt(query.maxBedrooms, 10),
      },
    }),
    ...(query.search && {
      OR: multilingualSearch(['title', 'description'], query.search).concat([
        { location: { contains: query.search, mode: 'insensitive' as const } },
      ]),
    }),
  };
}

const propertyInclude = {
  images: { orderBy: { order: 'asc' as const } },
  videos: true,
  agent: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
};

router.get(
  '/',
  validateQuery(searchQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof searchQuerySchema>;
    const locale = parseContentLocale(query.locale);
    const { page, limit, skip } = parsePagination(query);
    const where = buildPropertyWhere(query);
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: propertyInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.property.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Properties retrieved',
      data: paginatedResponse(localizeList(properties, locale, localizeProperty), total, page, limit),
    });
  })
);

router.get(
  '/:slug',
  optionalAuth,
  validateParams(slugParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const locale = parseContentLocale(req.query.locale);
    const property = await prisma.property.findUnique({
      where: { slug: req.params.slug },
      include: propertyInclude,
    });

    if (!property) throw new AppError('Property not found', 404);

    let isFavorited = false;
    if (req.user) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId: req.user.userId,
            propertyId: property.id,
          },
        },
      });
      isFavorited = !!favorite;
    }

    res.json({
      success: true,
      message: 'Property retrieved',
      data: { ...localizeProperty(property, locale), isFavorited },
    });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createPropertySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { images, videos, title, slug, ...rest } = req.body;
    const finalSlug = slug || slugify(title);

    const existing = await prisma.property.findUnique({ where: { slug: finalSlug } });
    if (existing) throw new AppError('Property slug already exists', 409);

    const property = await prisma.property.create({
      data: {
        title,
        slug: finalSlug,
        ...rest,
        images: images ? { create: images } : undefined,
        videos: videos ? { create: videos } : undefined,
      },
      include: propertyInclude,
    });

    res.status(201).json({ success: true, message: 'Property created', data: property });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updatePropertySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { images, videos, ...rest } = req.body;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    if (rest.slug && rest.slug !== existing.slug) {
      const slugTaken = await prisma.property.findUnique({ where: { slug: rest.slug } });
      if (slugTaken) throw new AppError('Slug already in use', 409);
    }

    if (images) {
      await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
    }
    if (videos) {
      await prisma.propertyVideo.deleteMany({ where: { propertyId: id } });
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...rest,
        ...(images && { images: { create: images } }),
        ...(videos && { videos: { create: videos } }),
      },
      include: propertyInclude,
    });

    res.json({ success: true, message: 'Property updated', data: property });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    await prisma.property.delete({ where: { id } });

    res.json({ success: true, message: 'Property deleted' });
  })
);

export default router;
