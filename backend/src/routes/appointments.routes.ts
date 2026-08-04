import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import {
  sendAppointmentAdminNotification,
  sendAppointmentCustomerConfirmation,
  sendEmail,
} from '../lib/email';
import { buildCustomerEmail } from '../lib/email-templates';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

const createAppointmentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  date: z.string().datetime({ message: 'Invalid date format' }),
  time: z.string().min(1),
  service: z.string().optional(),
  message: z.string().optional(),
  propertyId: z.string().uuid().optional(),
});

const updateAppointmentSchema = z.object({
  isConfirmed: z.boolean().optional(),
  date: z.string().datetime().optional(),
  time: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
});

const idParamSchema = z.object({ id: z.string().uuid() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  isConfirmed: z.enum(['true', 'false']).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

router.post(
  '/',
  optionalAuth,
  validateBody(createAppointmentSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { date, ...rest } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        ...rest,
        date: new Date(date),
        ...(req.user?.userId ? { userId: req.user.userId } : {}),
      },
    });

    const appointmentDate = new Date(date);

    sendAppointmentAdminNotification({
      name: rest.name,
      email: rest.email,
      phone: rest.phone,
      date: appointmentDate,
      time: rest.time,
      service: rest.service,
      message: rest.message,
    }).catch(() => {});

    sendAppointmentCustomerConfirmation({
      name: rest.name,
      email: rest.email,
      date: appointmentDate,
      time: rest.time,
      service: rest.service,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
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
      ...(query.isConfirmed !== undefined && { isConfirmed: query.isConfirmed === 'true' }),
      ...(query.from && { date: { gte: new Date(query.from) } }),
      ...(query.to && {
        date: {
          ...(query.from ? { gte: new Date(query.from) } : {}),
          lte: new Date(query.to),
        },
      }),
    };

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'asc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Appointments retrieved',
      data: paginatedResponse(appointments, total, page, limit),
    });
  })
);

router.get(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
    });

    if (!appointment) throw new AppError('Appointment not found', 404);

    res.json({ success: true, message: 'Appointment retrieved', data: appointment });
  })
);

router.patch(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateAppointmentSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { date, ...rest } = req.body;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) throw new AppError('Appointment not found', 404);

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(date && { date: new Date(date) }),
      },
    });

    if (req.body.isConfirmed && !existing.isConfirmed) {
      sendEmail({
        to: appointment.email,
        subject: 'Green Rock — Your Appointment is Confirmed',
        html: buildCustomerEmail({
          title: 'Appointment Confirmed',
          greeting: `Dear ${appointment.name},`,
          body: `<p style="margin:0;">Your appointment on <strong>${appointment.date.toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> at <strong>${appointment.time}</strong> has been confirmed. We look forward to meeting you.</p>`,
        }),
      }).catch(() => {});
    }

    res.json({ success: true, message: 'Appointment updated', data: appointment });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) throw new AppError('Appointment not found', 404);

    await prisma.appointment.delete({ where: { id } });

    res.json({ success: true, message: 'Appointment deleted' });
  })
);

export default router;
