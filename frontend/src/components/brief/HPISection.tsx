interface HPISectionProps {
  hpi: string;
}

export function HPISection({ hpi }: HPISectionProps) {
  return (
    <div className="bg-white border border-[#C8E6D4] rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-[#3D6B50] uppercase tracking-wide mb-3">History of Present Illness (HPI)</h3>
      <p className="text-sm font-mono text-[#0D2818] leading-relaxed whitespace-pre-wrap">{hpi}</p>
    </div>
  );
}
