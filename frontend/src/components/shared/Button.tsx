import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-[#1B6B3A] text-white hover:bg-[#0F4023] focus:ring-[#1B6B3A]',
  secondary: 'bg-[#E8F5EE] text-[#1B6B3A] border border-[#C8E6D4] hover:bg-[#D1ECD8] focus:ring-[#1B6B3A]',
  ghost: 'text-[#3D6B50] hover:bg-[#E8F5EE] focus:ring-[#1B6B3A]',
  danger: 'bg-[#FEF2F2] text-[#991B1B] border border-red-200 hover:bg-red-100 focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
        'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
