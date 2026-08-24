import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { validateQuery } from '../middleware/validate';
import {
  parseContentLocale,
  localizeProperty,
  localizeProject,
  localizeProduct,
  localizeBlog,
  localizeList,
  multilingualSearch,
} from '../lib/locale';

const router = Router();

const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  limit: z.string().optional(),
  locale: z.enum(['en', 'fr', 'rw']).optional(),
});

router.get(
  '/',
  validateQuery(searchQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { q, locale: localeParam } = req.query as z.infer<typeof searchQuerySchema>;
    const locale = parseContentLocale(localeParam);
    const limit = Math.min(20, parseInt((req.query.limit as string) || '5', 10) || 5);

    const searchMode = { contains: q, mode: 'insensitive' as const };

    const [properties, projects, products, blogPosts] = await Promise.all([
      prisma.property.findMany({
        where: {
          OR: multilingualSearch(['title', 'description'], q).concat([
            { location: searchMode },
          ]),
        },
        select: {
          id: true,
          title: true,
          titleFr: true,
          titleRw: true,
          slug: true,
          price: true,
          currency: true,
          location: true,
          propertyType: true,
          purpose: true,
          images: { take: 1, select: { url: true } },
        },
        take: limit,
      }),
      prisma.project.findMany({
        where: {
          OR: multilingualSearch(['title', 'description'], q).concat([
            { location: searchMode },
            { client: searchMode },
          ]),
        },
        select: {
          id: true,
          title: true,
          titleFr: true,
          titleRw: true,
          slug: true,
          location: true,
          status: true,
          images: { take: 1, select: { url: true } },
        },
        take: limit,
      }),
      prisma.product.findMany({
        where: {
          availability: true,
          OR: multilingualSearch(['name', 'description'], q),
        },
        select: {
          id: true,
          name: true,
          nameFr: true,
          nameRw: true,
          slug: true,
          price: true,
          currency: true,
          images: true,
          category: { select: { name: true, nameFr: true, nameRw: true, slug: true } },
        },
        take: limit,
      }),
      prisma.blog.findMany({
        where: {
          published: true,
          OR: multilingualSearch(['title', 'excerpt', 'content'], q),
        },
        select: {
          id: true,
          title: true,
          titleFr: true,
          titleRw: true,
          slug: true,
          excerpt: true,
          excerptFr: true,
          excerptRw: true,
          coverImage: true,
          category: true,
          publishedAt: true,
        },
        take: limit,
      }),
    ]);

    const localizedProperties = localizeList(properties, locale, localizeProperty);
    const localizedProjects = localizeList(projects, locale, localizeProject);
    const localizedProducts = localizeList(products, locale, localizeProduct);
    const localizedBlogPosts = localizeList(blogPosts, locale, localizeBlog);

    res.json({
      success: true,
      message: 'Search results retrieved',
      data: {
        query: q,
        properties: localizedProperties,
        projects: localizedProjects,
        products: localizedProducts,
        blogPosts: localizedBlogPosts,
        totalResults:
          localizedProperties.length +
          localizedProjects.length +
          localizedProducts.length +
          localizedBlogPosts.length,
      },
    });
  })
);

export default router;
