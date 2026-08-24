import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { getEmailConfigStatus } from '../lib/email-config';
import { sendTestEmail } from '../lib/email';

const router = Router();

const updateSettingSchema = z.object({
  value: z.unknown(),
});

const bulkUpdateSchema = z.record(z.unknown());

const keyParamSchema = z.object({ key: z.string().min(1) });

const EMAIL_EVENTS = [
  { event: 'Contact form message', recipient: 'Admin', customerCopy: true },
  { event: 'Quote / property / material inquiry', recipient: 'Admin', customerCopy: true },
  { event: 'Appointment booking', recipient: 'Admin + Customer', customerCopy: true },
  { event: 'Newsletter subscription', recipient: 'Admin', customerCopy: false },
  { event: 'Job application', recipient: 'Admin + Applicant', customerCopy: true },
  { event: 'Material order (portal)', recipient: 'Admin + Customer', customerCopy: true },
  { event: 'Support ticket (portal)', recipient: 'Admin', customerCopy: false },
  { event: 'Ticket reply from staff', recipient: 'Customer', customerCopy: false },
  { event: 'Invoice issued', recipient: 'Customer', customerCopy: false },
  { event: 'Online payment received', recipient: 'Admin', customerCopy: false },
  { event: 'Order status update', recipient: 'Customer', customerCopy: false },
];

router.get(
  '/email/status',
  authenticate,
  requireAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Email status retrieved',
      data: {
        ...getEmailConfigStatus(),
        events: EMAIL_EVENTS,
      },
    });
  })
);

router.post(
  '/email/test',
  authenticate,
  requireAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const status = getEmailConfigStatus();
    if (!status.configured) {
      throw new AppError(status.hint, 503);
    }
    await sendTestEmail();
    res.json({
      success: true,
      message: `Test email sent to ${status.adminEmail}`,
      data: { sentTo: status.adminEmail },
    });
  })
);

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' },
    });

    const settingsMap = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, unknown>
    );

    res.json({
      success: true,
      message: 'Settings retrieved',
      data: settingsMap,
    });
  })
);

router.get(
  '/:key',
  validateParams(keyParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const setting = await prisma.settings.findUnique({
      where: { key: req.params.key },
    });

    if (!setting) throw new AppError('Setting not found', 404);

    res.json({ success: true, message: 'Setting retrieved', data: setting });
  })
);

router.put(
  '/bulk',
  authenticate,
  requireAdmin,
  validateBody(bulkUpdateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const updates = req.body as Record<string, unknown>;

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.settings.upsert({
          where: { key },
          update: { value: value as Parameters<typeof prisma.settings.upsert>[0]['create']['value'] },
          create: { key, value: value as Parameters<typeof prisma.settings.upsert>[0]['create']['value'] },
        })
      )
    );

    const settings = await prisma.settings.findMany();
    const settingsMap = settings.reduce(
      (acc, s) => {
        acc[s.key] = s.value;
        return acc;
      },
      {} as Record<string, unknown>
    );

    res.json({ success: true, message: 'Settings updated', data: settingsMap });
  })
);

router.put(
  '/:key',
  authenticate,
  requireAdmin,
  validateParams(keyParamSchema),
  validateBody(updateSettingSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;

    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value: req.body.value },
      create: { key, value: req.body.value },
    });

    res.json({ success: true, message: 'Setting updated', data: setting });
  })
);

export default router;
