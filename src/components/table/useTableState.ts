import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Column, SortState } from './types';

export interface UseTableStateOptions<T> {
  allColumns: Column<T>[];
  defaultVisibleIds?: string[];
  initialSort?: SortState | null;
  /** When set, column order/visibility is persisted to localStorage under this key. */
  storageKey?: string;
}

/** Centralises sort (tri-state), row selection, per-column funnel filters and column visibility/order. */
export function useTableState<T>({ allColumns, defaultVisibleIds, initialSort = null, storageKey }: UseTableStateOptions<T>) {
  const [sort, setSort] = useState<SortState | null>(initialSort);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(() => {
    const fallback = defaultVisibleIds ?? allColumns.map((c) => c.id);
    if (storageKey) {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const ids: unknown = JSON.parse(raw);
          if (Array.isArray(ids)) {
            const valid = ids.filter((id): id is string => typeof id === 'string' && allColumns.some((c) => c.id === id));
            if (valid.length) return valid;
          }
        }
      } catch {
        /* ignore malformed storage */
      }
    }
    return fallback;
  });

  // Persist column order/visibility whenever it changes.
  useEffect(() => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(visibleColumnIds));
    } catch {
      /* ignore quota / unavailable storage */
    }
  }, [storageKey, visibleColumnIds]);

  // asc → desc → none
  const cycleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  }, []);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((ids: string[], checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const setColumnFilter = useCallback((colId: string, values: string[]) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (values.length === 0) delete next[colId];
      else next[colId] = values;
      return next;
    });
  }, []);

  const activeFilterCount = useMemo(() => Object.keys(columnFilters).length, [columnFilters]);

  // Move column `fromId` to the position of `toId` (used by header drag-and-drop).
  const reorderColumn = useCallback((fromId: string, toId: string) => {
    setVisibleColumnIds((prev) => {
      if (fromId === toId) return prev;
      const next = prev.slice();
      const from = next.indexOf(fromId);
      const to = next.indexOf(toId);
      if (from < 0 || to < 0) return prev;
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  }, []);

  return {
    sort,
    cycleSort,
    selectedIds,
    setSelectedIds,
    toggleRow,
    toggleAll,
    clearSelection,
    columnFilters,
    setColumnFilter,
    setColumnFilters,
    activeFilterCount,
    visibleColumnIds,
    setVisibleColumnIds,
    reorderColumn,
  };
}

export type TableState<T> = ReturnType<typeof useTableState<T>>;
