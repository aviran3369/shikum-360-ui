import { ChevronLeft, ListChecks } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/format';

export interface TripStats {
  total: number;
  orderedBySelf: number;
  orderedByManager: number;
}

interface Props {
  stats: TripStats | null;
  loading: boolean;
  onOpenPassengerBreakdown: () => void;
}

export function TripStatsStrip({ stats, loading, onOpenPassengerBreakdown }: Props) {
  const total = stats?.total ?? 0;
  const selfPct = total ? (stats?.orderedBySelf ?? 0) / total : 0;
  const managerPct = total ? (stats?.orderedByManager ?? 0) / total : 0;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <StatPill loading={loading}>
        <span className="text-slate-500">סה״כ נסיעות:</span>
        <span className="font-bold tabular-nums text-slate-800">{formatNumber(total)}</span>
      </StatPill>

      <StatPill loading={loading}>
        <span className="h-2 w-2 rounded-full bg-violet-500" />
        <span className="text-slate-500">הוזמנו ע״י נוסע</span>
        <span className="font-bold tabular-nums text-violet-700">{formatPercent(selfPct)}</span>
        <span className="text-xs text-slate-400">({formatNumber(stats?.orderedBySelf ?? 0)})</span>
      </StatPill>

      <StatPill loading={loading}>
        <span className="h-2 w-2 rounded-full bg-primary-500" />
        <span className="text-slate-500">הוזמנו ע״י מנהל</span>
        <span className="font-bold tabular-nums text-primary-700">{formatPercent(managerPct)}</span>
        <span className="text-xs text-slate-400">({formatNumber(stats?.orderedByManager ?? 0)})</span>
      </StatPill>

      <button
        type="button"
        onClick={onOpenPassengerBreakdown}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-sm font-medium text-primary-700 shadow-soft transition-colors hover:bg-primary-50"
      >
        <ListChecks className="h-4 w-4" />
        פירוט הזמנה לפי נוסע
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function StatPill({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  if (loading) return <Skeleton className="h-8 w-40 rounded-lg" />;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-sm shadow-soft')}>
      {children}
    </span>
  );
}
