import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, FileBarChart, Plus, RefreshCw, SearchX, Settings2, UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button, EmptyState } from '@/components/ui';
import { BulkActionBar, ColumnSettingsModal, DataTable, useTableState } from '@/components/table';
import { useAsync, useDebounce, useDisclosure } from '@/hooks';
import { getTripColumnOptions, getTrips, mockMutate, type TripQuery } from '@/lib/mockApi';
import { OrderSource } from '@/types/enums';
import type { Trip } from '@/types';
import { formatDateLong, formatNumber } from '@/lib/format';
import { ALL_COLUMN_IDS, BASIC_COLUMN_IDS, tripColumns } from './tripColumns';
import { countActiveFilters, defaultTripFilters, type TripFiltersState } from './filters';
import { TripFilters } from './TripFilters';
import { TripStatsStrip } from './TripStatsStrip';
import { OrdersByPassengerModal } from './OrdersByPassengerModal';
import { ReportDateRangeModal } from './ReportDateRangeModal';
import { NewTripDrawer } from './NewTripDrawer';

type ColumnPreset = 'basic' | 'all' | 'finance';

const FINANCE_COLUMN_IDS = tripColumns
  .filter((c) => c.preset === 'basic' || c.preset === 'finance')
  .map((c) => c.id);

function presetIds(preset: ColumnPreset): string[] {
  if (preset === 'all') return ALL_COLUMN_IDS;
  if (preset === 'finance') return FINANCE_COLUMN_IDS;
  return BASIC_COLUMN_IDS;
}

