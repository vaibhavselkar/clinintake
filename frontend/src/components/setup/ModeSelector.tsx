import clsx from 'clsx';
import { Bot, Mic, MessageSquare } from 'lucide-react';
import { IntakeMode } from '../../types/session.types';

interface ModeSelectorProps {
  mode: IntakeMode;
  onChange: (mode: IntakeMode) => void;
}

const options: { value: IntakeMode; icon: typeof Bot; label: string; desc: string }[] = [
  { value: 'auto', icon: Bot, label: 'Auto Simulation', desc: 'AI plays both sides' },
  { value: 'manual', icon: Mic, label: 'Voice Mode', desc: 'Speak — sends automatically' },
  { value: 'chat', icon: MessageSquare, label: 'Chat Only', desc: 'Type replies, no voice' },
];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-3">
      {options.map(({ value, icon: Icon, label, desc }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={clsx(
            'flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 text-left',
            'focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] focus:ring-offset-1',
            mode === value
              ? 'border-[#1B6B3A] bg-[#E8F5EE] ring-1 ring-[#1B6B3A]'
              : 'border-[#C8E6D4] bg-white hover:bg-[#F0FAF4]'
          )}
        >
          <div className={clsx(
            'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
            mode === value ? 'bg-[#1B6B3A] text-white' : 'bg-[#E8F5EE] text-[#1B6B3A]'
          )}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className={clsx('text-sm font-semibold', mode === value ? 'text-[#0D2818]' : 'text-[#3D6B50]')}>{label}</p>
            <p className="text-xs text-[#7A9E87]">{desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
