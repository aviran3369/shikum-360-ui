import { useMemo, useState } from 'react';
import { Activity } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Avatar, Badge, Button, EmptyState, SearchInput } from '@/components/ui';
import { DataTable, type Column } from '@/components/table';
import { useAsync, useDebounce } from '@/hooks';
import { getActivityLog } from '@/lib/mockApi';
import { userRoleMeta } from '@/lib/statusMaps';
import { formatDateTime, formatNumber } from '@/lib/format';
import type { ActivityLogEntry } from '@/types';

const columns: Column<ActivityLogEntry>[] = [
  {
    id: 'actor',
    header: 'משתמש',
    cell: (e) => (
      <span className="flex items-center gap-2.5">
        <Avatar name={e.actorName} size="sm" color="#4F46E5" />
        <span>
          <span className="block font-medium text-slate-700">{e.actorName}</span>
          <span className="block text-2xs text-slate-400">{userRoleMeta[e.actorRole].label}</span>
        </span>
      </span>
    ),
  },
  { id: 'action', header: 'פעולה', cell: (e) => <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-2xs text-slate-500">{e.action}</span> },
  { id: 'summary', header: 'תיאור', cell: (e) => <span className="text-slate-700">{e.summary}</span> },
  { id: 'entity', header: 'ישות', cell: (e) => <Badge tone="slate">{e.entityType}</Badge> },
  { id: 'createdAt', header: 'מועד', cell: (e) => <span className="tabular-nums text-slate-500">{formatDateTime(e.createdAt)}</span>, width: 'w-40' },
];

export function ActivityLogPage() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);
  const { data, loading, error, refetch } = useAsync(() => getActivityLog(), []);

  const rows = useMemo(() => {
    const items = data ?? [];
    const q = debounced.trim().toLowerCase();
    if (!q) return items;
    return items.filter((e) => e.actorName.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q) || e.action.includes(q));
  }, [data, debounced]);

  return (
    <div>
      <PageHeader title="יומן פעילות" subtitle="תיעוד פעולות משתמשים במערכת" />
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="w-full sm:w-80">
            <SearchInput value={search} onChange={setSearch} placeholder="חיפוש לפי משתמש, פעולה או תיאור…" />
          </div>
          <p className="text-sm text-slate-500 sm:ms-auto">{loading ? 'טוען…' : <>{formatNumber(rows.length)} רשומות</>}</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-slate-200 bg-white shadow-card">
            <EmptyState title="שגיאה בטעינת היומן" description={error.message} action={<Button variant="outline" onClick={refetch}>נסה שוב</Button>} />
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(e) => e.id}
            loading={loading}
            stickyHeader
            emptyState={<EmptyState icon={<Activity className="h-7 w-7" />} title="אין פעילות להצגה" />}
          />
        )}
      </div>
    </div>
  );
}
