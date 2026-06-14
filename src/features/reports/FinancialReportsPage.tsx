import { useMemo, useState } from 'react';
import { Banknote, FileDown, Receipt, TrendingDown, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Badge, Button, EmptyState } from '@/components/ui';
import { DataTable, type Column, type SortState } from '@/components/table';
import { StatCard } from '@/features/dashboard/StatCard';
import { useAsync, useDisclosure } from '@/hooks';
import { getFinancialRows } from '@/lib/mockApi';
import { financialStatusMeta } from '@/lib/statusMaps';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cycleSortState, sortRows } from '@/lib/sort';
import type { FinancialRow } from '@/types';
import { ReportDateRangeModal } from '@/features/scheduling/ReportDateRangeModal';

const columns: Column<FinancialRow>[] = [
  { id: 'period', header: 'תקופה', cell: (r) => <span className="font-medium text-slate-700">{r.period}</span>, sortable: true },
  { id: 'fundingSource', header: 'מקור מימון', cell: (r) => r.fundingSource, sortable: true },
  { id: 'tripsCount', header: 'נסיעות', cell: (r) => <span className="tabular-nums">{formatNumber(r.tripsCount)}</span>, align: 'center', sortable: true },
  { id: 'grossAmount', header: 'ברוטו', cell: (r) => <span className="tabular-nums text-slate-700">{formatCurrency(r.grossAmount)}</span>, align: 'end', sortable: true },
  { id: 'discounts', header: 'הנחות', cell: (r) => <span className="tabular-nums text-red-600">−{formatCurrency(r.discounts)}</span>, align: 'end' },
  { id: 'netAmount', header: 'נטו', cell: (r) => <span className="font-semibold tabular-nums text-slate-800">{formatCurrency(r.netAmount)}</span>, align: 'end', sortable: true },
  { id: 'status', header: 'סטטוס', cell: (r) => <Badge tone={financialStatusMeta[r.status].tone} dot>{financialStatusMeta[r.status].label}</Badge>, sortable: true },
];

export function FinancialReportsPage() {
  const [sort, setSort] = useState<SortState | null>(null);
  const exportModal = useDisclosure();
  const { data, loading, error, refetch } = useAsync(() => getFinancialRows(), []);

  const rows = useMemo(() => sortRows(data ?? [], sort), [data, sort]);
  const totals = useMemo(() => {
    const items = data ?? [];
    return {
      gross: items.reduce((s, r) => s + r.grossAmount, 0),
      discounts: items.reduce((s, r) => s + r.discounts, 0),
      net: items.reduce((s, r) => s + r.netAmount, 0),
      trips: items.reduce((s, r) => s + r.tripsCount, 0),
    };
  }, [data]);

  return (
    <div>
      <PageHeader title="דוחות כספיים" subtitle="התחשבנות מול מקורות מימון"
        actions={<Button icon={<FileDown className="h-4 w-4" />} onClick={exportModal.open}>ייצוא לאקסל</Button>}
      />

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="סה״כ ברוטו" value={formatCurrency(totals.gross)} icon={Banknote} loading={loading} iconClassName="bg-primary-50 text-primary-600" />
          <StatCard label="סה״כ הנחות" value={formatCurrency(totals.discounts)} icon={TrendingDown} loading={loading} iconClassName="bg-red-50 text-red-600" />
          <StatCard label="סה״כ נטו" value={formatCurrency(totals.net)} icon={Wallet} loading={loading} iconClassName="bg-emerald-50 text-emerald-600" />
          <StatCard label="סה״כ נסיעות" value={formatNumber(totals.trips)} icon={Receipt} loading={loading} iconClassName="bg-violet-50 text-violet-600" />
        </div>

        {error ? (
          <div className="rounded-xl border border-slate-200 bg-white shadow-card">
            <EmptyState title="שגיאה בטעינת הנתונים" description={error.message} action={<Button variant="outline" onClick={refetch}>נסה שוב</Button>} />
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
            emptyState={<EmptyState icon={<Wallet className="h-7 w-7" />} title="אין נתונים כספיים" />}
          />
        )}
      </div>

      <ReportDateRangeModal open={exportModal.isOpen} onClose={exportModal.close} />
    </div>
  );
}
