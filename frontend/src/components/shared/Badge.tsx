import clsx from 'clsx';

interface BadgeProps {
  label: string;
  variant?: 'green' | 'muted' | 'alert' | 'amber';
  className?: string;
}

const variants = {
  green: 'bg-[#E8F5EE] text-[#1B6B3A] border border-[#C8E6D4]',
  muted: 'bg-gray-100 text-[#7A9E87]',
  alert: 'bg-[#FEF2F2] text-[#991B1B]',
  amber: 'bg-amber-50 text-[#92400E]',
};

export function Badge({ label, variant = 'green', className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', variants[variant], className)}>
      {label}
    </span>
  );
}
