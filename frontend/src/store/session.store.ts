import { create } from 'zustand';
import { SessionInfo, IntakeMode } from '../types/session.types';
import { PatientSummary } from '../types/patient.types';

interface SessionState {
  sessionInfo: SessionInfo | null;
  selectedPatient: PatientSummary | null;
  mode: IntakeMode;
  setSessionInfo: (info: SessionInfo) => void;
  setSelectedPatient: (patient: PatientSummary | null) => void;
  setMode: (mode: IntakeMode) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionInfo: null,
  selectedPatient: null,
  mode: 'auto',
  setSessionInfo: (info) => set({ sessionInfo: info }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setMode: (mode) => set({ mode }),
  reset: () => set({ sessionInfo: null, selectedPatient: null, mode: 'auto' }),
}));
