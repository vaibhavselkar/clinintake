import axios, { AxiosInstance, AxiosError } from 'axios';
import { CollectedData, IntakePhase, Message, ClinicalBrief } from '../types/clinical.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!BASE_URL) throw new Error('VITE_API_BASE_URL is not set in frontend/.env');

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 45_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ error: string }>) => {
    const msg = err.response?.data?.error ?? err.message ?? 'Network error';
    return Promise.reject(new Error(msg));
  }
);

// --- Response shapes ---

export interface CreateSessionResponse {
  sessionId: string;
  patientName: string;
  patientAge: number;
  patientSex: 'male' | 'female';
  chiefComplaintHint: string;
  phase: IntakePhase;
}

export interface AgentTurnResponse {
  response: string;
  phase: IntakePhase;
  phaseChanged: boolean;
  turnCount: number;
}

export interface PatientTurnResponse {
  patientReply: string;
  collectedData: CollectedData;
  oldcartsCount: number;
  rosCount: number;
  phase: IntakePhase;
}

export interface SessionStateResponse {
  sessionId: string;
  phase: IntakePhase;
  turnCount: number;
  collectedData: CollectedData;
  oldcartsCount: number;
  rosCount: number;
  patientName: string;
}

export interface SynthesizeResponse {
  brief: ClinicalBrief;
}

export interface TranscriptResponse {
  transcript: Message[];
  turnCount: number;
}

// --- API functions ---

export async function createSession(patientKey: string): Promise<CreateSessionResponse> {
  const res = await apiClient.post<CreateSessionResponse>('/api/intake/session', { patientKey });
  return res.data;
}

export async function runAgentTurn(sessionId: string): Promise<AgentTurnResponse> {
  const res = await apiClient.post<AgentTurnResponse>(`/api/intake/${sessionId}/agent-turn`);
  return res.data;
}

export async function runPatientTurn(
  sessionId: string,
  reply: string,
  isManual = false
): Promise<PatientTurnResponse> {
  const res = await apiClient.post<PatientTurnResponse>(`/api/intake/${sessionId}/patient-turn`, {
    reply,
    isManual,
  });
  return res.data;
}

export async function getSessionState(sessionId: string): Promise<SessionStateResponse> {
  const res = await apiClient.get<SessionStateResponse>(`/api/intake/${sessionId}/state`);
  return res.data;
}

export async function synthesizeBrief(sessionId: string): Promise<SynthesizeResponse> {
  const res = await apiClient.post<SynthesizeResponse>(`/api/intake/${sessionId}/synthesize`);
  return res.data;
}

export async function getTranscript(sessionId: string): Promise<TranscriptResponse> {
  const res = await apiClient.get<TranscriptResponse>(`/api/intake/${sessionId}/transcript`);
  return res.data;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await apiClient.delete(`/api/intake/${sessionId}`);
}
