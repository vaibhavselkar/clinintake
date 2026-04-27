import { useEffect, useRef } from 'react';
import { Message } from '../../types/clinical.types';
import { MessageBubble } from './MessageBubble';
import { getInitials } from '../../utils/clinical.utils';

interface TranscriptPaneProps {
  messages: Message[];
  patientName: string;
  isAgentThinking: boolean;
  isPatientThinking: boolean;
}

function TypingDots() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-[#1B6B3A] flex items-center justify-center text-white text-xs font-bold">RN</div>
      <div className="bg-white border border-[#C8E6D4] border-l-4 border-l-[#1B6B3A] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-[#7A9E87] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function TranscriptPane({ messages, patientName, isAgentThinking, isPatientThinking }: TranscriptPaneProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const initials = getInitials(patientName);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentThinking, isPatientThinking]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-0">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-sm text-[#7A9E87]">
          Starting interview…
        </div>
      )}
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} patientInitials={initials} />
      ))}
      {isAgentThinking && <TypingDots />}
      {isPatientThinking && (
        <div className="flex items-end gap-2 mb-3 justify-end">
          <div className="bg-[#DCFCE7] rounded-2xl rounded-br-sm px-4 py-3 flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 bg-[#166534] rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="w-8 h-8 rounded-full bg-[#166534] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
