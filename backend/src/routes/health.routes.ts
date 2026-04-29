import { Router, Request, Response } from 'express';
import { sessionStore } from '../utils/session.store';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const activeSessions = await sessionStore.size();
  res.json({ status: 'ok', activeSessions, timestamp: new Date().toISOString() });
});

export default router;
