import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { sendContactNotification, sendContactCustomerConfirmation, notifyAll } from '../lib/email';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';
import { AppError } from '../utils/AppError';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const idParamSchema = z.object({ id: z.string().uuid() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  isRead: z.enum(['true', 'false']).optional(),
});

router.post(
  '/',
  validateBody(contactSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const message = await prisma.contactMessage.create({ data: req.body });

    await notifyAll([
      { label: 'contact-admin', fn: () => sendContactNotification(req.body) },
      {
        label: 'contact-customer',
        fn: () => sendContactCustomerConfirmation({ name: req.body.name, email: req.body.email }),
      },
    ]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon.',
      data: { id: message.id },
    });
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
      ...(query.isRead !== undefined && { isRead: query.isRead === 'true' }),
    };

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Contact messages retrieved',
      data: paginatedResponse(messages, total, page, limit),
    });
  })
);

router.patch(
  '/:id/read',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });

    res.json({ success: true, message: 'Message marked as read', data: message });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const existing = await prisma.contactMessage.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError('Message not found', 404);

    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Message deleted' });
  })
);

export default router;
