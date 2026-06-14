import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, CheckCheck, CheckCircle2, Info, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button, Card, EmptyState, SegmentedControl, Skeleton } from '@/components/ui';
import { NotificationKind } from '@/types/enums';
import { badgeToneClasses } from '@/lib/statusMaps';
import { formatRelative } from '@/lib/format';
import { useNotifications } from '@/store';
import { cn } from '@/lib/cn';

const kindIcon = {
  [NotificationKind.Info]: { icon: Info, tone: 'blue' as const },
  [NotificationKind.Success]: { icon: CheckCircle2, tone: 'green' as const },
  [NotificationKind.Warning]: { icon: AlertTriangle, tone: 'amber' as const },
  [NotificationKind.Error]: { icon: XCircle, tone: 'red' as const },
};

export function NotificationsPage() {
  const { items, loading, unreadCount, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  const filtered = useMemo(() => (filter === 'unread' ? items.filter((n) => !n.read) : items), [items, filter]);

  return (
    <div>
      <PageHeader title="מרכז התראות" subtitle="כל ההתראות והעדכונים"
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" icon={<CheckCheck className="h-4 w-4" />} onClick={markAllRead}>
              סמן הכל כנקרא
            </Button>
          ) : undefined
        }
      />

      <div className="mx-auto max-w-3xl space-y-3 p-5">
        <SegmentedControl
          options={[
            { value: 'all', label: `הכל (${items.length})` },
            { value: 'unread', label: `שלא נקראו (${unreadCount})` },
          ]}
          value={filter}
          onChange={setFilter}
        />

        <Card>
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Bell className="h-7 w-7" />} title={filter === 'unread' ? 'אין התראות שלא נקראו' : 'אין התראות'} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((n) => {
                const { icon: Icon, tone } = kindIcon[n.kind];
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        markRead(n.id);
                        if (n.href) navigate(n.href);
                      }}
                      className={cn('flex w-full gap-3 px-4 py-3.5 text-start transition-colors hover:bg-slate-50', !n.read && 'bg-primary-50/40')}
                    >
                      <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset', badgeToneClasses[tone])}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800">{n.title}</span>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />}
                        </span>
                        <span className="mt-0.5 block text-sm text-slate-500">{n.body}</span>
                        <span className="mt-1 block text-2xs text-slate-400">{formatRelative(n.createdAt)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
