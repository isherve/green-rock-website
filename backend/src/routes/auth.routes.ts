import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { signTokenPair, verifyRefreshToken } from '../lib/jwt';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 */
router.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const email = String(req.body.email).trim().toLowerCase();
    const password = req.body.password;
    const name = String(req.body.name).trim();
    const phone = req.body.phone ? String(req.body.phone).trim() : undefined;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, phone, role: Role.USER },
      select: userSelect,
    });

    const tokens = signTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, ...tokens },
    });
  })
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 */
router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = signTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: safeUser, ...tokens },
    });
  })
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 */
router.post(
  '/refresh',
  validateBody(refreshSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: userSelect,
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    const tokens = signTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Token refreshed',
      data: tokens,
    });
  })
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        ...userSelect,
        employeeProfile: { select: { employeeCode: true, department: true, jobTitle: true } },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'User retrieved',
      data: user,
    });
  })
);

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

router.patch(
  '/profile',
  authenticate,
  validateBody(profileUpdateSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: req.body,
      select: userSelect,
    });
    res.json({ success: true, message: 'Profile updated', data: user });
  })
);

export default router;
