import { useEffect, useMemo, useState } from 'react';
import { GripVertical, RotateCcw } from 'lucide-react';
import { Button, Checkbox, Modal, SearchInput, SegmentedControl, Toggle } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { Column } from './types';

type PresetId = 'basic' | 'all' | 'finance';

export interface ColumnSettingsModalProps<T> {
  open: boolean;
  onClose: () => void;
  columns: Column<T>[];
  visibleIds: string[];
  defaultIds: string[];
  onApply: (ids: string[]) => void;
}

function reorder(list: string[], fromId: string, toId: string): string[] {
  if (fromId === toId) return list;
  const next = list.slice();
  const from = next.indexOf(fromId);
  const to = next.indexOf(toId);
  if (from < 0 || to < 0) return list;
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

/** Column visibility/order editor: presets, search, recommended-only, drag-reorder, reset. */
export function ColumnSettingsModal<T>({
  open,
  onClose,
  columns,
  visibleIds,
  defaultIds,
  onApply,
}: ColumnSettingsModalProps<T>) {
  const allIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const [order, setOrder] = useState<string[]>(allIds);
  const [visible, setVisible] = useState<Set<string>>(new Set(visibleIds));
  const [query, setQuery] = useState('');
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  // Re-sync drafts whenever the modal is (re)opened.
  useEffect(() => {
    if (!open) return;
    const ordered = [...visibleIds, ...allIds.filter((id) => !visibleIds.includes(id))];
    setOrder(ordered);
    setVisible(new Set(visibleIds));
    setQuery('');
    setRecommendedOnly(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const presetIds = (preset: PresetId): string[] => {
    if (preset === 'all') return allIds;
    if (preset === 'finance') return columns.filter((c) => c.preset === 'basic' || c.preset === 'finance').map((c) => c.id);
    return columns.filter((c) => c.preset === 'basic').map((c) => c.id);
  };

  const applyPreset = (preset: PresetId) => {
    setVisible(new Set(presetIds(preset)));
    setRecommendedOnly(false);
  };

  const activePreset: PresetId | null = (['basic', 'finance', 'all'] as PresetId[]).find((p) => {
    const ids = new Set(presetIds(p));
    return ids.size === visible.size && [...visible].every((id) => ids.has(id));
  }) ?? null;

  const toggleRecommendedOnly = (on: boolean) => {
    setRecommendedOnly(on);
    if (on) setVisible(new Set(columns.filter((c) => c.recommended).map((c) => c.id)));
  };

  const columnsById = useMemo(() => new Map(columns.map((c) => [c.id, c])), [columns]);
  const shownOrder = order.filter((id) => {
    const col = columnsById.get(id);
    if (!col) return false;
    return col.header.toLowerCase().includes(query.trim().toLowerCase());
  });

  const allChecked = visible.size === allIds.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="הגדרות עמודות"
      size="sm"
      bodyClassName="space-y-3"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button onClick={() => onApply(order.filter((id) => visible.has(id)))}>הפעל</Button>
        </>
      }
    >
      <SegmentedControl<PresetId>
        className="w-full"
        options={[
          { value: 'basic', label: 'בסיסי' },
          { value: 'all', label: 'הכל' },
          { value: 'finance', label: 'כספים' },
        ]}
        value={activePreset ?? 'all'}
        onChange={applyPreset}
      />

      <SearchInput value={query} onChange={setQuery} placeholder="חיפוש עמודה…" />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Checkbox
            checked={allChecked}
            indeterminate={visible.size > 0 && !allChecked}
            onChange={(e) => setVisible(new Set(e.target.checked ? allIds : []))}
          />
          בחר את כל העמודות
        </label>
        <button
          type="button"
          onClick={() => {
            setVisible(new Set(defaultIds));
            setOrder([...defaultIds, ...allIds.filter((id) => !defaultIds.includes(id))]);
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          <RotateCcw className="h-3 w-3" />
          איפוס לברירת מחדל
        </button>
      </div>

      <Toggle checked={recommendedOnly} onChange={toggleRecommendedOnly} label="הצג רק עמודות מומלצות" />

      <ul className="max-h-64 space-y-1 overflow-auto rounded-lg border border-slate-100 p-1">
        {shownOrder.map((id) => {
          const col = columnsById.get(id)!;
          return (
            <li
              key={id}
              draggable
              onDragStart={() => setDragId(id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) setOrder((o) => reorder(o, dragId, id));
                setDragId(null);
              }}
              className={cn(
                'flex items-center justify-between gap-2 rounded-md border border-transparent px-2 py-1.5 transition-colors hover:bg-slate-50',
                dragId === id && 'opacity-50',
              )}
            >
              <span className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 cursor-grab text-slate-300" />
                <span className="text-sm text-slate-700">{col.header}</span>
                {col.recommended && (
                  <span className="rounded bg-primary-50 px-1.5 py-0.5 text-2xs font-medium text-primary-600">מומלץ</span>
                )}
              </span>
              <Checkbox
                checked={visible.has(id)}
                onChange={(e) => {
                  setVisible((prev) => {
                    const next = new Set(prev);
                    e.target.checked ? next.add(id) : next.delete(id);
                    return next;
                  });
                }}
              />
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
