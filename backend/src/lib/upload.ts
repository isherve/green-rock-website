import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError';

export async function saveLocalUpload(file: Express.Multer.File): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const ext = path.extname(file.originalname) || '.bin';
  const filename = `${uuidv4()}${ext}`;
  const filepath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(filepath, file.buffer);

  const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${filename}`;
}

export function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY);
}

export async function uploadFile(file: Express.Multer.File, folder = 'green-rock/uploads') {
  if (isCloudinaryConfigured()) {
    const { uploadToCloudinary } = await import('./cloudinary');
    const isVideo = file.mimetype.startsWith('video/');
    const isPdf = file.mimetype === 'application/pdf';
    const resourceType = isVideo ? 'video' : isPdf ? 'raw' : 'image';
    const result = await uploadToCloudinary(file, { folder, resourceType });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    };
  }

  if (process.env.VERCEL && !isCloudinaryConfigured()) {
    throw new AppError(
      'File uploads on Vercel require Cloudinary. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      503
    );
  }

  const url = await saveLocalUpload(file);
  return { url, publicId: null, format: path.extname(file.originalname).slice(1), resourceType: 'image' };
}
