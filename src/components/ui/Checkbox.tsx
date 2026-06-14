import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  indeterminate?: boolean;
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { indeterminate = false, label, className, checked, disabled, ...props },
  ref,
) {
  const box = (
    <span className="relative inline-flex h-4 w-4 shrink-0">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <span
        className={cn(
          'pointer-events-none inline-flex h-4 w-4 items-center justify-center rounded border bg-white text-white transition-colors',
          'border-slate-300 peer-hover:border-primary-400',
          (checked || indeterminate) && 'border-primary-600 bg-primary-600',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/60 peer-focus-visible:ring-offset-1',
          disabled && 'opacity-50',
        )}
      >
        {indeterminate ? <Minus className="h-3 w-3" strokeWidth={3} /> : checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
    </span>
  );

  if (!label) return box;
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 text-slate-700', disabled && 'cursor-not-allowed opacity-60', className)}>
      {box}
      <span className="text-sm">{label}</span>
    </label>
  );
});

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, checked, disabled, ...props },
  ref,
) {
  const dot = (
    <span className="relative inline-flex h-4 w-4 shrink-0">
      <input
        ref={ref}
        type="radio"
        checked={checked}
        disabled={disabled}
        className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <span
        className={cn(
          'pointer-events-none inline-flex h-4 w-4 items-center justify-center rounded-full border bg-white transition-colors',
          'border-slate-300 peer-hover:border-primary-400',
          checked && 'border-primary-600',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/60 peer-focus-visible:ring-offset-1',
          disabled && 'opacity-50',
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-primary-600" />}
      </span>
    </span>
  );

  if (!label) return dot;
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 text-slate-700', disabled && 'cursor-not-allowed opacity-60', className)}>
      {dot}
      <span className="text-sm">{label}</span>
    </label>
  );
});
