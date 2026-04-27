export type IntakeMode = 'auto' | 'manual';

export interface SessionInfo {
  sessionId: string;
  patientName: string;
  patientAge: number;
  patientSex: 'male' | 'female';
  chiefComplaintHint: string;
  startedAt: string;
}
