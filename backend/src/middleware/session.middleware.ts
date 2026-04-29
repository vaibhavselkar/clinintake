import { Request, Response, NextFunction } from 'express';
import { sessionStore } from '../utils/session.store';
import { createError } from './error.middleware';

export async function requireSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  if (!id) {
    next(createError('Session ID required', 400));
    return;
  }

  const session = await sessionStore.get(id);
  if (!session) {
    next(createError('Session not found or expired', 404));
    return;
  }

  res.locals.session = session;
  next();
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      session: import('../models/session.model').IntakeSession;
    }
  }
}
