import { CollectedClinicalData } from './clinical.model';
import { PatientProfile } from './patient.model';

export type IntakePhase =
  | 'GREETING'
  | 'CHIEF_COMPLAINT'
  | 'HPI_OLDCARTS'
  | 'ROS'
  | 'PMH'
  | 'CLOSING';

export const PHASE_ORDER: IntakePhase[] = [
  'GREETING',
  'CHIEF_COMPLAINT',
  'HPI_OLDCARTS',
  'ROS',
  'PMH',
  'CLOSING',
];

export type MessageRole = 'agent' | 'patient' | 'system';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface PriorVisitContext {
  visitDate: string;
  chiefComplaint: string;
  hpi: string;
  pmh: string;
  medications: string;
  allergies: string;
  clinicalFlags: string[];
}

export interface IntakeSession {
  id: string;
  patientKey: string;
  profile: PatientProfile;
  phase: IntakePhase;
  turnCount: number;
  conversationHistory: Message[];
  patientHistory: Message[];
  collectedData: CollectedClinicalData;
  priorContext: PriorVisitContext | null;
  createdAt: Date;
  lastActivity: Date;
}
