import { useState } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useSpeechRecognition } from './useSpeechRecognition';
import { IntakeMode } from '../types/session.types';

export interface UseVoiceManagerReturn {
  speakAgent: (text: string) => Promise<void>;
  speakPatient: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  isSynthesisSupported: boolean;
  startListening: (onFinalResult?: (text: string) => void) => void;
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

export function useVoiceManager(mode: IntakeMode = 'auto'): UseVoiceManagerReturn {
  const tts = useSpeechSynthesis();
  const stt = useSpeechRecognition();
  // chat mode: fully silent. auto + manual (voice): agent speaks
  const [muted, setMuted] = useState(mode === 'chat');

  async function speakAgent(text: string): Promise<void> {
    if (muted || mode === 'chat') return;
    await tts.speak(text, 'agent');
  }

  async function speakPatient(text: string): Promise<void> {
    // In voice/manual mode patient speaks themselves — don't TTS their reply
    if (muted || mode === 'chat' || mode === 'manual') return;
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
