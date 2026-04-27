import clsx from 'clsx';
import { ROS_SYSTEMS, ROS_LABELS, ClinicalBrief } from '../../types/clinical.types';

interface ROSSectionProps {
  ros: ClinicalBrief['ros'];
}

export function ROSSection({ ros }: ROSSectionProps) {
  return (
    <div className="bg-white border border-[#C8E6D4] rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-[#3D6B50] uppercase tracking-wide mb-3">Review of Systems (ROS)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {ROS_SYSTEMS.map((system) => {
          const val = ros[system];
          const isNegative = !val || val.toLowerCase().includes('negative') || val.toLowerCase() === 'not reviewed';
          return (
            <div key={system} className="border-b border-[#E8F5EE] pb-2">
              <span className="text-[11px] font-semibold text-[#3D6B50] uppercase tracking-wide block">{ROS_LABELS[system]}</span>
              <span className={clsx('text-sm', isNegative ? 'text-[#7A9E87]' : 'text-[#0D2818] font-medium')}>
                {val ?? 'Not reviewed'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
