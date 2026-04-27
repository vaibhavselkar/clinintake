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
        if (!isSupported) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = selectVoice(voices, voiceType);
        if (selectedVoice) utterance.voice = selectedVoice;

        if (voiceType === 'agent') {
          utterance.rate = rate;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
        } else {
          utterance.rate = rate * 1.1;
          utterance.pitch = 0.95;
          utterance.volume = 1.0;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          currentUtterance.current = null;
          resolve();
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          currentUtterance.current = null;
          resolve();
        };

        currentUtterance.current = utterance;
        window.speechSynthesis.speak(utterance);
      });
    },
    [isSupported, voices, rate]
  );

  return { speak, stop, isSpeaking, isSupported, rate, setRate };
}
