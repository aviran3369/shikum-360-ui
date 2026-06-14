import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Segment<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/** Segmented switch (e.g. בסיסי / הכל / כספים). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'sm',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('inline-flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5', className)} role="tablist">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-medium transition-colors',
              size === 'sm' ? 'h-7 px-3 text-xs' : 'h-8 px-3.5 text-sm',
              active ? 'bg-white text-primary-700 shadow-soft' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
