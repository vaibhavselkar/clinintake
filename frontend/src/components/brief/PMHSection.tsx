interface PMHSectionProps {
  pmh: string;
  medications: string;
  allergies: string;
  familyHistory: string;
  socialHistory: string;
}

function PMHRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#E8F5EE] pb-2 last:border-0 last:pb-0">
      <p className="text-[11px] font-semibold text-[#3D6B50] uppercase tracking-wide">{label}</p>
      <p className="text-sm text-[#0D2818] font-mono">{value}</p>
    </div>
  );
}

export function PMHSection({ pmh, medications, allergies, familyHistory, socialHistory }: PMHSectionProps) {
  return (
    <div className="bg-white border border-[#C8E6D4] rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-[#3D6B50] uppercase tracking-wide mb-3">Past Medical & Social History</h3>
      <div className="space-y-3">
        <PMHRow label="Conditions" value={pmh} />
        <PMHRow label="Medications" value={medications} />
        <PMHRow label="Allergies" value={allergies} />
        <PMHRow label="Family History" value={familyHistory} />
        <PMHRow label="Social History" value={socialHistory} />
      </div>
    </div>
  );
}
