export type UserRole = 'clinician' | 'patient';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface SavedBrief {
  id: string;
  sessionId: string;
  patientUid: string | null;
  patientName: string;
  patientAge: number;
  patientSex: string;
  chiefComplaint: string;
  hpi: string;
  clinicalFlags: string[];
  oldcartsCount: number;
  rosCount: number;
  turnCount: number;
  brief: import('./clinical.types').ClinicalBrief;
  createdAt: string;
  createdBy: string;
}
