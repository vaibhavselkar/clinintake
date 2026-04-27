import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sessionStore } from '../utils/session.store';
import { createError } from '../middleware/error.middleware';
import { getPatientByKey } from '../data/patients';
import { emptyCollectedData, oldcartsCompletionCount, rosCompletionCount } from '../models/clinical.model';
import { IntakeSession, Message } from '../models/session.model';
import { generateAgentResponse } from '../services/agent.service';
import { generatePatientResponse } from '../services/patient.service';
import { extractClinicalData, mergeExtractionIntoSession } from '../services/extractor.service';
import { synthesizeClinicalBrief } from '../services/synthesis.service';
import { ChatMessage } from '../services/groq.service';
import { logger } from '../utils/logger';

function toGroqMessages(messages: Message[]): ChatMessage[] {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'agent' ? ('assistant' as const) : ('user' as const),
      content: m.content,
    }));
}

export async function createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientKey } = req.body as { patientKey: string };
    const profile = getPatientByKey(patientKey);

    if (!profile) {
      next(createError(`Unknown patient key: ${patientKey}`, 400));
      return;
    }

    const session: IntakeSession = {
      id: uuidv4(),
      patientKey,
      profile,
      phase: 'GREETING',
      turnCount: 0,
      conversationHistory: [],
      patientHistory: [],
      collectedData: emptyCollectedData(),
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    sessionStore.set(session);
    logger.info(`Session created: ${session.id} for patient ${profile.name}`);

    res.status(201).json({
      sessionId: session.id,
      patientName: profile.name,
      patientAge: profile.age,
      patientSex: profile.sex,
      chiefComplaintHint: profile.chiefComplaintHint,
      phase: session.phase,
    });
  } catch (err) {
    next(err);
  }
}

export async function agentTurn(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = sessionStore.get(req.params.id);
    if (!session) {
      next(createError('Session not found or expired', 404));
      return;
    }

    const result = await generateAgentResponse(session);

    const agentMessage: Message = {
      role: 'agent',
      content: result.response,
      timestamp: new Date().toISOString(),
    };
    session.conversationHistory.push(agentMessage);
    session.phase = result.nextPhase;
    session.turnCount += 1;
    sessionStore.set(session);

    res.json({
      response: result.response,
      phase: session.phase,
      phaseChanged: result.phaseChanged,
      turnCount: session.turnCount,
    });
  } catch (err) {
    next(err);
  }
}

export async function patientTurn(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = sessionStore.get(req.params.id);
    if (!session) {
      next(createError('Session not found or expired', 404));
      return;
    }

    const { reply, isManual } = req.body as { reply: string; isManual?: boolean };

    let patientReply: string;

    if (isManual) {
      patientReply = reply;
    } else {
      const lastAgentMsg = [...session.conversationHistory]
        .reverse()
        .find((m) => m.role === 'agent');

      patientReply = await generatePatientResponse(
        session.profile,
        toGroqMessages(session.patientHistory),
        lastAgentMsg?.content ?? 'How are you feeling today?'
      );
    }

    const patientMessage: Message = {
      role: 'patient',
      content: patientReply,
      timestamp: new Date().toISOString(),
    };
    session.conversationHistory.push(patientMessage);
    session.patientHistory.push({
      role: 'patient',
      content: patientReply,
      timestamp: new Date().toISOString(),
    });

    const lastAgentTurn = [...session.conversationHistory]
      .reverse()
      .find((m) => m.role === 'agent');
    const extracted = await extractClinicalData(
      lastAgentTurn?.content ?? '',
      patientReply
    );
    session.collectedData = mergeExtractionIntoSession(session.collectedData, extracted);

    sessionStore.set(session);

    res.json({
      patientReply,
      collectedData: session.collectedData,
      oldcartsCount: oldcartsCompletionCount(session.collectedData),
      rosCount: rosCompletionCount(session.collectedData),
      phase: session.phase,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSessionState(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = sessionStore.get(req.params.id);
    if (!session) {
      next(createError('Session not found or expired', 404));
      return;
    }

    res.json({
      sessionId: session.id,
      phase: session.phase,
      turnCount: session.turnCount,
      collectedData: session.collectedData,
      oldcartsCount: oldcartsCompletionCount(session.collectedData),
      rosCount: rosCompletionCount(session.collectedData),
      patientName: session.profile.name,
    });
  } catch (err) {
    next(err);
  }
}

export async function synthesizeBrief(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = sessionStore.get(req.params.id);
    if (!session) {
      next(createError('Session not found or expired', 404));
      return;
    }

    const brief = await synthesizeClinicalBrief(session);
    res.json({ brief });
  } catch (err) {
    next(err);
  }
}

export async function getTranscript(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = sessionStore.get(req.params.id);
    if (!session) {
      next(createError('Session not found or expired', 404));
      return;
    }

    res.json({
      transcript: session.conversationHistory,
      turnCount: session.turnCount,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = sessionStore.delete(req.params.id);
    if (!deleted) {
      next(createError('Session not found', 404));
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
