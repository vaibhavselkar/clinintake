import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useSpeechRecognition } from './useSpeechRecognition';

export interface UseVoiceManagerReturn {
  speakAgent: (text: string) => Promise<void>;
  speakPatient: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  isSynthesisSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  recognitionError: string | null;
  isRecognitionSupported: boolean;
  resetTranscript: () => void;
  rate: number;
  setRate: (r: number) => void;
  muted: boolean;
  setMuted: (v: boolean) => void;
}

import { useState } from 'react';

export function useVoiceManager(): UseVoiceManagerReturn {
  const tts = useSpeechSynthesis();
  const stt = useSpeechRecognition();
  const [muted, setMuted] = useState(false);

  async function speakAgent(text: string): Promise<void> {
    if (muted) return;
    await tts.speak(text, 'agent');
  }

  async function speakPatient(text: string): Promise<void> {
    if (muted) return;
    await tts.speak(text, 'patient');
  }

  return {
    speakAgent,
    speakPatient,
    stopSpeaking: tts.stop,
    isSpeaking: tts.isSpeaking,
    isSynthesisSupported: tts.isSupported,
    startListening: stt.startListening,
    stopListening: stt.stopListening,
    transcript: stt.transcript,
    interimTranscript: stt.interimTranscript,
    isListening: stt.isListening,
    recognitionError: stt.error,
    isRecognitionSupported: stt.isSupported,
    resetTranscript: stt.reset,
    rate: tts.rate,
    setRate: tts.setRate,
    muted,
    setMuted,
  };
}
