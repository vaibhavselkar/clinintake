import clsx from 'clsx';
import { Message } from '../../types/clinical.types';
import { formatTime } from '../../utils/clinical.utils';

interface MessageBubbleProps {
  message: Message;
  patientInitials: string;
}

export function MessageBubble({ message, patientInitials }: MessageBubbleProps) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-[#7A9E87] italic px-3 py-1 bg-[#F0FAF4] rounded-full border border-[#C8E6D4]">
          {message.content}
        </span>
      </div>
    );
  }

  const isAgent = message.role === 'agent';

  return (
    <div className={clsx('flex items-end gap-2 mb-3', isAgent ? 'justify-start' : 'justify-end')}>
      {isAgent && (
        <div className="w-8 h-8 rounded-full bg-[#1B6B3A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
          RN
        </div>
      )}

      <div className={clsx(
        'max-w-[75%] rounded-2xl px-4 py-2.5',
        isAgent
          ? 'bg-white border border-[#C8E6D4] border-l-4 border-l-[#1B6B3A] rounded-bl-sm'
          : 'bg-[#DCFCE7] text-[#166534] rounded-br-sm'
      )}>
        <p className={clsx('text-sm leading-relaxed', isAgent ? 'text-[#0D2818]' : 'text-[#166534]')}>
          {message.content}
        </p>
        <p className="text-[10px] text-[#7A9E87] mt-1">{formatTime(message.timestamp)}</p>
      </div>

      {!isAgent && (
        <div className="w-8 h-8 rounded-full bg-[#166534] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
          {patientInitials}
        </div>
      )}
    </div>
  );
}
