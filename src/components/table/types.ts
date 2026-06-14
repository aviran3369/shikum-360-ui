import { type ReactNode } from 'react';

export type ColumnPreset = 'basic' | 'finance' | 'extra';
export type ColumnAlign = 'start' | 'center' | 'end';

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  align?: ColumnAlign;
  /** Tailwind width utility, e.g. 'w-28'. */
  width?: string;
  headerClassName?: string;
  cellClassName?: string;
  /** Included when the user picks "recommended columns only". */
  recommended?: boolean;
  /** Membership used by the column-settings presets (basic / finance). */
  preset?: ColumnPreset;
  /** Maps a raw funnel-filter value to a display label (e.g. status code → Hebrew). */
  formatFilterOption?: (value: string) => ReactNode;
}

export interface SortState {
  key: string;
  dir: 'asc' | 'desc';
}
