interface DataQualityProps {
  notes: string;
}

export function DataQuality({ notes }: DataQualityProps) {
  return (
    <div className="bg-[#F0FAF4] border border-[#C8E6D4] rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-[#3D6B50] uppercase tracking-wide mb-2">Data Quality Notes</h3>
      <p className="text-sm text-[#3D6B50] leading-relaxed whitespace-pre-wrap">{notes}</p>
    </div>
  );
}
