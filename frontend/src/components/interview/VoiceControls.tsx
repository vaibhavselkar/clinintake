import { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react';
import clsx from 'clsx';
import { IntakeMode } from '../../types/session.types';
import { VoiceWaveform } from './VoiceWaveform';
import { Button } from '../shared/Button';
import { Tooltip } from '../shared/Tooltip';

interface VoiceControlsProps {
  mode: IntakeMode;
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  muted: boolean;
  rate: number;
  interimTranscript: string;
  transcript: string;
  onStartListening: () => void;
  onSubmitManual: (text: string) => void;
  onToggleMute: () => void;
  onSetRate: (r: number) => void;
  statusText: string;
}

const RATES = [0.8, 1.0, 1.2];

export function VoiceControls({
  mode, isSpeaking, isListening, isProcessing, muted, rate,
  interimTranscript, transcript, onStartListening, onSubmitManual,
  onToggleMute, onSetRate, statusText,
}: VoiceControlsProps) {
  const [manualInput, setManualInput] = useState('');

  function handleManualSubmit() {
    const text = manualInput.trim() || transcript.trim();
    if (!text) return;
    setManualInput('');
    onSubmitManual(text);
  }

  return (
    <div className="bg-white border-t border-[#C8E6D4] px-4 py-3">
      {/* Status / waveform row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {(isSpeaking || isListening) && (
            <VoiceWaveform active={isSpeaking || isListening} color={isListening ? '#166534' : '#1B6B3A'} />
          )}
          <span className="text-xs text-[#7A9E87]">
            {statusText || (isListening ? 'Listening…' : isSpeaking ? 'Speaking…' : '')}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Speed */}
          <div className="flex gap-0.5">
            {RATES.map((r) => (
              <button
                key={r}
                onClick={() => onSetRate(r)}
                className={clsx(
                  'px-2 py-0.5 text-[10px] rounded font-mono transition-colors',
                  rate === r ? 'bg-[#1B6B3A] text-white' : 'text-[#7A9E87] hover:bg-[#E8F5EE]'
                )}
              >
                {r}x
              </button>
            ))}
          </div>

          {/* Mute */}
          <Tooltip text={muted ? 'Unmute' : 'Mute agent'}>
            <button
              onClick={onToggleMute}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#E8F5EE] transition-colors"
            >
              {muted
                ? <VolumeX className="w-4 h-4 text-[#991B1B]" />
                : <Volume2 className="w-4 h-4 text-[#3D6B50]" />
              }
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Manual mode input */}
      {mode === 'manual' && (
        <div className="flex gap-2">
          <button
            onClick={onStartListening}
            disabled={isListening || isProcessing}
            className={clsx(
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-[#1B6B3A] text-white hover:bg-[#0F4023]',
              (isProcessing) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={isListening ? (interimTranscript || 'Listening…') : (manualInput || transcript)}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
            placeholder="Type or speak your reply…"
            disabled={isListening || isProcessing}
            className="flex-1 px-3 py-2 text-sm border border-[#C8E6D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] bg-white text-[#0D2818] placeholder-[#7A9E87] disabled:bg-[#F0FAF4]"
          />

          <Button
            size="sm"
            onClick={handleManualSubmit}
            disabled={(!manualInput.trim() && !transcript.trim()) || isProcessing}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
