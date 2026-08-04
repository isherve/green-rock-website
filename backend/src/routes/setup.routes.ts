import { Router } from 'express';
import { execSync } from 'node:child_process';
import path from 'node:path';
import prisma from '../lib/prisma';

const router = Router();

function runSeed() {
  const backendRoot = path.join(__dirname, '../..');
  execSync('npx tsx prisma/seed.ts', { cwd: backendRoot, stdio: 'pipe' });
}

router.get('/status', async (_req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@greenrock.com';
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    res.json({
      success: true,
      data: {
        database: 'connected',
        seeded: Boolean(admin),
        adminEmail,
        platform: process.env.VERCEL ? 'vercel' : 'node',
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: error instanceof Error ? error.message : 'Database unavailable',
    });
  }
});

router.post('/seed', async (req, res, next) => {
  try {
    const secret = process.env.SETUP_SECRET;
    if (!secret) {
      res.status(503).json({
        success: false,
        message: 'SETUP_SECRET is not configured on the server.',
      });
      return;
    }

    const provided = req.header('x-setup-secret');
    if (provided !== secret) {
      res.status(401).json({ success: false, message: 'Invalid setup secret.' });
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@greenrock.com';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
      res.json({
        success: true,
        message: 'Database already seeded.',
        data: { adminEmail },
      });
      return;
    }

    runSeed();

    res.json({
      success: true,
      message: 'Database seeded successfully.',
      data: {
        adminEmail,
        adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123456',
        customer: 'customer@greenrock.com / Customer@123',
        employee: 'employee@greenrock.com / Employee@123',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
