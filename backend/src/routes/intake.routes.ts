import { Router } from 'express';
import {
  createSession,
  agentTurn,
  patientTurn,
  getSessionState,
  synthesizeBrief,
  getTranscript,
  deleteSession,
} from '../controllers/intake.controller';
import { requireBody } from '../middleware/validate.middleware';

const router = Router();

router.post('/session', requireBody('patientKey'), createSession);
router.post('/:id/agent-turn', agentTurn);
router.post('/:id/patient-turn', patientTurn);
router.get('/:id/state', getSessionState);
router.post('/:id/synthesize', synthesizeBrief);
router.get('/:id/transcript', getTranscript);
router.delete('/:id', deleteSession);

export default router;
