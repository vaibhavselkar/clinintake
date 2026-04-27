import clsx from 'clsx';

interface VoiceWaveformProps {
  active: boolean;
  color?: string;
}

const BAR_HEIGHTS = [4, 7, 10, 14, 10, 7, 4, 7, 10, 7, 4];

export function VoiceWaveform({ active, color = '#1B6B3A' }: VoiceWaveformProps) {
  return (
    <div className="flex items-center gap-0.5 h-6">
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={clsx('w-1 rounded-full transition-all', active ? 'animate-pulse' : 'opacity-30')}
          style={{
            backgroundColor: color,
            height: active ? `${h}px` : '4px',
            animationDelay: `${i * 60}ms`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}
