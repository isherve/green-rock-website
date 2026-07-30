import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ApplicationStatus } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { uploadFile } from '../lib/upload';
import {
  sendCareerApplicationAdminNotification,
  sendCareerApplicationConfirmation,
} from '../lib/email';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { slugify } from '../utils/slug';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  },
});

const createCareerSchema = z.object({
  title: z.string().min(3),
  titleFr: z.string().optional(),
  titleRw: z.string().optional(),
  slug: z.string().optional(),
  department: z.string().min(2),
  location: z.string().min(2),
  type: z.string().default('Full-time'),
  description: z.string().min(20),
  requirements: z.string().min(20),
  salary: z.string().optional(),
  deadline: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
});

const updateCareerSchema = createCareerSchema.partial();

const applySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  coverLetter: z.string().optional(),
});

const updateApplicationSchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
});

const idParamSchema = z.object({ id: z.string().uuid() });
const slugParamSchema = z.object({ slug: z.string() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  department: z.string().optional(),
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
      ...(query.department && {
        department: { contains: query.department, mode: 'insensitive' as const },
      }),
      ...(showAll ? {} : query.isActive !== undefined ? { isActive: query.isActive === 'true' } : { isActive: true }),
    };

    const [careers, total] = await Promise.all([
      prisma.career.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.career.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Careers retrieved',
      data: paginatedResponse(careers, total, page, limit),
    });
  })
);

router.get(
  '/:slug',
  validateParams(slugParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const career = await prisma.career.findUnique({
      where: { slug: req.params.slug },
    });

    if (!career || !career.isActive) throw new AppError('Career not found', 404);

    res.json({ success: true, message: 'Career retrieved', data: career });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateBody(createCareerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, deadline, ...rest } = req.body;
    const finalSlug = slug || slugify(title);

    const existing = await prisma.career.findUnique({ where: { slug: finalSlug } });
    if (existing) throw new AppError('Career slug already exists', 409);

    const career = await prisma.career.create({
      data: {
        title,
        slug: finalSlug,
        ...rest,
        deadline: deadline ? new Date(deadline) : undefined,
      },
    });

    res.status(201).json({ success: true, message: 'Career created', data: career });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateCareerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { deadline, ...rest } = req.body;

    const existing = await prisma.career.findUnique({ where: { id } });
    if (!existing) throw new AppError('Career not found', 404);

    const career = await prisma.career.update({
      where: { id },
      data: {
        ...rest,
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      },
    });

    res.json({ success: true, message: 'Career updated', data: career });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.career.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Career deleted' });
  })
);

router.post(
  '/:id/apply',
  upload.single('resume'),
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const parsed = applySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Validation failed', 400, {
        body: parsed.error.errors.map((e) => e.message),
      });
    }

    if (!req.file) {
      throw new AppError('Resume file is required', 400);
    }

    const career = await prisma.career.findUnique({ where: { id } });
    if (!career || !career.isActive) throw new AppError('Career not found', 404);

    if (career.deadline && new Date() > career.deadline) {
      throw new AppError('Application deadline has passed', 400);
    }

    const uploadResult = await uploadFile(req.file, 'green-rock/resumes');

    const application = await prisma.application.create({
      data: {
        careerId: id,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        coverLetter: parsed.data.coverLetter,
        resumeUrl: uploadResult.url,
      },
    });

    sendCareerApplicationAdminNotification({
      applicantName: parsed.data.name,
      applicantEmail: parsed.data.email,
      phone: parsed.data.phone,
      jobTitle: career.title,
      coverLetter: parsed.data.coverLetter,
      resumeUrl: uploadResult.url,
    }).catch(() => {});

    sendCareerApplicationConfirmation({
      name: parsed.data.name,
      email: parsed.data.email,
      jobTitle: career.title,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { id: application.id, status: application.status },
    });
  })
);

router.get(
  '/:id/applications',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateQuery(z.object({ page: z.string().optional(), limit: z.string().optional() })),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page, limit, skip } = parsePagination(req.query);

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { careerId: id },
        include: { reviewedBy: { select: { id: true, name: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.count({ where: { careerId: id } }),
    ]);

    res.json({
      success: true,
      message: 'Applications retrieved',
      data: paginatedResponse(applications, total, page, limit),
    });
  })
);

router.patch(
  '/applications/:applicationId',
  authenticate,
  requireAdmin,
  validateParams(z.object({ applicationId: z.string().uuid() })),
  validateBody(updateApplicationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        ...req.body,
        reviewedById: req.user!.userId,
      },
    });

    res.json({ success: true, message: 'Application updated', data: application });
  })
);

export default router;
