import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { parsePagination, paginatedResponse } from '../utils/pagination';

const router = Router();

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).default(Role.USER),
  avatar: z.string().url().optional(),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  role: z.nativeEnum(Role).optional(),
  avatar: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

const idParamSchema = z.object({ id: z.string().uuid() });

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

const userSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  avatar: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

router.use(authenticate, requireAdmin);

router.get(
  '/',
  validateQuery(listQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { role, search, isActive } = req.query as z.infer<typeof listQuerySchema>;

    const where = {
      ...(role && { role }),
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Users retrieved',
      data: paginatedResponse(users, total, page, limit),
    });
  })
);

router.get(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: userSelect,
    });

    if (!user) throw new AppError('User not found', 404);

    res.json({ success: true, message: 'User retrieved', data: user });
  })
);

router.post(
  '/',
  validateBody(createUserSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, phone, role, avatar } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already exists', 409);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, phone, role, avatar },
      select: userSelect,
    });

    res.status(201).json({ success: true, message: 'User created', data: user });
  })
);

router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateUserSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new AppError('User not found', 404);

    const data = {
      ...rest,
      ...(password && { password: await bcrypt.hash(password, 12) }),
    };

    const user = await prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });

    res.json({ success: true, message: 'User updated', data: user });
  })
);

router.delete(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (id === req.user!.userId) {
      throw new AppError('Cannot delete your own account', 400);
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new AppError('User not found', 404);

    await prisma.user.delete({ where: { id } });

    res.json({ success: true, message: 'User deleted' });
  })
);

export default router;
