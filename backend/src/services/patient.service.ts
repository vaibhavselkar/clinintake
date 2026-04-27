import { PatientProfile } from '../models/patient.model';
import { buildPatientSystemPrompt } from '../prompts/patient.prompts';
import { chat, AGENT_MODEL, ChatMessage } from './groq.service';

export async function generatePatientResponse(
  profile: PatientProfile,
  patientHistory: ChatMessage[],
  agentMessage: string
): Promise<string> {
  const systemPrompt = buildPatientSystemPrompt(profile);

  const messages: ChatMessage[] = [
    ...patientHistory,
    { role: 'user', content: agentMessage },
  ];

  const response = await chat(messages, systemPrompt, {
    model: AGENT_MODEL,
    maxTokens: 200,
    temperature: 0.75,
  });

  return response;
}
