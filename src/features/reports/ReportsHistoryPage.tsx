import { useMemo, useState } from 'react';
import { Download, FileBarChart, FileDown } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Badge, Button, EmptyState, IconButton, SearchInput } from '@/components/ui';
import { DataTable, type Column, type SortState } from '@/components/table';
import { useAsync, useDebounce, useDisclosure } from '@/hooks';
import { getReports } from '@/lib/mockApi';
import { ReportStatus } from '@/types/enums';
import { reportStatusMeta } from '@/lib/statusMaps';
import { formatDate, formatNumber } from '@/lib/format';
import { cycleSortState, sortRows } from '@/lib/sort';
import type { Report } from '@/types';
import { ReportDateRangeModal } from '@/features/scheduling/ReportDateRangeModal';

const columns: Column<Report>[] = [
  { id: 'name', header: 'שם הדוח', cell: (r) => <span className="font-medium text-slate-700">{r.name}</span>, sortable: true },
  { id: 'type', header: 'סוג', cell: (r) => <span className="text-slate-600">{r.type}</span>, sortable: true },
  { id: 'format', header: 'פורמט', cell: (r) => <span className="rounded bg-slate-100 px-1.5 py-0.5 text-2xs font-semibold text-slate-500">{r.format}</span> },
  { id: 'range', header: 'טווח', cell: (r) => <span className="tabular-nums text-slate-600">{formatDate(r.rangeFrom)} – {formatDate(r.rangeTo)}</span> },
  { id: 'status', header: 'סטטוס', cell: (r) => <Badge tone={reportStatusMeta[r.status].tone} dot>{reportStatusMeta[r.status].label}</Badge>, sortable: true },
  { id: 'sizeKb', header: 'גודל', cell: (r) => <span className="tabular-nums text-slate-500">{r.sizeKb ? `${formatNumber(r.sizeKb)} KB` : '—'}</span>, align: 'center' },
  { id: 'requestedBy', header: 'הופק ע״י', cell: (r) => r.requestedBy },
  { id: 'createdAt', header: 'נוצר', cell: (r) => <span className="tabular-nums text-slate-500">{formatDate(r.createdAt)}</span>, sortable: true },
  {
    id: 'actions',
    header: '',
    align: 'end',
    width: 'w-12',
    cell: (r) => (
      <IconButton label="הורדה" size="xs" variant="ghost" disabled={r.status !== ReportStatus.Ready}>
        <Download className="h-3.5 w-3.5 text-primary-600" />
      </IconButton>
    ),
  },
];

export function ReportsHistoryPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState | null>(null);
  const exportModal = useDisclosure();
  const debounced = useDebounce(search, 250);

  const { data, loading, error, refetch } = useAsync(() => getReports(), []);

  const rows = useMemo(() => {
    let items = data ?? [];
    const q = debounced.trim().toLowerCase();
    if (q) items = items.filter((r) => r.name.toLowerCase().includes(q) || r.type.includes(q));
    return sortRows(items, sort);
  }, [data, debounced, sort]);

  return (
    <div>
      <PageHeader title="היסטוריית דוחות" subtitle="דוחות שהופקו וייצואים"
        actions={<Button icon={<FileDown className="h-4 w-4" />} onClick={exportModal.open}>הפקת דוח</Button>}
      />

      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="w-full sm:w-80">
            <SearchInput value={search} onChange={setSearch} placeholder="חיפוש דוח…" />
          </div>
          <p className="text-sm text-slate-500 sm:ms-auto">{loading ? 'טוען…' : <>{formatNumber(rows.length)} דוחות</>}</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-slate-200 bg-white shadow-card">
            <EmptyState title="שגיאה בטעינת הדוחות" description={error.message} action={<Button variant="outline" onClick={refetch}>נסה שוב</Button>} />
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            loading={loading}
            sort={sort}
            onSortChange={(key) => setSort((p) => cycleSortState(p, key))}
            stickyHeader
            emptyState={<EmptyState icon={<FileBarChart className="h-7 w-7" />} title="לא נמצאו דוחות" />}
          />
        )}
      </div>

      <ReportDateRangeModal open={exportModal.isOpen} onClose={exportModal.close} />
    </div>
  );
}
