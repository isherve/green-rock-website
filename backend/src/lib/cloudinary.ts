import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { AppError } from '../utils/AppError';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
}

export async function uploadToCloudinary(
  file: Express.Multer.File | Buffer,
  options: UploadOptions = {}
): Promise<UploadApiResponse> {
  const { folder = 'green-rock', resourceType = 'auto', publicId } = options;

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new AppError('Cloudinary is not configured', 503);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError(error?.message || 'Upload failed', 500));
          return;
        }
        resolve(result);
      }
    );

    if (Buffer.isBuffer(file)) {
      uploadStream.end(file);
    } else {
      uploadStream.end(file.buffer);
    }
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new AppError('Cloudinary is not configured', 503);
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export default cloudinary;
