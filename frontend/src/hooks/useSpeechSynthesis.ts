import { useState, useEffect, useRef, useCallback } from 'react';
import { selectVoice, VoiceType, isSpeechSynthesisSupported } from '../utils/voice.utils';

interface UseSpeechSynthesisReturn {
  speak: (text: string, voiceType: VoiceType) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  rate: number;
  setRate: (r: number) => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(0.9);
  const isSupported = isSpeechSynthesisSupported();

  // Lock voices in refs once loaded — prevents voice switching between utterances
  const agentVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const patientVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const voicesLockedRef = useRef(false);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    function lockVoices() {
      const available = window.speechSynthesis.getVoices();
      if (available.length === 0 || voicesLockedRef.current) return;
      agentVoiceRef.current = selectVoice(available, 'agent');
      patientVoiceRef.current = selectVoice(available, 'patient');
      voicesLockedRef.current = true;
    }

    lockVoices();
    window.speechSynthesis.addEventListener('voiceschanged', lockVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', lockVoices);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, voiceType: VoiceType): Promise<void> => {
      return new Promise((resolve) => {
        if (!isSupported) { resolve(); return; }

        // Clear any previous timers
        if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Use locked voices — same voice every time
        const voice = voiceType === 'agent' ? agentVoiceRef.current : patientVoiceRef.current;
        if (voice) utterance.voice = voice;

        utterance.rate = voiceType === 'agent' ? rate : rate * 1.05;
        utterance.pitch = voiceType === 'agent' ? 1.0 : 0.95;
        utterance.volume = 1.0;

        let resolved = false;
        function finish() {
          if (resolved) return;
          resolved = true;
          if (keepAliveRef.current) clearInterval(keepAliveRef.current);
          if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
          keepAliveRef.current = null;
          safetyTimerRef.current = null;
          setIsSpeaking(false);
          resolve();
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = finish;
        utterance.onerror = (e) => {
          // 'interrupted' fires when we cancel() for the next utterance — not an error
          if ((e as SpeechSynthesisErrorEvent).error === 'interrupted') return;
          finish();
        };

        // Safety timeout based on text length — resolves if onend never fires
        const wordCount = text.trim().split(/\s+/).length;
        const estimatedMs = Math.max((wordCount / rate) * 500, 5000);
        safetyTimerRef.current = setTimeout(finish, estimatedMs + 3000);

        // Chrome bug: pauses after ~15s in background tabs — keep poking it
        keepAliveRef.current = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            finish();
            return;
          }
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }, 8000);

        window.speechSynthesis.speak(utterance);
      });
    },
    [isSupported, rate]  // voices are in refs — not in deps, so speak never recreates
  );

  return { speak, stop, isSpeaking, isSupported, rate, setRate };
}
