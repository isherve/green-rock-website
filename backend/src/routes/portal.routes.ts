import { Router, Response } from 'express';
import { z } from 'zod';
import { InquiryType } from '@prisma/client';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireCustomer } from '../middleware/portalAuth';
import { validateBody, validateParams } from '../middleware/validate';
import { generateNumber } from '../lib/roles';
import { buildInvoicePdf, parseInvoiceItems } from '../lib/invoice-pdf';
import {
  sendMaterialOrderAdminNotification,
  sendMaterialOrderCustomerConfirmation,
  sendTicketAdminNotification,
} from '../lib/email';
import { createUserNotification } from '../lib/notifications';

const router = Router();

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

const ticketSchema = z.object({
  subject: z.string().min(3),
  message: z.string().min(10),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

const messageSchema = z.object({
  receiverId: z.string().uuid(),
  subject: z.string().optional(),
  body: z.string().min(1),
});

const materialOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().optional(),
      name: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ).min(1),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
});

const appointmentSchema = z.object({
  date: z.string().datetime(),
  time: z.string().min(1),
  service: z.string().optional(),
  message: z.string().optional(),
  propertyId: z.string().uuid().optional(),
});

router.use(authenticate, requireCustomer);

/** Dashboard summary */
router.get(
  '/dashboard',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const [
      savedCount,
      quotesCount,
      constructionCount,
      ordersCount,
      appointmentsCount,
      openTickets,
      unreadNotifications,
      unpaidInvoices,
    ] = await Promise.all([
      prisma.favorite.count({ where: { userId } }),
      prisma.inquiry.count({ where: { userId, type: InquiryType.QUOTE } }),
      prisma.inquiry.count({ where: { userId, type: InquiryType.CONSTRUCTION } }),
      prisma.materialOrder.count({ where: { userId } }),
      prisma.appointment.count({ where: { userId } }),
      prisma.supportTicket.count({ where: { userId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
      prisma.invoice.count({ where: { userId, status: { in: ['SENT', 'OVERDUE'] } } }),
    ]);

    res.json({
      success: true,
      data: {
        user,
        stats: {
          savedProperties: savedCount,
          quotes: quotesCount,
          constructionRequests: constructionCount,
          materialOrders: ordersCount,
          appointments: appointmentsCount,
          openTickets,
          unreadNotifications,
          unpaidInvoices,
        },
      },
    });
  })
);

/** Profile */
router.patch(
  '/profile',
  validateBody(profileSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: req.body,
      select: { id: true, email: true, name: true, phone: true, avatar: true, role: true },
    });
    res.json({ success: true, message: 'Profile updated', data: user });
  })
);

/** Saved properties */
router.get(
  '/favorites',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      include: {
        property: { include: { images: { orderBy: { order: 'asc' }, take: 1 } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: favorites.map((f) => f.property) });
  })
);

router.post(
  '/favorites/:propertyId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { propertyId } = req.params;
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new AppError('Property not found', 404);

    const favorite = await prisma.favorite.upsert({
      where: { userId_propertyId: { userId: req.user!.userId, propertyId } },
      create: { userId: req.user!.userId, propertyId },
      update: {},
    });
    res.status(201).json({ success: true, data: favorite });
  })
);

router.delete(
  '/favorites/:propertyId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.favorite.deleteMany({
      where: { userId: req.user!.userId, propertyId: req.params.propertyId },
    });
    res.json({ success: true, message: 'Removed from saved properties' });
  })
);

/** Inquiries by type */
router.get(
  '/inquiries',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const type = req.query.type as InquiryType | undefined;
    const inquiries = await prisma.inquiry.findMany({
      where: {
        userId: req.user!.userId,
        ...(type ? { type } : {}),
      },
      include: { property: true, product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: inquiries });
  })
);

/** Appointments */
router.get(
  '/appointments',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user!.userId },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, data: appointments });
  })
);

router.post(
  '/appointments',
  validateBody(appointmentSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) throw new AppError('User not found', 404);

    const { date, time, service, message, propertyId } = req.body;
    const appointment = await prisma.appointment.create({
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        date: new Date(date),
        time,
        service,
        message,
        propertyId,
        userId: req.user!.userId,
      },
    });
    res.status(201).json({ success: true, data: appointment });
  })
);

