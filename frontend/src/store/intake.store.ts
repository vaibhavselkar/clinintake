import { create } from 'zustand';
import { Message, IntakePhase, CollectedData, OLDCARTS_FIELDS, ROS_SYSTEMS } from '../types/clinical.types';

function emptyCollectedData(): CollectedData {
  const oldcarts = {} as Record<string, string | null>;
  for (const f of OLDCARTS_FIELDS) oldcarts[f] = null;
  const ros = {} as Record<string, string | null>;
  for (const s of ROS_SYSTEMS) ros[s] = null;
  return {
    chiefComplaint: null,
    oldcarts: oldcarts as CollectedData['oldcarts'],
    ros: ros as CollectedData['ros'],
    pmh: null,
    medications: null,
    allergies: null,
  };
}

interface IntakeState {
  messages: Message[];
  phase: IntakePhase;
  turnCount: number;
  collectedData: CollectedData;
  oldcartsCount: number;
  rosCount: number;
  isAgentThinking: boolean;
  isPatientThinking: boolean;
  statusText: string;
  addMessage: (msg: Message) => void;
  setPhase: (phase: IntakePhase) => void;
  setTurnCount: (count: number) => void;
  setCollectedData: (data: CollectedData, oldcartsCount: number, rosCount: number) => void;
  setAgentThinking: (v: boolean) => void;
  setPatientThinking: (v: boolean) => void;
  setStatusText: (text: string) => void;
  reset: () => void;
}

export const useIntakeStore = create<IntakeState>((set) => ({
  messages: [],
  phase: 'GREETING',
  turnCount: 0,
  collectedData: emptyCollectedData(),
  oldcartsCount: 0,
  rosCount: 0,
  isAgentThinking: false,
  isPatientThinking: false,
  statusText: 'Initializing…',
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setPhase: (phase) => set({ phase }),
  setTurnCount: (turnCount) => set({ turnCount }),
  setCollectedData: (collectedData, oldcartsCount, rosCount) =>
    set({ collectedData, oldcartsCount, rosCount }),
  setAgentThinking: (isAgentThinking) => set({ isAgentThinking }),
  setPatientThinking: (isPatientThinking) => set({ isPatientThinking }),
  setStatusText: (statusText) => set({ statusText }),
  reset: () =>
    set({
      messages: [],
      phase: 'GREETING',
      turnCount: 0,
      collectedData: emptyCollectedData(),
      oldcartsCount: 0,
      rosCount: 0,
      isAgentThinking: false,
      isPatientThinking: false,
      statusText: 'Initializing…',
    }),
}));
