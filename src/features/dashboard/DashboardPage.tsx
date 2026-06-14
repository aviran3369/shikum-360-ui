import { useNavigate } from 'react-router-dom';
import { Activity, CalendarDays, Plus, Truck, UserCog, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Avatar, Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton } from '@/components/ui';
import { DataTable, type Column } from '@/components/table';
import { useAsync } from '@/hooks';
import { getActivityLog, getDashboardSummary, getTrips } from '@/lib/mockApi';
import { tripStatusMeta, toneDotClasses } from '@/lib/statusMaps';
import { formatDateMedium, formatNumber, formatPercent, formatRelative } from '@/lib/format';
import type { Trip } from '@/types';
import { cn } from '@/lib/cn';
import { StatCard } from './StatCard';

const upcomingColumns: Column<Trip>[] = [
  { id: 'serialNumber', header: 'מס׳', cell: (t) => <span className="font-medium tabular-nums text-slate-700">{t.serialNumber}</span>, width: 'w-16' },
  { id: 'date', header: 'תאריך ושעה', cell: (t) => <span className="tabular-nums">{formatDateMedium(t.date)} · {t.time}</span> },
  { id: 'passenger', header: 'נוסע', cell: (t) => t.passenger.fullName },
  { id: 'destination', header: 'יעד', cell: (t) => t.destination.name },
  { id: 'status', header: 'סטטוס', cell: (t) => <Badge tone={tripStatusMeta[t.status].tone} dot>{tripStatusMeta[t.status].label}</Badge> },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary, loading } = useAsync(() => getDashboardSummary(), []);
  const { data: activity, loading: activityLoading } = useAsync(() => getActivityLog(), []);
  const { data: upcoming, loading: upcomingLoading } = useAsync(
    () => getTrips({ sortBy: 'date', sortDir: 'asc', pageSize: 6 }),
    [],
  );

  const total = summary?.totalTrips ?? 0;
  const selfPct = total ? (summary?.orderedBySelf ?? 0) / total : 0;
  const managerPct = total ? (summary?.orderedByManager ?? 0) / total : 0;

  return (
    <div>
      <PageHeader
        title="סקירה כללית"
        subtitle="תמונת מצב יומית של מערך ההסעות"
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/scheduling?new=1')}>
            נסיעה חדשה
          </Button>
        }
      />

      <div className="space-y-4 p-5">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="סה״כ נסיעות" value={formatNumber(total)} icon={CalendarDays} loading={loading} delta={{ value: '12%', direction: 'up' }} sub="לעומת השבוע שעבר" />
          <StatCard
            label="הוזמנו ע״י נוסע"
            value={formatNumber(summary?.orderedBySelf ?? 0)}
            icon={Users}
            iconClassName="bg-violet-50 text-violet-600"
            loading={loading}
            sub={<ProgressLine value={selfPct} tone="bg-violet-500" label={formatPercent(selfPct)} />}
          />
          <StatCard
            label="הוזמנו ע״י מנהל"
            value={formatNumber(summary?.orderedByManager ?? 0)}
            icon={UserCog}
            iconClassName="bg-primary-50 text-primary-600"
            loading={loading}
            sub={<ProgressLine value={managerPct} tone="bg-primary-500" label={formatPercent(managerPct)} />}
          />
          <StatCard
            label="נהגים פעילים"
            value={`${summary?.activeDrivers ?? 0}/${summary?.totalDrivers ?? 0}`}
            icon={Truck}
            iconClassName="bg-emerald-50 text-emerald-600"
            loading={loading}
            sub="זמינים כעת לשיבוץ"
          />
        </div>

        {/* Breakdown + activity */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="נסיעות לפי סטטוס" subtitle="התפלגות מצב הנסיעות במערכת" />
            <CardBody className="space-y-2.5">
              {loading ? (
                Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-7 w-full" />)
              ) : (
                summary?.byStatus
                  .filter((s) => s.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .map((s) => {
                    const meta = tripStatusMeta[s.status];
                    const pct = total ? s.count / total : 0;
                    return (
                      <div key={s.status} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-xs text-slate-600">{meta.label}</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className={cn('h-full rounded-full', toneDotClasses[meta.tone])} style={{ width: `${Math.max(pct * 100, 3)}%` }} />
                        </div>
                        <span className="w-10 shrink-0 text-end text-xs font-semibold tabular-nums text-slate-700">{s.count}</span>
                      </div>
                    );
                  })
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="פעילות אחרונה" icon={<Activity className="h-4 w-4" />} />
            <CardBody className="space-y-3">
              {activityLoading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex gap-2.5">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-7 flex-1" />
                  </div>
                ))
              ) : (
                activity?.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex gap-2.5">
                    <Avatar name={entry.actorName} size="sm" color="#4F46E5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug text-slate-600">
                        <span className="font-semibold text-slate-800">{entry.actorName}</span> {entry.summary}
                      </p>
                      <p className="mt-0.5 text-2xs text-slate-400">{formatRelative(entry.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>

        {/* Upcoming trips */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-md font-semibold text-slate-800">נסיעות קרובות</h2>
            <Button variant="ghost" size="xs" onClick={() => navigate('/scheduling')}>
              לכל הנסיעות
            </Button>
          </div>
          <DataTable
            columns={upcomingColumns}
            rows={upcoming?.items ?? []}
            rowKey={(t) => t.id}
            loading={upcomingLoading}
            skeletonRows={6}
            onRowClick={() => navigate('/scheduling')}
            emptyState={<EmptyState title="אין נסיעות קרובות" compact />}
          />
        </div>
      </div>
    </div>
  );
}

function ProgressLine({ value, tone, label }: { value: number; tone: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <span className={cn('block h-full rounded-full', tone)} style={{ width: `${value * 100}%` }} />
      </span>
      <span className="text-2xs font-semibold tabular-nums text-slate-500">{label}</span>
    </span>
  );
}
