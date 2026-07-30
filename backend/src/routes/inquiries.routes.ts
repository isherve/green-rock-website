import { Router, Request, Response } from 'express';
import { InquiryType, InquiryStatus } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { sendInquiryNotification } from '../lib/email';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

const createInquirySchema = z.object({
  type: z.nativeEnum(InquiryType),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  propertyId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const updateInquirySchema = z.object({
  status: z.nativeEnum(InquiryStatus).optional(),
});

const idParamSchema = z.object({ id: z.string().uuid() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.nativeEnum(InquiryType).optional(),
  status: z.nativeEnum(InquiryStatus).optional(),
  search: z.string().optional(),
});

router.post(
  '/',
  validateBody(createInquirySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId, productId, ...data } = req.body;

    if (propertyId) {
      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) throw new AppError('Property not found', 404);
    }

    if (productId) {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) throw new AppError('Product not found', 404);
    }

    const inquiry = await prisma.inquiry.create({
      data: { ...data, propertyId, productId },
      include: {
        property: { select: { id: true, title: true, slug: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    sendInquiryNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      message: data.message,
      propertyTitle: inquiry.property?.title,
      productName: inquiry.product?.name,
    }).catch(() => {});

    res.status(201).json({ success: true, message: 'Inquiry submitted', data: inquiry });
  })
);

router.get(
  '/',
  authenticate,
  requireAdmin,
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof listQuerySchema>;
    const { page, limit, skip } = parsePagination(query);

    const where = {
      ...(query.type && { type: query.type }),
      ...(query.status && { status: query.status }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' as const } },
          { email: { contains: query.search, mode: 'insensitive' as const } },
          { message: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          property: { select: { id: true, title: true, slug: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inquiry.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Inquiries retrieved',
      data: paginatedResponse(inquiries, total, page, limit),
    });
  })
);

router.get(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: req.params.id },
      include: {
        property: true,
        product: true,
      },
    });

    if (!inquiry) throw new AppError('Inquiry not found', 404);

    res.json({ success: true, message: 'Inquiry retrieved', data: inquiry });
  })
);

router.patch(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateInquirySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) throw new AppError('Inquiry not found', 404);

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: req.body,
    });

    res.json({ success: true, message: 'Inquiry updated', data: inquiry });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) throw new AppError('Inquiry not found', 404);

    await prisma.inquiry.delete({ where: { id } });

    res.json({ success: true, message: 'Inquiry deleted' });
  })
);

export default router;
