import { Router, Request, Response } from 'express';
import { InquiryType, InquiryStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { sendInquiryNotification, sendInvoiceCustomerNotification } from '../lib/email';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { generateNumber } from '../lib/roles';
import { createUserNotification } from '../lib/notifications';

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
  assignedToId: z.string().uuid().optional().nullable(),
});

const convertInvoiceSchema = z.object({
  title: z.string().min(1).optional(),
  amount: z.number().positive(),
  dueDate: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().positive().optional().default(1),
        unitPrice: z.number().nonnegative(),
      })
    )
    .optional(),
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
  optionalAuth,
  validateBody(createInquirySchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
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
      data: {
        ...data,
        propertyId,
        productId,
        ...(req.user?.userId ? { userId: req.user.userId } : {}),
      },
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
    const { assignedToId, status } = req.body as z.infer<typeof updateInquirySchema>;

    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) throw new AppError('Inquiry not found', 404);

    let metadata = (existing.metadata as Record<string, unknown> | null) ?? {};
    if (assignedToId !== undefined) {
      if (assignedToId) {
        const staff = await prisma.user.findUnique({ where: { id: assignedToId }, select: { id: true, name: true } });
        if (!staff) throw new AppError('Staff member not found', 404);
        metadata = { ...metadata, assignedToId: staff.id, assignedToName: staff.name };
      } else {
        delete metadata.assignedToId;
        delete metadata.assignedToName;
      }
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(assignedToId !== undefined ? { metadata } : {}),
      },
      include: {
        property: { select: { id: true, title: true, slug: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    res.json({ success: true, message: 'Inquiry updated', data: inquiry });
  })
);

router.post(
  '/:id/convert-invoice',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(convertInvoiceSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: req.params.id },
      include: { property: true, product: true },
    });
    if (!inquiry) throw new AppError('Inquiry not found', 404);

    let userId = inquiry.userId;
    if (!userId) {
      let user = await prisma.user.findUnique({ where: { email: inquiry.email.toLowerCase() } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: inquiry.email.toLowerCase(),
            name: inquiry.name,
            phone: inquiry.phone,
            password: await bcrypt.hash(crypto.randomUUID(), 12),
            role: Role.USER,
          },
        });
      }
      userId = user.id;
      await prisma.inquiry.update({ where: { id: inquiry.id }, data: { userId } });
    }

    const body = req.body as z.infer<typeof convertInvoiceSchema>;
    const title =
      body.title ??
      (inquiry.property?.title
        ? `Property inquiry — ${inquiry.property.title}`
        : inquiry.product?.name
          ? `Quote — ${inquiry.product.name}`
          : `Quote for ${inquiry.name}`);

    const items =
      body.items ??
      [
        {
          description: inquiry.message.slice(0, 500),
          quantity: 1,
          unitPrice: body.amount,
        },
      ];

    const normalizedItems = items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    }));

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateNumber('GR-INV'),
        userId,
        title,
        amount: body.amount,
        currency: 'RWF',
        status: 'SENT',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        items: normalizedItems,
      },
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    const metadata = {
      ...((inquiry.metadata as Record<string, unknown> | null) ?? {}),
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
    };

    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: { status: InquiryStatus.RESOLVED, metadata },
    });

    sendInvoiceCustomerNotification({
      name: invoice.user.name,
      email: invoice.user.email,
      invoiceNumber: invoice.invoiceNumber,
      title: invoice.title,
      amount: invoice.amount,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
    }).catch(() => {});

    createUserNotification({
      userId,
      title: 'New invoice available',
      message: `Invoice ${invoice.invoiceNumber} for ${invoice.title} has been issued.`,
      link: '/portal/invoices',
      type: 'invoice',
    }).catch(() => {});

    res.status(201).json({ success: true, message: 'Invoice created from inquiry', data: invoice });
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