/** Staff contacts for messaging */
router.get(
  '/contacts',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const contacts = await prisma.user.findMany({
      where: {
        isActive: true,
        role: { in: ['ADMIN', 'MANAGER', 'CUSTOMER_SUPPORT', 'AGENT', 'SALES_MANAGER'] },
      },
      select: { id: true, name: true, role: true, email: true },
      orderBy: { name: 'asc' },
      take: 20,
    });
    res.json({ success: true, data: contacts });
  })
);

/** Material orders */
router.get(
  '/material-orders',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await prisma.materialOrder.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders });
  })
);

router.post(
  '/material-orders',
  validateBody(materialOrderSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { items, deliveryAddress, notes } = req.body;
    const totalAmount = items.reduce(
      (sum: number, i: { quantity: number; unitPrice: number }) => sum + i.quantity * i.unitPrice,
      0
    );
    const order = await prisma.materialOrder.create({
      data: {
        orderNumber: generateNumber('MO'),
        userId: req.user!.userId,
        items,
        totalAmount,
        deliveryAddress,
        notes,
      },
    });

    const customer = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { name: true, email: true },
    });

    if (customer) {
      sendMaterialOrderAdminNotification({
        orderNumber: order.orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        totalAmount,
        currency: order.currency,
        itemCount: items.length,
      }).catch(() => {});

      sendMaterialOrderCustomerConfirmation({
        name: customer.name,
        email: customer.email,
        orderNumber: order.orderNumber,
        totalAmount,
        currency: order.currency,
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: order });
  })
);

/** Invoices & payments */
router.get(
  '/invoices',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const invoices = await prisma.invoice.findMany({
      where: { userId: req.user!.userId },
      include: { payments: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: invoices });
  })
);

router.get(
  '/invoices/:id/pdf',
  validateParams(z.object({ id: z.string().uuid() })),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });
    if (!invoice) throw new AppError('Invoice not found', 404);

    const items = parseInvoiceItems(invoice.items);
    const pdf = await buildInvoicePdf({
      invoiceNumber: invoice.invoiceNumber,
      title: invoice.title,
      amount: invoice.amount,
      currency: invoice.currency,
      status: invoice.status,
      dueDate: invoice.dueDate,
      createdAt: invoice.createdAt,
      items,
      customer: {
        name: invoice.user.name,
        email: invoice.user.email,
        phone: invoice.user.phone,
      },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    res.send(pdf);
  })
);

router.get(
  '/payments',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.userId },
      include: { invoice: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: payments });
  })
);

/** Support tickets */
router.get(
  '/tickets',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: req.user!.userId },
      include: { replies: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: tickets });
  })
);

router.post(
  '/tickets',
  validateBody(ticketSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber: generateNumber('TKT'),
        userId: req.user!.userId,
        subject: req.body.subject,
        message: req.body.message,
        priority: req.body.priority ?? 'MEDIUM',
      },
    });

    if (user) {
      sendTicketAdminNotification({
        ticketNumber: ticket.ticketNumber,
        customerName: user.name,
        customerEmail: user.email,
        subject: ticket.subject,
        message: ticket.message,
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: ticket });
  })
);

/** Documents */
router.get(
  '/documents',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const documents = await prisma.document.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: documents });
  })
);

/** Notifications */
router.get(
  '/notifications',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: notifications });
  })
);

router.patch(
  '/notifications/:id/read',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { isRead: true },
    });
    res.json({ success: true, message: 'Marked as read' });
  })
);

router.patch(
  '/notifications/read-all',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true, message: 'All notifications marked as read' });
  })
);

/** Messages */
router.get(
  '/messages',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const messages = await prisma.directMessage.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json({ success: true, data: messages });
  })
);

router.post(
  '/messages',
  validateBody(messageSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const message = await prisma.directMessage.create({
      data: {
        senderId: req.user!.userId,
        receiverId: req.body.receiverId,
        subject: req.body.subject,
        body: req.body.body,
      },
    });
    res.status(201).json({ success: true, data: message });
  })
);

export default router;
