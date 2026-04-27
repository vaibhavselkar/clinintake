import { create } from 'zustand';
import { ClinicalBrief } from '../types/clinical.types';

interface BriefState {
  brief: ClinicalBrief | null;
  isGenerating: boolean;
  error: string | null;
  setBrief: (brief: ClinicalBrief) => void;
  setGenerating: (v: boolean) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

export const useBriefStore = create<BriefState>((set) => ({
  brief: null,
  isGenerating: false,
  error: null,
  setBrief: (brief) => set({ brief, isGenerating: false, error: null }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error, isGenerating: false }),
  reset: () => set({ brief: null, isGenerating: false, error: null }),
}));
