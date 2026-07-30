import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((issue) => {
        const path = issue.path.join('.') || target;
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });

      throw new AppError('Validation failed', 400, errors);
    }

    req[target] = result.data;
    next();
  };
}

export function validateBody(schema: ZodSchema) {
  return validate(schema, 'body');
}

export function validateQuery(schema: ZodSchema) {
  return validate(schema, 'query');
}

export function validateParams(schema: ZodSchema) {
  return validate(schema, 'params');
}
