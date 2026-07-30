import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { validateQuery } from '../middleware/validate';

const router = Router();

const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  limit: z.string().optional(),
});

router.get(
  '/',
  validateQuery(searchQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query as z.infer<typeof searchQuerySchema>;
    const limit = Math.min(20, parseInt((req.query.limit as string) || '5', 10) || 5);

    const searchMode = { contains: q, mode: 'insensitive' as const };

    const [properties, projects, products, blogPosts] = await Promise.all([
      prisma.property.findMany({
        where: {
          OR: [
            { title: searchMode },
            { description: searchMode },
            { location: searchMode },
          ],
        },
        select: {
          id: true,
          title: true,
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
          OR: [
            { title: searchMode },
            { description: searchMode },
            { location: searchMode },
            { client: searchMode },
          ],
        },
        select: {
          id: true,
          title: true,
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
          OR: [{ name: searchMode }, { description: searchMode }],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          currency: true,
          images: true,
          category: { select: { name: true, slug: true } },
        },
        take: limit,
      }),
      prisma.blog.findMany({
        where: {
          published: true,
          OR: [
            { title: searchMode },
            { excerpt: searchMode },
            { content: searchMode },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          category: true,
          publishedAt: true,
        },
        take: limit,
      }),
    ]);

    res.json({
      success: true,
      message: 'Search results retrieved',
      data: {
        query: q,
        properties,
        projects,
        products,
        blogPosts,
        totalResults: properties.length + projects.length + products.length + blogPosts.length,
      },
    });
  })
);

export default router;
