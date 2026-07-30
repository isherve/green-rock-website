import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers,
      totalProperties,
      totalProjects,
      totalProducts,
      totalInquiries,
      newInquiries,
      totalAppointments,
      pendingAppointments,
      totalBlogPosts,
      publishedBlogPosts,
      totalApplications,
      pendingApplications,
      newsletterSubscribers,
      unreadMessages,
      inquiriesThisMonth,
      inquiriesLastMonth,
      propertiesByStatus,
      propertiesByType,
      recentInquiries,
      recentAppointments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.project.count(),
      prisma.product.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { isConfirmed: false } }),
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.inquiry.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.inquiry.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      prisma.property.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.property.groupBy({
        by: ['propertyType'],
        _count: { propertyType: true },
      }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.appointment.findMany({
        take: 5,
        where: { date: { gte: now } },
        orderBy: { date: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          date: true,
          time: true,
          isConfirmed: true,
        },
      }),
    ]);

    const inquiryGrowth =
      inquiriesLastMonth > 0
        ? Math.round(((inquiriesThisMonth - inquiriesLastMonth) / inquiriesLastMonth) * 100)
        : inquiriesThisMonth > 0
          ? 100
          : 0;

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved',
      data: {
        overview: {
          totalUsers,
          totalProperties,
          totalProjects,
          totalProducts,
          totalInquiries,
          newInquiries,
          totalAppointments,
          pendingAppointments,
          totalBlogPosts,
          publishedBlogPosts,
          totalApplications,
          pendingApplications,
          newsletterSubscribers,
          unreadMessages,
        },
        trends: {
          inquiriesThisMonth,
          inquiriesLastMonth,
          inquiryGrowthPercent: inquiryGrowth,
        },
        charts: {
          propertiesByStatus: propertiesByStatus.map((item) => ({
            status: item.status,
            count: item._count.status,
          })),
          propertiesByType: propertiesByType.map((item) => ({
            type: item.propertyType,
            count: item._count.propertyType,
          })),
        },
        recent: {
          inquiries: recentInquiries,
          appointments: recentAppointments,
        },
      },
    });
  })
);

export default router;
