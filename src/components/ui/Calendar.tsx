import { useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  type DateRange,
  HEB_WEEKDAYS,
  addMonths,
  getMonthMatrix,
  isSameDay,
  monthTitle,
  parseISODate,
  toISODate,
} from '@/lib/date';
import { formatDate } from '@/lib/format';
import { useDisclosure } from '@/hooks';
import { Popover } from './Popover';
import { Button } from './Button';

const TODAY = new Date();

interface MonthViewProps {
  year: number;
  month: number;
  range: DateRange;
  hover: string | null;
  onHover: (iso: string | null) => void;
  onPick: (iso: string) => void;
}

function MonthView({ year, month, range, hover, onHover, onPick }: MonthViewProps) {
  const matrix = getMonthMatrix(year, month);
  const from = range.from ? parseISODate(range.from) : null;
  const to = range.to ? parseISODate(range.to) : null;
  const previewTo = !to && hover ? parseISODate(hover) : to;

  return (
    <div className="w-[15.5rem]">
      <div className="mb-2 text-center text-sm font-semibold text-slate-700">{monthTitle(year, month)}</div>
      <div className="mb-1 grid grid-cols-7">
        {HEB_WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-2xs font-medium text-slate-400">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {matrix.flat().map((day) => {
          const iso = toISODate(day);
          const outside = day.getMonth() !== month;
          const isFrom = from && isSameDay(day, from);
          const isTo = previewTo && isSameDay(day, previewTo);
          const lo = from && previewTo ? (from <= previewTo ? from : previewTo) : null;
          const hi = from && previewTo ? (from <= previewTo ? previewTo : from) : null;
          const inRange = lo && hi && day >= lo && day <= hi;
          const isEndpoint = isFrom || isTo;
          const isToday = isSameDay(day, TODAY);

          return (
            <div
              key={iso}
              className={cn(
                'flex h-9 items-center justify-center',
                inRange && !isEndpoint && 'bg-primary-50',
                inRange && isFrom && 'rounded-s-full bg-primary-50',
                inRange && isTo && 'rounded-e-full bg-primary-50',
              )}
            >
              <button
                type="button"
                onMouseEnter={() => onHover(iso)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onPick(iso)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm tabular-nums transition-colors',
                  outside ? 'text-slate-300' : 'text-slate-700 hover:bg-primary-100',
                  isEndpoint && 'bg-primary-600 font-semibold text-white hover:bg-primary-600',
                  isToday && !isEndpoint && 'ring-1 ring-primary-400',
                )}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface RangeCalendarProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  months?: 1 | 2;
  initialMonth?: { year: number; month: number };
}

/** Range calendar with 1 or 2 RTL month grids and live range preview. */
export function RangeCalendar({ value, onChange, months = 2, initialMonth }: RangeCalendarProps) {
  const base = initialMonth ??
    (value.from ? { year: parseISODate(value.from).getFullYear(), month: parseISODate(value.from).getMonth() } : { year: 2026, month: 6 });
  const [view, setView] = useState(base);
  const [hover, setHover] = useState<string | null>(null);

  const pick = (iso: string) => {
    if (!value.from || (value.from && value.to)) {
      onChange({ from: iso, to: null });
    } else if (iso < value.from) {
      onChange({ from: iso, to: value.from });
    } else {
      onChange({ from: value.from, to: iso });
    }
  };

  const second = addMonths(view.year, view.month, 1);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between px-1">
        <button
          type="button"
          aria-label="חודש קודם"
          onClick={() => setView(addMonths(view.year, view.month, -1))}
          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="חודש הבא"
          onClick={() => setView(addMonths(view.year, view.month, 1))}
          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
      <div className="flex gap-5">
        <MonthView year={view.year} month={view.month} range={value} hover={hover} onHover={setHover} onPick={pick} />
        {months === 2 && (
          <MonthView year={second.year} month={second.month} range={value} hover={hover} onHover={setHover} onPick={pick} />
        )}
      </div>
    </div>
  );
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  sizeVariant?: 'sm' | 'md';
  className?: string;
}

/** Trigger input + popover dual-month range picker (used by the trip filters). */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'בחר טווח תאריכים',
  sizeVariant = 'sm',
  className,
}: DateRangePickerProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { isOpen, toggle, close } = useDisclosure();
  const h = sizeVariant === 'md' ? 'h-9' : 'h-8';

  const label =
    value.from && value.to
      ? `${formatDate(value.from)} - ${formatDate(value.to)}`
      : value.from
        ? `${formatDate(value.from)} - …`
        : placeholder;

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={toggle}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm transition-colors hover:border-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25',
          h,
          className,
        )}
      >
        <span className={cn('truncate', value.from ? 'text-slate-800' : 'text-slate-400')}>{label}</span>
        <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      <Popover anchorRef={anchorRef} open={isOpen} onClose={close} align="start" width={560}>
        <div className="p-3">
          <RangeCalendar value={value} onChange={onChange} months={2} />
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => onChange({ from: null, to: null })}
              className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              ניקוי
            </button>
            <Button size="xs" onClick={close} disabled={!value.from || !value.to}>
              אישור
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
}
