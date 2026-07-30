import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { sendNewsletterAdminNotification } from '../lib/email';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

router.post(
  '/subscribe',
  validateBody(subscribeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.isActive) {
        throw new AppError('Email is already subscribed', 409);
      }

      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
      });

      sendNewsletterAdminNotification(email).catch(() => {});

      return res.json({
        success: true,
        message: 'Successfully resubscribed to newsletter',
      });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });

    sendNewsletterAdminNotification(email).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });
  })
);

router.post(
  '/unsubscribe',
  validateBody(unsubscribeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (!existing || !existing.isActive) {
      throw new AppError('Email is not subscribed', 404);
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false },
    });

    res.json({ success: true, message: 'Successfully unsubscribed from newsletter' });
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
      ...(query.isActive !== undefined && { isActive: query.isActive === 'true' }),
    };

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Subscribers retrieved',
      data: paginatedResponse(subscribers, total, page, limit),
    });
  })
);

export default router;
