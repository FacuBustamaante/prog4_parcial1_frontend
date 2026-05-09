import type { ButtonProps } from '../types';

const variantStyles: Record<string, string> = {
  primary: 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800',
  secondary: 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
  danger: 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const PrimaryButton = ({
  onClick,
  children,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-xl font-bold transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles.primary} ${sizeStyles.md} ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({
  onClick,
  children,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles.secondary} ${sizeStyles.sm} ${className}`}
  >
    {children}
  </button>
);

export const DangerButton = ({
  onClick,
  children,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles.danger} ${sizeStyles.sm} ${className}`}
  >
    {children}
  </button>
);

export const Button = ({
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) => {
  const baseClass = `inline-flex items-center justify-center rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]}`;

  return (
    <button
      {...props}
      className={`${baseClass} ${props.className || ''}`}
    >
      {props.children}
    </button>
  );
};
