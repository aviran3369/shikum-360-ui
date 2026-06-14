import { ArrowLeftRight, ChevronDown, RefreshCw, RotateCcw, Settings2, SlidersHorizontal } from 'lucide-react';
import {
  Button,
  DateRangePicker,
  Field,
  Input,
  SearchInput,
  SegmentedControl,
  Select,
  type SelectOption,
  Toggle,
} from '@/components/ui';
import { TripStatus } from '@/types/enums';
import { tripStatusMeta } from '@/lib/statusMaps';
import { cn } from '@/lib/cn';
import type { TripFiltersState } from './filters';

type StatusValue = TripStatus | 'all';
type ColumnPreset = 'basic' | 'all' | 'finance';

const statusOptions: SelectOption<StatusValue>[] = [
  { value: 'all', label: 'כל הסטטוסים' },
  ...(Object.values(TripStatus).filter((v) => typeof v === 'number') as TripStatus[]).map((s) => ({
    value: s,
    label: tripStatusMeta[s].label,
  })),
];

const attributeChips: { key: keyof TripFiltersState['attributes']; label: string }[] = [
  { key: 'urgent', label: 'דחוף' },
  { key: 'lift', label: 'מעלון' },
  { key: 'stop', label: 'עצירת ביניים' },
  { key: 'road6', label: 'כביש 6' },
  { key: 'roundTrip', label: 'הלוך־חזור' },
];

export interface TripFiltersProps {
  filters: TripFiltersState;
  onChange: (next: TripFiltersState) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  onReset: () => void;
  activeCount: number;
  groupByDays: boolean;
  onGroupByDaysChange: (value: boolean) => void;
  columnPreset: ColumnPreset;
  onColumnPresetChange: (preset: ColumnPreset) => void;
  onOpenColumnSettings: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function TripFilters({
  filters,
  onChange,
  expanded,
  onToggleExpanded,
  onReset,
  activeCount,
  groupByDays,
  onGroupByDaysChange,
  columnPreset,
  onColumnPresetChange,
  onOpenColumnSettings,
  onRefresh,
  loading,
}: TripFiltersProps) {
  const patch = (partial: Partial<TripFiltersState>) => onChange({ ...filters, ...partial });
  const toggleAttr = (key: keyof TripFiltersState['attributes']) =>
    patch({ attributes: { ...filters.attributes, [key]: !filters.attributes[key] } });
  const swap = () => patch({ origin: filters.destination, destination: filters.origin });

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <button type="button" onClick={onToggleExpanded} className="flex items-center gap-2 text-md font-semibold text-slate-800">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          מסננים
          {activeCount > 0 && (
            <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-2xs font-semibold text-primary-700">{activeCount}</span>
          )}
          <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', expanded && 'rotate-180')} />
        </button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs" icon={<RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />} onClick={onRefresh}>
            רענון
          </Button>
          {activeCount > 0 && (
            <Button variant="ghost" size="xs" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={onReset}>
              איפוס מסננים
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 p-4">
        {/* Primary row */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_2fr]">
          <Field label="תאריך">
            <DateRangePicker value={filters.dateRange} onChange={(dateRange) => patch({ dateRange })} />
          </Field>
          <Field label="סטטוס">
            <Select<StatusValue> value={filters.status} options={statusOptions} onChange={(status) => patch({ status })} />
          </Field>
          <Field label="חיפוש חופשי">
            <SearchInput
              value={filters.search}
              onChange={(search) => patch({ search })}
              placeholder="חיפוש לפי שם נוסע, מספר הפנייה, יעד או מס׳ סידורי…"
            />
          </Field>
        </div>

        {expanded && (
          <div className="space-y-4 animate-slide-down">
            {/* Trip attributes */}
            <section>
              <p className="mb-2 text-xs font-semibold text-slate-600">מאפייני נסיעה</p>
              <div className="flex flex-wrap gap-2">
                {attributeChips.map((chip) => {
                  const active = filters.attributes[chip.key];
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => toggleAttr(chip.key)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                        active
                          ? 'border-primary-300 bg-primary-50 text-primary-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                      )}
                    >
                      <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-primary-500' : 'bg-slate-300')} />
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Transport details */}
            <section>
              <p className="mb-2 text-xs font-semibold text-slate-600">פרטי הסעה</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="flex items-end gap-1.5">
                  <Field label="מוצא" className="flex-1">
                    <Input value={filters.origin} onChange={(e) => patch({ origin: e.target.value })} placeholder="נקודת מוצא" />
                  </Field>
                  <button
                    type="button"
                    onClick={swap}
                    aria-label="החלף מוצא ויעד"
                    className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                  <Field label="יעד" className="flex-1">
                    <Input value={filters.destination} onChange={(e) => patch({ destination: e.target.value })} placeholder="נקודת יעד" />
                  </Field>
                </div>
                <Field label="מספר הפנייה">
                  <Input value={filters.referralNumber} onChange={(e) => patch({ referralNumber: e.target.value })} placeholder="לדוגמה 2600002153590" dir="ltr" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="נהג">
                    <Input value={filters.driver} onChange={(e) => patch({ driver: e.target.value })} placeholder="שם נהג" />
                  </Field>
                  <Field label="שם נוסע">
                    <Input value={filters.passenger} onChange={(e) => patch({ passenger: e.target.value })} placeholder="שם נוסע" />
                  </Field>
                </div>
              </div>
            </section>

            {/* Display + columns */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <p className="mb-2.5 text-xs font-semibold text-slate-600">הגדרות תצוגה</p>
                <div className="flex flex-col gap-2.5">
                  <Toggle checked={groupByDays} onChange={onGroupByDaysChange} label="קבץ נסיעות לפי ימים" />
                </div>
              </section>
              <section className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <p className="mb-2.5 text-xs font-semibold text-slate-600">תצוגת עמודות</p>
                <div className="flex items-center justify-between gap-2">
                  <SegmentedControl<ColumnPreset>
                    options={[
                      { value: 'basic', label: 'בסיסי' },
                      { value: 'all', label: 'הכל' },
                      { value: 'finance', label: 'כספים' },
                    ]}
                    value={columnPreset}
                    onChange={onColumnPresetChange}
                  />
                  <Button variant="outline" size="sm" icon={<Settings2 className="h-3.5 w-3.5" />} onClick={onOpenColumnSettings}>
                    הגדרות עמודות
                  </Button>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
