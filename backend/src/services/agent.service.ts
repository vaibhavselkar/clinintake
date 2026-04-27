import { IntakeSession, IntakePhase, PHASE_ORDER } from '../models/session.model';
import { oldcartsCompletionCount, rosCompletionCount } from '../models/clinical.model';
import { buildAgentSystemPrompt } from '../prompts/agent.prompts';
import { chat, AGENT_MODEL, ChatMessage } from './groq.service';
import { logger } from '../utils/logger';

const HPI_PHASE_THRESHOLD = 7;
const ROS_PHASE_THRESHOLD = 4;
const PMH_TURN_FALLBACK = 20;

export interface AgentTurnResult {
  response: string;
  nextPhase: IntakePhase;
  phaseChanged: boolean;
}

export async function generateAgentResponse(session: IntakeSession): Promise<AgentTurnResult> {
  const systemPrompt = buildAgentSystemPrompt(session);

  const messages: ChatMessage[] = session.conversationHistory
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'agent' ? ('assistant' as const) : ('user' as const),
      content: m.content,
    }));

  const response = await chat(messages, systemPrompt, {
    model: AGENT_MODEL,
    maxTokens: 256,
    temperature: 0.6,
  });

  const nextPhase = determineNextPhase(session);
  const phaseChanged = nextPhase !== session.phase;

  if (phaseChanged) {
    logger.info(`Session ${session.id}: phase transition ${session.phase} → ${nextPhase}`);
  }

  return { response, nextPhase, phaseChanged };
}

function determineNextPhase(session: IntakeSession): IntakePhase {
  const { phase, collectedData, turnCount } = session;

  switch (phase) {
    case 'GREETING':
      // Advance after 2 turns regardless — greeting is always short
      return (collectedData.chiefComplaint || turnCount >= 2) ? 'CHIEF_COMPLAINT' : 'GREETING';

    case 'CHIEF_COMPLAINT':
      // Advance after 4 total turns even if extractor missed the CC
      return (collectedData.chiefComplaint || turnCount >= 4) ? 'HPI_OLDCARTS' : 'CHIEF_COMPLAINT';

    case 'HPI_OLDCARTS':
      return oldcartsCompletionCount(collectedData) >= HPI_PHASE_THRESHOLD ? 'ROS' : 'HPI_OLDCARTS';

    case 'ROS':
      return rosCompletionCount(collectedData) >= ROS_PHASE_THRESHOLD ? 'PMH' : 'ROS';

    case 'PMH': {
      const hasMedsAndAllergies = collectedData.medications !== null && collectedData.allergies !== null;
      if (hasMedsAndAllergies || turnCount > PMH_TURN_FALLBACK) {
        return 'CLOSING';
      }
      return 'PMH';
    }

    case 'CLOSING':
      return 'CLOSING';

    default:
      return phase;
  }
}

export function getPhaseIndex(phase: IntakePhase): number {
  return PHASE_ORDER.indexOf(phase);
}
