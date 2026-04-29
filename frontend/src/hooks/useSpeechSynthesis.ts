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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(0.9);
  const isSupported = isSpeechSynthesisSupported();
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    function loadVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, voiceType: VoiceType): Promise<void> => {
      return new Promise((resolve) => {
        if (!isSupported) { resolve(); return; }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = selectVoice(voices, voiceType);
        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.rate = voiceType === 'agent' ? rate : rate * 1.1;
        utterance.pitch = voiceType === 'agent' ? 1.0 : 0.95;
        utterance.volume = 1.0;

        // Safety timeout — Chrome sometimes stalls onend for long utterances
        // Estimate ~80ms per word, minimum 4s, maximum 30s
        const wordCount = text.split(' ').length;
        const timeoutMs = Math.min(Math.max(wordCount * 80 / utterance.rate, 4000), 30000);
        const safetyTimer = setTimeout(() => {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          currentUtterance.current = null;
          resolve();
        }, timeoutMs);

        function finish() {
          clearTimeout(safetyTimer);
          setIsSpeaking(false);
          currentUtterance.current = null;
          resolve();
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = finish;
        utterance.onerror = finish;

        currentUtterance.current = utterance;
        window.speechSynthesis.speak(utterance);

        // Chrome bug: speechSynthesis pauses after ~15s in background tabs
        // keepalive interval pokes it every 10s
        const keepAlive = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(keepAlive);
            return;
          }
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }, 10000);

        utterance.onend = () => { clearInterval(keepAlive); finish(); };
        utterance.onerror = () => { clearInterval(keepAlive); finish(); };
      });
    },
    [isSupported, voices, rate]
  );

  return { speak, stop, isSpeaking, isSupported, rate, setRate };
}
