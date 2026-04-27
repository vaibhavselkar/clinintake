import { AlertTriangle, CheckCircle } from 'lucide-react';

interface FlagsSectionProps {
  flags: string[];
}

export function FlagsSection({ flags }: FlagsSectionProps) {
  const hasFlags = flags.length > 0 && !flags[0].toLowerCase().includes('no immediate');

  return (
    <div className={`rounded-xl p-5 mb-4 border ${hasFlags ? 'bg-[#FEF2F2] border-red-200 border-l-4 border-l-[#991B1B]' : 'bg-[#E8F5EE] border-[#C8E6D4]'}`}>
      <div className="flex items-center gap-2 mb-3">
        {hasFlags
          ? <AlertTriangle className="w-4 h-4 text-[#991B1B]" />
          : <CheckCircle className="w-4 h-4 text-[#1B6B3A]" />
        }
        <h3 className={`text-xs font-semibold uppercase tracking-wide ${hasFlags ? 'text-[#991B1B]' : 'text-[#1B6B3A]'}`}>
          Clinical Flags
        </h3>
      </div>
      {hasFlags ? (
        <ul className="space-y-1.5">
          {flags.map((flag, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#991B1B]">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#991B1B] flex-shrink-0" />
              {flag}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#1B6B3A]">{flags[0] ?? 'No immediate red flags identified.'}</p>
      )}
    </div>
  );
}
