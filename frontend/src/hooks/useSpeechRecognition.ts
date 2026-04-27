import { useState, useRef, useCallback } from 'react';
import { isSpeechRecognitionSupported } from '../utils/voice.utils';

interface UseSpeechRecognitionReturn {
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  error: string | null;
  isSupported: boolean;
  reset: () => void;
}

const SILENCE_TIMEOUT_MS = 8_000;

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvt) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionResultEvt) => void) | null;
}

interface SpeechRecognitionResultEvt extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvt extends Event {
  error: string;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  const w = window as unknown as Record<string, unknown>;
  if ('SpeechRecognition' in window) return w['SpeechRecognition'] as SpeechRecognitionCtor;
  if ('webkitSpeechRecognition' in window) return w['webkitSpeechRecognition'] as SpeechRecognitionCtor;
  return null;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSupported = isSpeechRecognitionSupported();
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearSilenceTimer() {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  }

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');

    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      silenceTimer.current = setTimeout(() => {
        recognition.stop();
      }, SILENCE_TIMEOUT_MS);
    };

    recognition.onresult = (event: SpeechRecognitionResultEvt) => {
      clearSilenceTimer();
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) setTranscript((prev) => prev + final);
      setInterimTranscript(interim);
      silenceTimer.current = setTimeout(() => recognition.stop(), SILENCE_TIMEOUT_MS);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvt) => {
      clearSilenceTimer();
      setIsListening(false);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      clearSilenceTimer();
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.start();
  }, [isSupported]);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return { startListening, stopListening, transcript, interimTranscript, isListening, error, isSupported, reset };
}
