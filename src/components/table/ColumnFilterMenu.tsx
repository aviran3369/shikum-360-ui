import { type ReactNode, type RefObject, useEffect, useMemo, useState } from 'react';
import { EyeOff } from 'lucide-react';
import { Checkbox, Popover, SearchInput, Spinner } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface ColumnFilterMenuProps {
  anchorRef: RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
  selected: string[];
  onApply: (values: string[]) => void;
  loadOptions: () => Promise<string[]>;
  formatOption?: (value: string) => ReactNode;
  onHideColumn?: () => void;
}

/** Per-column funnel menu: hide-column, search, select-all and a checkbox value list. */
export function ColumnFilterMenu({
  anchorRef,
  open,
  onClose,
  selected,
  onApply,
  loadOptions,
  formatOption,
  onHideColumn,
}: ColumnFilterMenuProps) {
  const [options, setOptions] = useState<string[] | null>(null);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Set<string>>(new Set(selected));

  useEffect(() => {
    if (!open) return;
    setDraft(new Set(selected));
    setQuery('');
    let active = true;
    setOptions(null);
    loadOptions().then((opts) => active && setOptions(opts));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filtered = useMemo(() => {
    if (!options) return [];
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const label = formatOption ? String(formatOption(o)) : o;
      return o.toLowerCase().includes(q) || label.toLowerCase().includes(q);
    });
  }, [options, query, formatOption]);

  const allChecked = options != null && options.length > 0 && draft.size === options.length;
  const someChecked = draft.size > 0 && !allChecked;

  const toggle = (value: string) => {
    setDraft((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const apply = (values: string[]) => {
    onApply(values);
    onClose();
  };

  return (
    <Popover anchorRef={anchorRef} open={open} onClose={onClose} align="start" width={240}>
      <div className="flex flex-col">
        {onHideColumn && (
          <button
            type="button"
            onClick={() => {
              onHideColumn();
              onClose();
            }}
            className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-start text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
            הסתר עמודה
          </button>
        )}
        <div className="p-2">
          <SearchInput value={query} onChange={setQuery} placeholder="חיפוש ערך…" />
        </div>
        <label className="flex items-center gap-2 border-y border-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={(e) => setDraft(new Set(e.target.checked && options ? options : []))}
          />
          בחר הכל
        </label>

        <div className="max-h-56 overflow-auto py-1">
          {options == null ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-400">
              <Spinner size="xs" /> טוען…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">לא נמצאו ערכים</div>
          ) : (
            filtered.map((value) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Checkbox checked={draft.has(value)} onChange={() => toggle(value)} />
                <span className="truncate">{formatOption ? formatOption(value) : value}</span>
              </label>
            ))
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2">
          <button
            type="button"
            onClick={() => apply([])}
            className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            ניקוי
          </button>
          <button
            type="button"
            onClick={() => apply([...draft])}
            className={cn(
              'rounded-md bg-primary-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-700',
            )}
          >
            החל
          </button>
        </div>
      </div>
    </Popover>
  );
}
