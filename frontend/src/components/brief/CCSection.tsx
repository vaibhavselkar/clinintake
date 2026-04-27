interface CCSectionProps {
  chiefComplaint: string;
}

export function CCSection({ chiefComplaint }: CCSectionProps) {
  return (
    <div className="bg-white border border-[#C8E6D4] rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-[#3D6B50] uppercase tracking-wide mb-2">Chief Complaint (CC)</h3>
      <p className="text-lg font-display italic text-[#0D2818] border-l-4 border-[#1B6B3A] pl-4 py-1">
        "{chiefComplaint}"
      </p>
    </div>
  );
}
