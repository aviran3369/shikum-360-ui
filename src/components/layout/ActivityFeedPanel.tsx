import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Avatar, Button, Drawer, EmptyState, Skeleton } from '@/components/ui';
import { useAsync } from '@/hooks';
import { getActivityLog } from '@/lib/mockApi';
import { formatRelative } from '@/lib/format';
import { userRoleMeta } from '@/lib/statusMaps';

export function ActivityFeedPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, loading, error, refetch } = useAsync(() => getActivityLog(), [open]);

  return (
    <Drawer open={open} onClose={onClose} title="יומן פעילות" subtitle="תיעוד פעולות אחרונות במערכת">
      {loading ? (
        <div className="space-y-4 p-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={<AlertTriangle className="h-7 w-7" />}
          title="שגיאה בטעינת היומן"
          description={error.message}
          action={<Button variant="outline" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={refetch}>נסה שוב</Button>}
        />
      ) : !data || data.length === 0 ? (
        <EmptyState title="אין פעילות להצגה" />
      ) : (
        <ol className="relative px-4 py-3">
          <span className="absolute bottom-3 end-7 top-3 w-px bg-slate-200" aria-hidden />
          {data.map((entry) => (
            <li key={entry.id} className="relative flex gap-3 pb-4 last:pb-0">
              <Avatar name={entry.actorName} size="sm" color="#4F46E5" className="z-10" />
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm leading-snug text-slate-700">
                  <span className="font-semibold text-slate-800">{entry.actorName}</span> {entry.summary}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-2xs text-slate-400">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-500">{entry.action}</span>
                  <span>{userRoleMeta[entry.actorRole].label}</span>
                  <span>·</span>
                  <span>{formatRelative(entry.createdAt)}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Drawer>
  );
}
