import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireEmployee } from '../middleware/portalAuth';
import { validateBody } from '../middleware/validate';

const router = Router();

const leaveSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(10),
});

router.use(authenticate, requireEmployee);

router.get(
  '/dashboard',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        employeeProfile: true,
      },
    });

    const [taskCount, pendingTasks, leavePending, unreadMessages] = await Promise.all([
      prisma.task.count({ where: { assigneeId: userId } }),
      prisma.task.count({ where: { assigneeId: userId, status: { in: ['TODO', 'IN_PROGRESS'] } } }),
      prisma.leaveRequest.count({ where: { userId, status: 'PENDING' } }),
      prisma.directMessage.count({ where: { receiverId: userId, isRead: false } }),
    ]);

    res.json({
      success: true,
      data: {
        user,
        stats: { taskCount, pendingTasks, leavePending, unreadMessages },
      },
    });
  })
);

router.get(
  '/projects',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tasks = await prisma.task.findMany({
      where: { assigneeId: req.user!.userId, projectId: { not: null } },
      include: { project: { include: { images: { take: 1 } } } },
      distinct: ['projectId'],
    });
    const projects = tasks.map((t) => t.project).filter(Boolean);
    res.json({ success: true, data: projects });
  })
);

router.get(
  '/tasks',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tasks = await prisma.task.findMany({
      where: { assigneeId: req.user!.userId },
      include: { project: true },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
    });
    res.json({ success: true, data: tasks });
  })
);

router.patch(
  '/tasks/:id/status',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const task = await prisma.task.updateMany({
      where: { id: req.params.id, assigneeId: req.user!.userId },
      data: { status },
    });
    res.json({ success: true, data: task });
  })
);

router.get(
  '/attendance',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const records = await prisma.attendance.findMany({
      where: { userId: req.user!.userId },
      orderBy: { date: 'desc' },
      take: 60,
    });
    res.json({ success: true, data: records });
  })
);

router.post(
  '/attendance/check-in',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const record = await prisma.attendance.upsert({
      where: { userId_date: { userId: req.user!.userId, date: today } },
      create: {
        userId: req.user!.userId,
        date: today,
        checkIn: new Date(),
        status: 'PRESENT',
      },
      update: { checkIn: new Date(), status: 'PRESENT' },
    });
    res.json({ success: true, data: record });
  })
);

router.post(
  '/attendance/check-out',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const record = await prisma.attendance.update({
      where: { userId_date: { userId: req.user!.userId, date: today } },
      data: { checkOut: new Date() },
    });
    res.json({ success: true, data: record });
  })
);

router.get(
  '/leave',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const requests = await prisma.leaveRequest.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: requests });
  })
);

router.post(
  '/leave',
  validateBody(leaveSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const request = await prisma.leaveRequest.create({
      data: {
        userId: req.user!.userId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        reason: req.body.reason,
      },
    });
    res.status(201).json({ success: true, data: request });
  })
);

router.get(
  '/payslips',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const slips = await prisma.salarySlip.findMany({
      where: { userId: req.user!.userId },
      orderBy: { issuedAt: 'desc' },
    });
    res.json({ success: true, data: slips });
  })
);

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

router.get(
  '/reports/summary',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const [completedTasks, attendanceDays, leaveTaken] = await Promise.all([
      prisma.task.count({ where: { assigneeId: userId, status: 'DONE' } }),
      prisma.attendance.count({ where: { userId, status: 'PRESENT' } }),
      prisma.leaveRequest.count({ where: { userId, status: 'APPROVED' } }),
    ]);
    res.json({
      success: true,
      data: { completedTasks, attendanceDays, leaveTaken },
    });
  })
);

export default router;
