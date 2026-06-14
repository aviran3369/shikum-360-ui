import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, CheckCheck, CheckCircle2, Info, XCircle } from 'lucide-react';
import { Drawer, EmptyState, Skeleton } from '@/components/ui';
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

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, loading, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="התראות"
      subtitle={unreadCount > 0 ? `${unreadCount} התראות שלא נקראו` : 'הכל מעודכן'}
      headerActions={
        unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            סמן הכל כנקרא
          </button>
        ) : undefined
      }
      footer={
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/notifications');
          }}
          className="w-full rounded-md py-1.5 text-center text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
        >
          צפייה בכל ההתראות
        </button>
      }
    >
      {loading ? (
        <div className="space-y-3 p-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={<Bell className="h-7 w-7" />} title="אין התראות" description="כל ההתראות שלך יופיעו כאן." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((n) => {
            const { icon: Icon, tone } = kindIcon[n.kind];
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    markRead(n.id);
                    if (n.href) {
                      onClose();
                      navigate(n.href);
                    }
                  }}
                  className={cn('flex w-full gap-3 px-3 py-3 text-start transition-colors hover:bg-slate-50', !n.read && 'bg-primary-50/40')}
                >
                  <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset', badgeToneClasses[tone])}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800">{n.title}</span>
                      {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">{n.body}</span>
                    <span className="mt-1 block text-2xs text-slate-400">{formatRelative(n.createdAt)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
