import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button, Modal, RangeCalendar } from '@/components/ui';
import { type DateRange, toISODate } from '@/lib/date';
import { formatDate } from '@/lib/format';
import { mockMutate } from '@/lib/mockApi';
import { cn } from '@/lib/cn';

function addDays(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

function buildPresets(): { label: string; range: DateRange }[] {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const prevMonthEnd = new Date(y, m, 0);
  return [
    { label: 'היום', range: { from: toISODate(today), to: toISODate(today) } },
    { label: '7 ימים אחרונים', range: { from: toISODate(addDays(today, -6)), to: toISODate(today) } },
    { label: 'החודש הנוכחי', range: { from: toISODate(new Date(y, m, 1)), to: toISODate(today) } },
    {
      label: 'חודש קודם',
      range: { from: toISODate(new Date(y, m - 1, 1)), to: toISODate(prevMonthEnd) },
    },
  ];
}

export function ReportDateRangeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [range, setRange] = useState<DateRange>({ from: '2026-07-01', to: '2026-07-31' });
  const [loading, setLoading] = useState(false);
  const presets = buildPresets();

  const ready = !!range.from && !!range.to;

  const onExport = async () => {
    if (!ready) return;
    setLoading(true);
    await mockMutate(range, 900);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="בחירת טווח תאריכים לדוח"
      description="בחר טווח תאריכים לייצוא. אם לא תבחר טווח, יופק דוח עבור החודש הנוכחי."
      size="sm"
      footer={
        <Button fullWidth icon={<Download className="h-4 w-4" />} loading={loading} disabled={!ready} onClick={onExport}>
          הפעל וייצא דוח
        </Button>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setRange(p.range)}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="my-3 flex justify-center">
        <RangeCalendar value={range} onChange={setRange} months={1} initialMonth={{ year: 2026, month: 6 }} />
      </div>

      <div
        className={cn(
          'flex items-center justify-center gap-2 rounded-lg border bg-slate-50/70 px-3 py-2 text-sm',
          ready ? 'border-primary-200 text-slate-700' : 'border-slate-200 text-slate-400',
        )}
      >
        <span className="text-slate-500">טווח תאריכים לייצוא:</span>
        <span className="font-medium tabular-nums">
          {range.from ? formatDate(range.from) : '—'} – {range.to ? formatDate(range.to) : '—'}
        </span>
      </div>
    </Modal>
  );
}
