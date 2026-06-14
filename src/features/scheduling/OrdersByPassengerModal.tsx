import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { EmptyState, Modal, SearchInput } from '@/components/ui';
import { DataTable, type Column, type SortState } from '@/components/table';
import { useAsync, useDebounce } from '@/hooks';
import { getPassengerOrders } from '@/lib/mockApi';
import { formatNumber, formatPhone } from '@/lib/format';
import type { PassengerOrderSummary } from '@/types';

const columns: Column<PassengerOrderSummary>[] = [
  { id: 'fullName', header: 'שם נוסע', cell: (p) => <span className="font-medium text-slate-700">{p.fullName}</span>, sortable: true },
  { id: 'phone', header: 'טלפון נוסע', cell: (p) => <span dir="ltr" className="tabular-nums text-slate-600">{formatPhone(p.phone)}</span>, sortable: true },
  { id: 'orderedBySelf', header: 'הוזמנו ע״י נוסע', cell: (p) => <span className="tabular-nums">{p.orderedBySelf}</span>, sortable: true, align: 'center' },
  { id: 'orderedByManager', header: 'הוזמנו ע״י מנהל', cell: (p) => <span className="tabular-nums">{p.orderedByManager}</span>, sortable: true, align: 'center' },
  { id: 'total', header: 'סה״כ', cell: (p) => <span className="font-semibold tabular-nums text-slate-800">{p.total}</span>, sortable: true, align: 'center' },
];

export function OrdersByPassengerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);
  const { data, loading } = useAsync(() => getPassengerOrders(debounced), [open, debounced]);
  const [sort, setSort] = useState<SortState | null>({ key: 'total', dir: 'desc' });

  const items = data ?? [];
  const totals = useMemo(
    () => ({
      passengers: items.length,
      self: items.reduce((s, p) => s + p.orderedBySelf, 0),
      manager: items.reduce((s, p) => s + p.orderedByManager, 0),
      trips: items.reduce((s, p) => s + p.total, 0),
    }),
    [items],
  );

  const sorted = useMemo(() => {
    if (!sort) return items;
    const dir = sort.dir === 'asc' ? 1 : -1;
    const key = sort.key as keyof PassengerOrderSummary;
    return [...items].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      return av < bv ? -dir : av > bv ? dir : 0;
    });
  }, [items, sort]);

  const cycleSort = (key: string) =>
    setSort((p) => (!p || p.key !== key ? { key, dir: 'asc' } : p.dir === 'asc' ? { key, dir: 'desc' } : null));

  return (
    <Modal open={open} onClose={onClose} title="פירוט הזמנה לפי נוסע" size="lg" bodyClassName="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Stat label="סה״כ נוסעים" value={totals.passengers} loading={loading} />
        <Stat label="הוזמנו ע״י נוסע" value={totals.self} loading={loading} tone="text-violet-700" />
        <Stat label="הוזמנו ע״י מנהל" value={totals.manager} loading={loading} tone="text-primary-700" />
        <Stat label="סה״כ נסיעות" value={totals.trips} loading={loading} tone="text-slate-800" />
        <div className="ms-auto w-full sm:w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="סינון נוסעים…" />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={sorted}
        rowKey={(p) => p.id}
        loading={loading}
        sort={sort}
        onSortChange={cycleSort}
        emptyState={<EmptyState icon={<Users className="h-7 w-7" />} title="לא נמצאו נוסעים" compact />}
      />
    </Modal>
  );
}

function Stat({ label, value, loading, tone = 'text-slate-800' }: { label: string; value: number; loading: boolean; tone?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-1.5">
      <span className="text-xs text-slate-500">{label}: </span>
      <span className={`text-sm font-bold tabular-nums ${tone}`}>{loading ? '—' : formatNumber(value)}</span>
    </div>
  );
}
