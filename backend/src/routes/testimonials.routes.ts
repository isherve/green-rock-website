import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

const createTestimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(10),
  contentFr: z.string().optional(),
  contentRw: z.string().optional(),
  avatar: z.string().url().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const updateTestimonialSchema = createTestimonialSchema.partial();

const idParamSchema = z.object({ id: z.string().uuid() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
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
      ...(query.featured !== undefined && { featured: query.featured === 'true' }),
      ...(showAll ? {} : query.isActive !== undefined ? { isActive: query.isActive === 'true' } : { isActive: true }),
    };

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.testimonial.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Testimonials retrieved',
      data: paginatedResponse(testimonials, total, page, limit),
    });
  })
);

router.get(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: req.params.id },
    });
    if (!testimonial) throw new AppError('Testimonial not found', 404);
    res.json({ success: true, message: 'Testimonial retrieved', data: testimonial });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createTestimonialSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Testimonial created', data: testimonial });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateTestimonialSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, message: 'Testimonial updated', data: testimonial });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Testimonial deleted' });
  })
);

export default router;
