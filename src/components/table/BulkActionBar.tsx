import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';

export interface BulkActionBarProps {
  count: number;
  onClear: () => void;
  children: ReactNode;
  className?: string;
}

/** Selection toolbar shown above the table when rows are selected. */
export function BulkActionBar({ count, onClear, children, className }: BulkActionBarProps) {
  if (count <= 0) return null;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-lg border border-primary-200 bg-primary-50/70 px-3 py-2',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white">
        {formatNumber(count)} נבחרו
      </span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
      <button
        type="button"
        onClick={onClear}
        className="ms-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-slate-700"
      >
        <X className="h-3.5 w-3.5" />
        נקה בחירה
      </button>
    </div>
  );
}
