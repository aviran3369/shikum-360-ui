import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/** RTL-aware switch — the knob rests at the inline-start edge and slides to end when on. */
export function Toggle({ checked, onChange, label, disabled, size = 'sm', className }: ToggleProps) {
  const track = size === 'sm' ? 'h-4.5 w-8' : 'h-5 w-9';
  const knob = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const travel = size === 'sm' ? 'rtl:-translate-x-3.5 ltr:translate-x-3.5' : 'rtl:-translate-x-4 ltr:translate-x-4';

  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2', disabled && 'cursor-not-allowed opacity-60', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors',
          track,
          checked ? 'bg-primary-600' : 'bg-slate-300',
        )}
      >
        <span
          className={cn(
            'inline-block transform rounded-full bg-white shadow transition-transform',
            knob,
            checked && travel,
          )}
        />
      </button>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
