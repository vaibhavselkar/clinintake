import { Router, Request, Response } from 'express';
import { sessionStore } from '../utils/session.store';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    activeSessions: sessionStore.size(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
