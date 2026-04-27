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

export interface IntakeSession {
  id: string;
  patientKey: string;
  profile: PatientProfile;
  phase: IntakePhase;
  turnCount: number;
  conversationHistory: Message[];
  patientHistory: Message[];
  collectedData: CollectedClinicalData;
  createdAt: Date;
  lastActivity: Date;
}
