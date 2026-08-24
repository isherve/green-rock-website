import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
}
