import { Spinner } from '../shared/Spinner';

interface StatusBarProps {
  statusText: string;
  isLoading: boolean;
}

export function StatusBar({ statusText, isLoading }: StatusBarProps) {
  if (!statusText && !isLoading) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#F0FAF4] border-b border-[#C8E6D4]">
      {isLoading && <Spinner size="sm" className="text-[#1B6B3A]" />}
      <span className="text-xs text-[#3D6B50]">{statusText}</span>
    </div>
  );
}
