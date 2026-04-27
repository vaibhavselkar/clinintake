import { Request, Response, NextFunction } from 'express';
import { createError } from './error.middleware';

export function requireBody(...fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        next(createError(`Missing required field: ${field}`, 400));
        return;
      }
    }
    next();
  };
}
