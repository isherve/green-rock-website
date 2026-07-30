import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { slugify } from '../utils/slug';

const router = Router();

const createBlogSchema = z.object({
  title: z.string().min(3),
  titleFr: z.string().optional(),
  titleRw: z.string().optional(),
  slug: z.string().optional(),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  contentFr: z.string().optional(),
  contentRw: z.string().optional(),
  coverImage: z.string().url().optional(),
  category: z.string().min(2),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const updateBlogSchema = createBlogSchema.partial();

const createCommentSchema = z.object({
  content: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email(),
});

const idParamSchema = z.object({ id: z.string().uuid() });
const slugParamSchema = z.object({ slug: z.string() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  published: z.enum(['true', 'false']).optional(),
  showAll: z.enum(['true']).optional(),
});

const blogInclude = {
  author: { select: { id: true, name: true, avatar: true } },
  _count: { select: { comments: { where: { approved: true } } } },
};

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
      ...(query.category && { category: query.category }),
      ...(query.tag && { tags: { has: query.tag } }),
      ...(showAll
        ? {}
        : query.published !== undefined
          ? { published: query.published === 'true' }
          : { published: true }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { excerpt: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [posts, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: blogInclude,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.blog.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Blog posts retrieved',
      data: paginatedResponse(posts, total, page, limit),
    });
  })
);

router.get(
  '/:slug',
  optionalAuth,
  validateParams(slugParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const post = await prisma.blog.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    if (!post) throw new AppError('Blog post not found', 404);
    if (!post.published && !req.user) throw new AppError('Blog post not found', 404);

    await prisma.blog.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    res.json({ success: true, message: 'Blog post retrieved', data: post });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createBlogSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, slug, published, ...rest } = req.body;
    const finalSlug = slug || slugify(title);

    const existing = await prisma.blog.findUnique({ where: { slug: finalSlug } });
    if (existing) throw new AppError('Blog slug already exists', 409);

    const post = await prisma.blog.create({
      data: {
        title,
        slug: finalSlug,
        ...rest,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        authorId: req.user!.userId,
      },
      include: blogInclude,
    });

    res.status(201).json({ success: true, message: 'Blog post created', data: post });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateBlogSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { published, ...rest } = req.body;

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new AppError('Blog post not found', 404);

    const post = await prisma.blog.update({
      where: { id },
      data: {
        ...rest,
        ...(published !== undefined && {
          published,
          publishedAt: published && !existing.publishedAt ? new Date() : existing.publishedAt,
        }),
      },
      include: blogInclude,
    });

    res.json({ success: true, message: 'Blog post updated', data: post });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.blog.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Blog post deleted' });
  })
);

router.post(
  '/:id/comments',
  optionalAuth,
  validateParams(idParamSchema),
  validateBody(createCommentSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const post = await prisma.blog.findUnique({ where: { id } });
    if (!post || !post.published) throw new AppError('Blog post not found', 404);

    const comment = await prisma.comment.create({
      data: {
        blogId: id,
        content: req.body.content,
        name: req.body.name,
        email: req.body.email,
        authorId: req.user?.userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Comment submitted for review',
      data: comment,
    });
  })
);

router.patch(
  '/comments/:commentId/approve',
  authenticate,
  requireAdmin,
  validateParams(z.object({ commentId: z.string().uuid() })),
  asyncHandler(async (req: Request, res: Response) => {
    const comment = await prisma.comment.update({
      where: { id: req.params.commentId },
      data: { approved: true },
    });

    res.json({ success: true, message: 'Comment approved', data: comment });
  })
);

router.delete(
  '/comments/:commentId',
  authenticate,
  requireAdmin,
  validateParams(z.object({ commentId: z.string().uuid() })),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.comment.delete({ where: { id: req.params.commentId } });
    res.json({ success: true, message: 'Comment deleted' });
  })
);

export default router;
