import type { SortState } from '@/components/table';

/** Client-side stable sort by a row key. */
export function sortRows<T>(rows: T[], sort: SortState | null): T[] {
  if (!sort) return rows;
  const dir = sort.dir === 'asc' ? 1 : -1;
  const key = sort.key as keyof T;
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return av < bv ? -dir : av > bv ? dir : 0;
  });
}

/** asc → desc → none toggle for a column id. */
export function cycleSortState(prev: SortState | null, key: string): SortState | null {
  if (!prev || prev.key !== key) return { key, dir: 'asc' };
  if (prev.dir === 'asc') return { key, dir: 'desc' };
  return null;
}
