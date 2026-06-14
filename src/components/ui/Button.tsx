import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md';

/**
 * Apple-style "liquid glass" buttons: low-opacity tinted fills over a strong
 * `backdrop-blur-xl backdrop-saturate-150` (the iOS frosted-material look), a bright
 * top specular highlight, a thin light border, a soft colored shadow, and a text-shadow
 * so white labels stay legible over the translucent fill.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700/80 text-white ' +
    '[text-shadow:0_1px_3px_rgba(28,10,60,0.6)] ' +
    'shadow-[0_16px_36px_-14px_rgba(124,58,237,0.5),inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_-10px_18px_-14px_rgba(255,255,255,0.28)] ' +
    'hover:bg-primary-600/85 active:bg-primary-800/88',
  secondary:
    'bg-brand-800/45 text-white ' +
    '[text-shadow:0_1px_3px_rgba(0,0,0,0.5)] ' +
    'shadow-[0_16px_36px_-14px_rgba(35,18,87,0.5),inset_0_1px_1px_rgba(255,255,255,0.35)] ' +
    'hover:bg-brand-800/60',
  outline:
    'bg-white/30 text-slate-700 ' +
    'shadow-[0_8px_22px_-10px_rgba(16,24,40,0.22),inset_0_1px_1px_rgba(255,255,255,0.9)] ' +
    'hover:bg-white/50 active:bg-white/60',
  ghost: 'text-slate-600 hover:bg-white/40 active:bg-white/55',
  subtle:
    'bg-primary-200/35 text-primary-800 ' +
    'shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] hover:bg-primary-200/55',
  danger:
    'bg-red-600/42 text-white ' +
    '[text-shadow:0_1px_3px_rgba(60,5,5,0.55)] ' +
    'shadow-[0_16px_36px_-14px_rgba(220,38,38,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)] ' +
    'hover:bg-red-600/58',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1 rounded-md',
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
  md: 'h-9 px-4 text-base gap-2 rounded-md',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'sm', loading = false, icon, iconEnd, fullWidth, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center whitespace-nowrap font-medium backdrop-blur-2xl backdrop-saturate-[1.8] transition-all duration-150 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
        variant !== 'ghost' && 'glass-edge glass-shine',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size="xs" /> : icon}
      {children}
      {!loading && iconEnd}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  loading?: boolean;
}

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 w-7 rounded-md',
  sm: 'h-8 w-8 rounded-md',
  md: 'h-9 w-9 rounded-md',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', size = 'sm', label, loading, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      disabled={disabled || loading}
      className={cn(
        'inline-flex shrink-0 items-center justify-center backdrop-blur-2xl backdrop-saturate-[1.8] transition-all duration-150 active:scale-[0.97]',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
        variant !== 'ghost' && 'glass-edge glass-shine',
        variantClasses[variant],
        iconSizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size="xs" /> : children}
    </button>
  );
});