export function SchedulingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<TripFiltersState>(defaultTripFilters);
  const [expanded, setExpanded] = useState(false);
  const [groupByDays, setGroupByDays] = useState(false);
  const [columnPreset, setColumnPreset] = useState<ColumnPreset>('basic');

  const table = useTableState<Trip>({
    allColumns: tripColumns,
    defaultVisibleIds: BASIC_COLUMN_IDS,
    storageKey: 'shikum.scheduling.columns',
  });
  const passengerModal = useDisclosure();
  const reportModal = useDisclosure();
  const columnsModal = useDisclosure();
  const newTrip = useDisclosure();

  // Open the create drawer when arriving via ⌘K / dashboard (?new=1).
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      newTrip.open();
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const debouncedSearch = useDebounce(filters.search, 300);

  const query: TripQuery = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: filters.status,
      dateFrom: filters.dateRange.from ?? undefined,
      dateTo: filters.dateRange.to ?? undefined,
      origin: filters.origin || undefined,
      destination: filters.destination || undefined,
      driver: filters.driver || undefined,
      passenger: filters.passenger || undefined,
      referralNumber: filters.referralNumber || undefined,
      attributes: filters.attributes,
      columnFilters: table.columnFilters,
      sortBy: table.sort?.key ?? (groupByDays ? 'date' : undefined),
      sortDir: table.sort?.dir ?? (groupByDays ? 'asc' : null),
      pageSize: 500,
    }),
    [filters, debouncedSearch, table.columnFilters, table.sort, groupByDays],
  );

  const depsKey = JSON.stringify(query);
  const { data, loading, error, refetch } = useAsync(() => getTrips(query), [depsKey]);

  const rows = useMemo(() => {
    const items = data?.items ?? [];
    if (groupByDays) {
      return [...items].sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
    }
    return items;
  }, [data, groupByDays]);

  const stats = data
    ? {
        total: data.total,
        orderedBySelf: data.items.filter((t) => t.orderSource === OrderSource.Passenger).length,
        orderedByManager: data.items.filter((t) => t.orderSource === OrderSource.Manager).length,
      }
    : null;

  const activeCount = countActiveFilters(filters);

  const reset = () => {
    setFilters(defaultTripFilters);
    table.setColumnFilters({});
  };

  const onColumnPresetChange = (preset: ColumnPreset) => {
    setColumnPreset(preset);
    table.setVisibleColumnIds(presetIds(preset));
  };

  const hideColumn = (id: string) => table.setVisibleColumnIds(table.visibleColumnIds.filter((c) => c !== id));

  const bulkAction = async () => {
    await mockMutate(null, 600);
    table.clearSelection();
  };

  return (
    <div>
      <PageHeader title="ניהול סידור" subtitle="ניהול ומעקב אחר נסיעות הסידור של הנהגים והנוסעים"
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={newTrip.open}>
            נסיעה חדשה
          </Button>
        }
      >
        <TripStatsStrip stats={stats} loading={loading} onOpenPassengerBreakdown={passengerModal.open} />
      </PageHeader>

      <div className="space-y-3 p-5">
        <TripFilters
          filters={filters}
          onChange={setFilters}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((v) => !v)}
          onReset={reset}
          activeCount={activeCount}
          groupByDays={groupByDays}
          onGroupByDaysChange={setGroupByDays}
          columnPreset={columnPreset}
          onColumnPresetChange={onColumnPresetChange}
          onOpenColumnSettings={columnsModal.open}
          onRefresh={refetch}
          loading={loading}
        />

        {error ? (
          <div className="rounded-xl border border-slate-200 bg-white shadow-card">
            <EmptyState
              icon={<AlertTriangle className="h-7 w-7" />}
              title="שגיאה בטעינת הנסיעות"
              description={error.message}
              action={<Button variant="outline" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={refetch}>נסה שוב</Button>}
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            {/* Toolbar — count + actions, inside the same card as the table (per colors.png). */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-2.5">
              <p className="text-sm text-slate-500">
                {loading ? 'טוען נסיעות…' : <>נטענו <span className="font-semibold tabular-nums text-slate-700">{formatNumber(data?.total ?? 0)}</span> נסיעות</>}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" icon={<Settings2 className="h-3.5 w-3.5" />} onClick={columnsModal.open}>
                  עמודות
                </Button>
                <Button variant="outline" size="sm" icon={<FileBarChart className="h-3.5 w-3.5" />} onClick={reportModal.open}>
                  דוחות
                </Button>
              </div>
            </div>

            {table.selectedIds.size > 0 && (
              <div className="border-b border-slate-200 p-3">
                <BulkActionBar count={table.selectedIds.size} onClear={table.clearSelection}>
                  <Button variant="outline" size="xs" onClick={bulkAction}>
                    עדכן תעריף עבור {table.selectedIds.size} נסיעות
                  </Button>
                  <Button variant="outline" size="xs" icon={<UserPlus className="h-3.5 w-3.5" />} onClick={bulkAction}>
                    שיבוץ נהג
                  </Button>
                  <Button variant="danger" size="xs" onClick={bulkAction}>
                    מחיקה
                  </Button>
                </BulkActionBar>
              </div>
            )}

            <DataTable
              bare
              columns={tripColumns}
              rows={rows}
              rowKey={(t) => t.id}
              loading={loading}
              skeletonRows={10}
              selectable
              selectedIds={table.selectedIds}
              onToggleRow={table.toggleRow}
              onToggleAll={table.toggleAll}
              sort={table.sort}
              onSortChange={table.cycleSort}
              columnFilterValues={table.columnFilters}
              onColumnFilterChange={table.setColumnFilter}
              getColumnOptions={getTripColumnOptions}
              onHideColumn={hideColumn}
              visibleColumnIds={table.visibleColumnIds}
              onReorderColumn={table.reorderColumn}
              groupBy={groupByDays ? (t) => t.date : undefined}
              renderGroupHeader={(key, groupRows) => (
                <span className="flex items-center gap-2">
                  {formatDateLong(key)}
                  <span className="text-xs font-normal text-slate-400">· {groupRows.length} נסיעות</span>
                </span>
              )}
              emptyState={
                <EmptyState
                  title="אין תוצאות"
                  description="לא נמצאו נסיעות התואמות את הסינון שבחרת."
                  action={<Button icon={<SearchX className="h-4 w-4" />} onClick={reset}>איפוס מסננים</Button>}
                />
              }
            />
          </div>
        )}
      </div>

      <OrdersByPassengerModal open={passengerModal.isOpen} onClose={passengerModal.close} />
      <ReportDateRangeModal open={reportModal.isOpen} onClose={reportModal.close} />
      <ColumnSettingsModal
        open={columnsModal.isOpen}
        onClose={columnsModal.close}
        columns={tripColumns}
        visibleIds={table.visibleColumnIds}
        defaultIds={BASIC_COLUMN_IDS}
        onApply={(ids) => {
          table.setVisibleColumnIds(ids);
          columnsModal.close();
        }}
      />
      <NewTripDrawer open={newTrip.isOpen} onClose={newTrip.close} />
    </div>
  );
}
