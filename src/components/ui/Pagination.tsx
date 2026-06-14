import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** RTL pagination: "previous" advances toward lower pages (chevron points start/right). */
export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className={cn('flex items-center justify-between gap-3 text-sm text-slate-500', className)}>
      <span className="tabular-nums">
        מציג {formatNumber(from)}–{formatNumber(to)} מתוך {formatNumber(total)}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
          הקודם
        </button>
        <span className="px-2 text-xs tabular-nums text-slate-500">
          עמוד {formatNumber(page)} / {formatNumber(totalPages)}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          הבא
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
