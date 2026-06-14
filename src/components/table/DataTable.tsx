import { type ReactNode, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ListFilter } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Checkbox } from '@/components/ui';
import { useDisclosure } from '@/hooks';
import { ColumnFilterMenu } from './ColumnFilterMenu';
import type { Column, SortState } from './types';

const alignClass: Record<NonNullable<Column<unknown>['align']>, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
};

interface HeaderCellProps<T> {
  column: Column<T>;
  sort: SortState | null;
  onSort?: (id: string) => void;
  filterActive: boolean;
  filterValues: string[];
  onColumnFilterChange?: (id: string, values: string[]) => void;
  getColumnOptions?: (id: string) => Promise<string[]>;
  onHideColumn?: (id: string) => void;
  onReorder?: (fromId: string, toId: string) => void;
  withBorder?: boolean;
}

function HeaderCell<T>({
  column,
  sort,
  onSort,
  filterActive,
  filterValues,
  onColumnFilterChange,
  getColumnOptions,
  onHideColumn,
  onReorder,
  withBorder,
}: HeaderCellProps<T>) {
  const funnelRef = useRef<HTMLButtonElement>(null);
  const menu = useDisclosure();
  const [dragOver, setDragOver] = useState(false);
  const isSorted = sort?.key === column.id;
  const draggable = !!onReorder;

  return (
    <th
      scope="col"
      onDragOver={draggable ? (e) => { e.preventDefault(); setDragOver(true); } : undefined}
      onDragLeave={draggable ? () => setDragOver(false) : undefined}
      onDrop={
        draggable
          ? (e) => {
              e.preventDefault();
              setDragOver(false);
              const from = e.dataTransfer.getData('text/plain');
              if (from) onReorder!(from, column.id);
            }
          : undefined
      }
      className={cn(
        'whitespace-nowrap px-3 py-2.5 text-[12px] font-semibold text-slate-600',
        withBorder && 'border-e border-slate-200',
        alignClass[column.align ?? 'start'],
        column.width,
        column.headerClassName,
        dragOver && 'bg-primary-100',
      )}
    >
      <div className={cn('flex items-center gap-1', column.align === 'center' && 'justify-center', column.align === 'end' && 'justify-end')}>
        <span
          draggable={draggable}
          onDragStart={
            draggable
              ? (e) => {
                  e.dataTransfer.setData('text/plain', column.id);
                  e.dataTransfer.effectAllowed = 'move';
                }
              : undefined
          }
          title={draggable ? 'גרור לשינוי סדר העמודות' : undefined}
          className={cn('truncate', draggable && 'cursor-grab active:cursor-grabbing')}
        >
          {column.header}
        </span>
        {column.sortable && onSort && (
          <button
            type="button"
            onClick={() => onSort(column.id)}
            aria-label={`מיון לפי ${column.header}`}
            className={cn('rounded p-0.5 transition-colors hover:bg-brand-200/50', isSorted ? 'text-primary-600' : 'text-slate-400')}
          >
            {isSorted ? (
              sort.dir === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        {column.filterable && (
          <button
            ref={funnelRef}
            type="button"
            onClick={menu.toggle}
            aria-label={`סינון לפי ${column.header}`}
            className={cn('rounded p-0.5 transition-colors hover:bg-brand-200/50', filterActive ? 'text-primary-600' : 'text-slate-400')}
          >
            <ListFilter className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {column.filterable && getColumnOptions && onColumnFilterChange && (
        <ColumnFilterMenu
          anchorRef={funnelRef}
          open={menu.isOpen}
          onClose={menu.close}
          selected={filterValues}
          onApply={(values) => onColumnFilterChange(column.id, values)}
          loadOptions={() => getColumnOptions(column.id)}
          formatOption={column.formatFilterOption}
          onHideColumn={onHideColumn ? () => onHideColumn(column.id) : undefined}
        />
      )}
    </th>
  );
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  skeletonRows?: number;

  sort?: SortState | null;
  onSortChange?: (id: string) => void;

  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: (ids: string[], checked: boolean) => void;

  columnFilterValues?: Record<string, string[]>;
  onColumnFilterChange?: (id: string, values: string[]) => void;
  getColumnOptions?: (id: string) => Promise<string[]>;
  onHideColumn?: (id: string) => void;

  /** Order + visibility of columns by id. Defaults to all columns in declared order. */
  visibleColumnIds?: string[];
  /** Enables drag-and-drop column reordering on the header (fromId dropped onto toId). */
  onReorderColumn?: (fromId: string, toId: string) => void;

  groupBy?: (row: T) => string;
  renderGroupHeader?: (groupKey: string, rows: T[]) => ReactNode;

  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
  /** Render without the card chrome (border/shadow/bg) so a parent can wrap it. */
  bare?: boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  skeletonRows = 8,
  sort = null,
  onSortChange,
  selectable = false,
  selectedIds,
  onToggleRow,
  onToggleAll,
  columnFilterValues = {},
  onColumnFilterChange,
  getColumnOptions,
  onHideColumn,
  visibleColumnIds,
  onReorderColumn,
  groupBy,
  renderGroupHeader,
  emptyState,
  onRowClick,
  stickyHeader = false,
  bare = false,
  className,
}: DataTableProps<T>) {
  const visibleColumns = useMemo(() => {
    const order = visibleColumnIds ?? columns.map((c) => c.id);
    return order.map((id) => columns.find((c) => c.id === id)).filter(Boolean) as Column<T>[];
  }, [columns, visibleColumnIds]);

  const colSpan = visibleColumns.length + (selectable ? 1 : 0);
  const pageIds = rows.map(rowKey);
  const allSelected = selectable && pageIds.length > 0 && pageIds.every((id) => selectedIds?.has(id));
  const someSelected = selectable && !allSelected && pageIds.some((id) => selectedIds?.has(id));

  const renderRow = (row: T, index: number) => {
    const id = rowKey(row);
    const selected = selectedIds?.has(id);
    return (
      <tr
        key={id}
        onClick={() => onRowClick?.(row)}
        className={cn(
          'border-b border-slate-200 transition-colors',
          // Zebra striping (white / lavender) per colors.png; selection & hover win.
          selected ? 'bg-primary-50' : cn(index % 2 === 1 ? 'bg-[#F6F0FF]' : 'bg-white', 'hover:bg-primary-50/60'),
          onRowClick && 'cursor-pointer',
        )}
      >
        {selectable && (
          <td className="w-10 border-e border-slate-200 px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={!!selected} onChange={() => onToggleRow?.(id)} />
          </td>
        )}
        {visibleColumns.map((col, idx) => (
          <td
            key={col.id}
            className={cn(
              'whitespace-nowrap px-3 py-2.5 text-[13px] text-slate-700',
              idx < visibleColumns.length - 1 && 'border-e border-slate-200',
              alignClass[col.align ?? 'start'],
              col.cellClassName,
            )}
          >
            {col.cell(row)}
          </td>
        ))}
      </tr>
    );
  };

  const body = (() => {
    if (loading) {
      return Array.from({ length: skeletonRows }, (_, i) => (
        <tr key={i} className="border-b border-slate-100">
          {selectable && (
            <td className="px-3 py-2">
              <div className="skeleton h-4 w-4 rounded" />
            </td>
          )}
          {visibleColumns.map((col) => (
            <td key={col.id} className="px-3 py-2">
              <div className="skeleton h-3.5 rounded" style={{ width: `${50 + ((col.id.length * 7) % 45)}%` }} />
            </td>
          ))}
        </tr>
      ));
    }

    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={colSpan} className="p-0">
            {emptyState}
          </td>
        </tr>
      );
    }

    if (groupBy) {
      const out: ReactNode[] = [];
      const groups = new Map<string, T[]>();
      rows.forEach((r) => {
        const k = groupBy(r);
        const arr = groups.get(k);
        if (arr) arr.push(r);
        else groups.set(k, [r]);
      });
      let lastKey: string | null = null;
      let dataIndex = 0;
      rows.forEach((row) => {
        const key = groupBy(row);
        if (key !== lastKey) {
          lastKey = key;
          out.push(
            <tr key={`g-${key}`} className="bg-surface-muted">
              <td colSpan={colSpan} className="border-y border-[#DAD7F1] px-3 py-2 text-sm font-semibold text-brand-800">
                {renderGroupHeader ? renderGroupHeader(key, groups.get(key)!) : key}
              </td>
            </tr>,
          );
        }
        out.push(renderRow(row, dataIndex));
        dataIndex += 1;
      });
      return out;
    }

    return rows.map((row, i) => renderRow(row, i));
  })();

  return (
    <div
      className={cn(
        'overflow-x-auto',
        !bare && 'rounded-xl border border-slate-200 bg-white shadow-card',
        className,
      )}
    >
      <table className="w-full border-collapse text-start">
        <thead className={cn('bg-surface-muted', stickyHeader && 'sticky top-0 z-10')}>
          <tr className="border-b border-[#DAD7F1]">
            {selectable && (
              <th className="w-10 border-e border-slate-200 px-3 py-2.5">
                <Checkbox
                  checked={!!allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => onToggleAll?.(pageIds, e.target.checked)}
                />
              </th>
            )}
            {visibleColumns.map((col, idx) => (
              <HeaderCell
                key={col.id}
                column={col}
                sort={sort}
                onSort={onSortChange}
                filterActive={(columnFilterValues[col.id]?.length ?? 0) > 0}
                filterValues={columnFilterValues[col.id] ?? []}
                onColumnFilterChange={onColumnFilterChange}
                getColumnOptions={getColumnOptions}
                onHideColumn={onHideColumn}
                onReorder={onReorderColumn}
                withBorder={idx < visibleColumns.length - 1}
              />
            ))}
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
