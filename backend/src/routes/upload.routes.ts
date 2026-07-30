import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { deleteFromCloudinary } from '../lib/cloudinary';
import { uploadFile, isCloudinaryConfigured } from '../lib/upload';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'application/pdf',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type'));
  },
});

const deleteSchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(['image', 'video', 'raw']).optional(),
});

router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const folder = (req.body.folder as string) || 'green-rock/uploads';
    const result = await uploadFile(req.file, folder);
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: result,
    });
  })
);

router.post(
  '/multiple',
  authenticate,
  requireAdmin,
  upload.array('files', 10),
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) throw new AppError('No files uploaded', 400);
    const folder = (req.body.folder as string) || 'green-rock/uploads';
    const results = await Promise.all(files.map((file) => uploadFile(file, folder)));
    res.status(201).json({
      success: true,
      message: `${results.length} files uploaded successfully`,
      data: results,
    });
  })
);

router.delete(
  '/',
  authenticate,
  requireAdmin,
  validateBody(deleteSchema),
  asyncHandler(async (req: Request, res: Response) => {
    if (!isCloudinaryConfigured()) {
      res.json({ success: true, message: 'Local file delete skipped' });
      return;
    }
    const { publicId, resourceType = 'image' } = req.body;
    await deleteFromCloudinary(publicId, resourceType);
    res.json({ success: true, message: 'File deleted successfully' });
  })
);

export default router;
