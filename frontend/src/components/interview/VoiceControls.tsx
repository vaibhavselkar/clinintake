import { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, MessageSquare } from 'lucide-react';
import clsx from 'clsx';
import { IntakeMode } from '../../types/session.types';
import { VoiceWaveform } from './VoiceWaveform';
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
  onStartListening: (onFinalResult?: (text: string) => void) => void;
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
  const [chatInput, setChatInput] = useState('');

  // Voice mode: tap mic → speaks → auto-submits on silence
  function handleMicClick() {
    onStartListening((finalText) => {
      if (finalText.trim()) {
        onSubmitManual(finalText.trim());
      }
    });
  }

  // Chat mode: type and press Enter or Send
  function handleChatSubmit() {
    const text = chatInput.trim();
    if (!text || isProcessing) return;
    setChatInput('');
    onSubmitManual(text);
  }

  const isVoiceMode = mode === 'manual';
  const isChatMode = mode === 'chat';
  const isAutoMode = mode === 'auto';

  return (
    <div className="bg-white border-t border-[#C8E6D4] px-4 py-3">
      {/* Status / waveform row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {(isSpeaking || isListening) && (
            <VoiceWaveform active={isSpeaking || isListening} color={isListening ? '#166534' : '#1B6B3A'} />
          )}
          <span className="text-xs text-[#7A9E87]">
            {isListening
              ? 'Listening… speak now'
              : statusText || (isSpeaking ? 'Agent speaking…' : '')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed — only relevant when not muted */}
          {!muted && !isChatMode && (
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
          )}

          {/* Mute toggle — not shown in chat mode */}
          {!isChatMode && (
            <Tooltip text={muted ? 'Unmute agent voice' : 'Mute agent voice'}>
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
          )}
        </div>
      </div>

      {/* Manual voice mode — tap mic, auto-submits on silence */}
      {isVoiceMode && (
        <div className="flex gap-3 items-center">
          <button
            onClick={handleMicClick}
            disabled={isListening || isProcessing}
            className={clsx(
              'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-sm',
              isListening
                ? 'bg-red-500 text-white animate-pulse scale-110'
                : 'bg-[#1B6B3A] text-white hover:bg-[#0F4023] active:scale-95',
              isProcessing && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <div className="flex-1 min-w-0">
            {isListening ? (
              <div className="px-3 py-2 bg-[#E8F5EE] rounded-lg text-sm text-[#0D2818] min-h-[38px]">
                {interimTranscript || <span className="text-[#7A9E87] italic">Listening…</span>}
              </div>
            ) : transcript ? (
              <div className="px-3 py-2 bg-[#F0FAF4] border border-[#C8E6D4] rounded-lg text-sm text-[#0D2818]">
                <span className="text-[#7A9E87] text-xs block mb-0.5">Sending:</span>
                {transcript}
              </div>
            ) : (
              <p className="text-xs text-[#7A9E87] pl-1">
                Tap the mic to speak — sends automatically when you stop
              </p>
            )}
          </div>
        </div>
      )}

      {/* Chat-only mode — text input, no mic */}
      {isChatMode && (
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#7A9E87] flex-shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </div>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
            placeholder="Type your reply and press Enter…"
            disabled={isProcessing}
            autoFocus
            className="flex-1 px-3 py-2 text-sm border border-[#C8E6D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] bg-white text-[#0D2818] placeholder-[#7A9E87] disabled:bg-[#F0FAF4]"
          />
          <button
            onClick={handleChatSubmit}
            disabled={!chatInput.trim() || isProcessing}
            className="w-9 h-9 bg-[#1B6B3A] hover:bg-[#0F4023] text-white rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Auto mode — status only, no input */}
      {isAutoMode && !statusText && !isSpeaking && !isListening && (
        <p className="text-xs text-[#7A9E87] text-center">Auto simulation running…</p>
      )}
    </div>
  );
}
