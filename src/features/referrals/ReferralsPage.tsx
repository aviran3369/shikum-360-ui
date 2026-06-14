import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Badge, Button, EmptyState, SearchInput, Select, type SelectOption } from '@/components/ui';
import { DataTable, type Column, type SortState } from '@/components/table';
import { useAsync, useDebounce, useDisclosure } from '@/hooks';
import { getReferrals } from '@/lib/mockApi';
import { ReferralStatus } from '@/types/enums';
import { referralStatusMeta } from '@/lib/statusMaps';
import { formatDate, formatNumber, formatPhone } from '@/lib/format';
import { cycleSortState, sortRows } from '@/lib/sort';
import type { Referral } from '@/types';
import { ReferralIntakeDrawer } from './ReferralIntakeDrawer';

const columns: Column<Referral>[] = [
  { id: 'referralNumber', header: 'מספר הפנייה', cell: (r) => <span className="font-medium tabular-nums text-primary-600">{r.referralNumber}</span>, sortable: true },
  { id: 'passengerName', header: 'שם נוסע', cell: (r) => <span className="font-medium text-slate-700">{r.passengerName}</span>, sortable: true },
  { id: 'passengerPhone', header: 'טלפון', cell: (r) => <span dir="ltr" className="tabular-nums text-slate-600">{formatPhone(r.passengerPhone)}</span> },
  { id: 'fundingSource', header: 'מקור מימון', cell: (r) => r.fundingSource, sortable: true },
  { id: 'status', header: 'סטטוס', cell: (r) => <Badge tone={referralStatusMeta[r.status].tone} dot>{referralStatusMeta[r.status].label}</Badge>, sortable: true },
  { id: 'tripsCount', header: 'נסיעות', cell: (r) => <span className="tabular-nums">{r.tripsCount}</span>, align: 'center', sortable: true },
  { id: 'openedAt', header: 'נפתחה', cell: (r) => <span className="tabular-nums">{formatDate(r.openedAt)}</span>, sortable: true },
  { id: 'validUntil', header: 'תוקף עד', cell: (r) => <span className="tabular-nums">{formatDate(r.validUntil)}</span>, sortable: true },
  { id: 'assignedTo', header: 'משובץ ל', cell: (r) => r.assignedTo ?? <span className="text-slate-300">—</span> },
];

const statusOptions: SelectOption<ReferralStatus | 'all'>[] = [
  { value: 'all', label: 'כל הסטטוסים' },
  ...(Object.values(ReferralStatus).filter((v) => typeof v === 'number') as ReferralStatus[]).map((s) => ({
    value: s,
    label: referralStatusMeta[s].label,
  })),
];

export function ReferralsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ReferralStatus | 'all'>('all');
  const [sort, setSort] = useState<SortState | null>(null);
  const intake = useDisclosure();
  const debounced = useDebounce(search, 250);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      intake.open();
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { data, loading, error, refetch } = useAsync(() => getReferrals({ search: debounced, pageSize: 100 }), [debounced]);

  const rows = useMemo(() => {
    let items = data?.items ?? [];
    if (status !== 'all') items = items.filter((r) => r.status === status);
    return sortRows(items, sort);
  }, [data, status, sort]);

  return (
    <div>
      <PageHeader title="ניהול הפניות" subtitle="הפניות נוסעים ומקורות מימון"
        actions={<Button icon={<Plus className="h-4 w-4" />} onClick={intake.open}>הפנייה חדשה</Button>}
      />

      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="w-full sm:w-80">
            <SearchInput value={search} onChange={setSearch} placeholder="חיפוש לפי שם נוסע או מספר הפנייה…" />
          </div>
          <div className="w-full sm:w-52">
            <Select<ReferralStatus | 'all'> value={status} options={statusOptions} onChange={setStatus} />
          </div>
          <p className="text-sm text-slate-500 sm:ms-auto">
            {loading ? 'טוען…' : <>{formatNumber(rows.length)} הפניות</>}
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-slate-200 bg-white shadow-card">
            <EmptyState title="שגיאה בטעינת ההפניות" description={error.message} action={<Button variant="outline" onClick={refetch}>נסה שוב</Button>} />
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
            emptyState={<EmptyState icon={<FileText className="h-7 w-7" />} title="לא נמצאו הפניות" description="נסה לשנות את מונחי החיפוש או הסינון." />}
          />
        )}
      </div>

      <ReferralIntakeDrawer open={intake.isOpen} onClose={intake.close} />
    </div>
  );
}
