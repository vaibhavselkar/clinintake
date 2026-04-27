import clsx from 'clsx';
import { CheckCircle } from 'lucide-react';
import { PatientSummary } from '../../types/patient.types';
import { Badge } from '../shared/Badge';

interface PatientCardProps {
  patient: PatientSummary;
  selected: boolean;
  onSelect: (patient: PatientSummary) => void;
}

export function PatientCard({ patient, selected, onSelect }: PatientCardProps) {
  const initials = patient.name.split(' ').map((n) => n[0]).join('');

  return (
    <button
      onClick={() => onSelect(patient)}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all duration-150',
        'bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] focus:ring-offset-1',
        selected
          ? 'border-[#1B6B3A] bg-[#E8F5EE] ring-1 ring-[#1B6B3A]'
          : 'border-[#C8E6D4] hover:border-[#2D9B55] hover:bg-[#F0FAF4]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
            selected ? 'bg-[#1B6B3A] text-white' : 'bg-[#E8F5EE] text-[#1B6B3A]'
          )}>
            {initials}
          </div>
          <div>
            <p className="font-semibold text-[#0D2818] font-display">{patient.name}</p>
            <p className="text-xs text-[#7A9E87]">{patient.age}yo · {patient.sex === 'male' ? 'Male' : 'Female'}</p>
          </div>
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-[#1B6B3A] flex-shrink-0" />}
      </div>
      <div className="mt-3 space-y-1.5">
        <Badge label={patient.chiefComplaintHint} variant="green" />
        <p className="text-xs text-[#7A9E87] italic">{patient.personality}</p>
      </div>
    </button>
  );
}
