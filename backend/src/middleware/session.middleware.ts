import { Request, Response, NextFunction } from 'express';
import { sessionStore } from '../utils/session.store';
import { createError } from './error.middleware';

export function requireSession(req: Request, res: Response, next: NextFunction): void {
  const { id } = req.params;
  if (!id) {
    next(createError('Session ID required', 400));
    return;
  }

  const session = sessionStore.get(id);
  if (!session) {
    next(createError('Session not found or expired', 404));
    return;
  }

  res.locals.session = session;
  next();
}

// Express type doesn't put locals on res easily in middleware typings — use augmentation
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      session: import('../models/session.model').IntakeSession;
    }
  }
}
