import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ChipProps {
  children: ReactNode;
  icon?: ReactNode;
  onRemove?: () => void;
  tone?: 'default' | 'primary';
  className?: string;
}

/** Compact pill for active filters / selection summaries; removable when onRemove is set. */
export function Chip({ children, icon, onRemove, tone = 'default', className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tone === 'primary'
          ? 'border-primary-200 bg-primary-50 text-primary-700'
          : 'border-slate-200 bg-white text-slate-600',
        className,
      )}
    >
      {icon}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="הסר"
          className="-me-1 rounded-full p-0.5 opacity-70 transition-colors hover:bg-black/5 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
