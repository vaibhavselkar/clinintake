import { PatientSummary, PATIENT_LIST } from '../../types/patient.types';
import { PatientCard } from './PatientCard';

interface PatientGridProps {
  selectedKey: string | null;
  onSelect: (patient: PatientSummary) => void;
}

export function PatientGrid({ selectedKey, onSelect }: PatientGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PATIENT_LIST.map((patient) => (
        <PatientCard
          key={patient.key}
          patient={patient}
          selected={selectedKey === patient.key}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
