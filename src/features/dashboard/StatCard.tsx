import { type ComponentType, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/ui';

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
  iconClassName?: string;
  sub?: ReactNode;
  delta?: { value: string; direction: 'up' | 'down' };
  loading?: boolean;
}

export function StatCard({ label, value, icon: Icon, iconClassName, sub, delta, loading }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-7 w-20" />
          ) : (
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-800">{value}</p>
          )}
        </div>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconClassName ?? 'bg-primary-50 text-primary-600')}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {(sub || delta) && (
        <div className="mt-2 flex items-center gap-2">
          {delta && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-2xs font-semibold',
                delta.direction === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
              )}
            >
              {delta.direction === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {delta.value}
            </span>
          )}
          {sub && <span className="min-w-0 flex-1 text-xs text-slate-400">{sub}</span>}
        </div>
      )}
    </div>
  );
}
