import clsx from 'clsx';
import { IntakePhase, PHASE_ORDER, PHASE_LABELS } from '../../types/clinical.types';

interface PhaseIndicatorProps {
  currentPhase: IntakePhase;
}

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-1">
      {PHASE_ORDER.map((phase, idx) => {
        const isCompleted = idx < currentIdx;
        const isActive = idx === currentIdx;

        return (
          <div key={phase} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className={clsx(
                'h-1.5 rounded-full transition-all duration-300',
                isCompleted ? 'bg-[#2D9B55] w-10' :
                isActive ? 'bg-[#1B6B3A] w-10' : 'bg-[#C8E6D4] w-10'
              )} />
              <span className={clsx(
                'text-[10px] mt-0.5 whitespace-nowrap',
                isActive ? 'text-[#1B6B3A] font-semibold' : 'text-[#7A9E87]'
              )}>
                {PHASE_LABELS[phase]}
              </span>
            </div>
            {idx < PHASE_ORDER.length - 1 && (
              <div className={clsx('w-2 h-px mb-3', idx < currentIdx ? 'bg-[#2D9B55]' : 'bg-[#C8E6D4]')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
