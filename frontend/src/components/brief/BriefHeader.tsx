import { Cross, Lock } from 'lucide-react';
import { formatDate } from '../../utils/clinical.utils';

interface BriefHeaderProps {
  patientName: string;
  patientAge: number;
  patientSex: 'male' | 'female';
  generatedAt: string;
  turnCount: number;
}

export function BriefHeader({ patientName, patientAge, patientSex, generatedAt, turnCount }: BriefHeaderProps) {
  return (
    <div className="bg-[#1B6B3A] rounded-xl p-5 text-white mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Cross className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs text-green-200 font-mono">ClinIntake</p>
            <p className="text-sm font-semibold leading-tight">Pre-Visit Clinical Brief</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1">
          <Lock className="w-3 h-3 text-green-200" />
          <span className="text-[10px] text-green-200 font-mono uppercase tracking-wider">Confidential</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
        {[
          { label: 'Patient', value: patientName },
          { label: 'Demographics', value: `${patientAge}yo ${patientSex === 'male' ? 'Male' : 'Female'}` },
          { label: 'Date', value: formatDate(generatedAt) },
          { label: 'Interview Turns', value: String(turnCount) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] text-green-300 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
