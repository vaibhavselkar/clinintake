import { UserCheck, MessageSquare, FileText } from 'lucide-react';

const STEPS = [
  { icon: UserCheck, label: 'Patient Selected', desc: 'Choose a clinical scenario' },
  { icon: MessageSquare, label: 'Interview Conducted', desc: 'AI agent interviews patient' },
  { icon: FileText, label: 'Brief Generated', desc: 'CC, HPI, ROS, PMH output' },
];

export function HowItWorks() {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {STEPS.map(({ icon: Icon, label, desc }, idx) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#E8F5EE] border border-[#C8E6D4] flex items-center justify-center mb-1">
              <Icon className="w-5 h-5 text-[#1B6B3A]" />
            </div>
            <p className="text-xs font-semibold text-[#0D2818]">{label}</p>
            <p className="text-[11px] text-[#7A9E87]">{desc}</p>
          </div>
          {idx < STEPS.length - 1 && (
            <div className="w-8 h-px bg-[#C8E6D4] mx-1 self-start mt-5" />
          )}
        </div>
      ))}
    </div>
  );
}
