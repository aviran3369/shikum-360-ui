import { Accessibility, CircleDot, Repeat, Route, Zap } from 'lucide-react';
import type { Column } from '@/components/table';
import { Badge, Tooltip } from '@/components/ui';
import type { Trip } from '@/types';
import { OrderSource, Priority, TripStatus, TripType } from '@/types/enums';
import { orderSourceMeta, tripStatusMeta, tripTypeMeta } from '@/lib/statusMaps';
import { formatCurrency } from '@/lib/format';

function AttributeIcons({ trip }: { trip: Trip }) {
  const items: { show: boolean; label: string; node: React.ReactNode }[] = [
    { show: trip.priority === Priority.Urgent, label: 'דחוף', node: <Zap className="h-3.5 w-3.5 text-red-500" /> },
    { show: trip.isLift, label: 'מעלון', node: <Accessibility className="h-3.5 w-3.5 text-primary-600" /> },
    { show: trip.hasStop, label: 'עצירת ביניים', node: <CircleDot className="h-3.5 w-3.5 text-amber-500" /> },
    { show: trip.usesRoad6, label: 'כביש 6', node: <Route className="h-3.5 w-3.5 text-emerald-600" /> },
    { show: trip.tripType === TripType.RoundTrip, label: 'הלוך־חזור', node: <Repeat className="h-3.5 w-3.5 text-violet-600" /> },
  ].filter((i) => i.show);

  if (items.length === 0) return <span className="text-slate-300">—</span>;
  return (
    <div className="flex items-center gap-1">
      {items.map((i, idx) => (
        <Tooltip key={idx} label={i.label}>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-50 ring-1 ring-inset ring-slate-200">{i.node}</span>
        </Tooltip>
      ))}
    </div>
  );
}

/** Full column set for the scheduling table. `preset` drives the column-settings presets. */
export const tripColumns: Column<Trip>[] = [
  {
    id: 'serialNumber',
    header: 'מס׳ סידורי רץ',
    cell: (t) => <span className="font-semibold tabular-nums text-slate-700">{t.serialNumber}</span>,
    sortable: true,
    filterable: true,
    preset: 'basic',
    recommended: true,
    width: 'w-28',
  },
  {
    id: 'referralNumber',
    header: 'מספר הפנייה',
    cell: (t) => <span className="cursor-pointer font-medium tabular-nums text-primary-600 hover:underline">{t.referralNumber}</span>,
    sortable: true,
    filterable: true,
    preset: 'basic',
    recommended: true,
  },
  {
    id: 'date',
    header: 'תאריך',
    cell: (t) => <span className="tabular-nums">{new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(t.date))}</span>,
    sortable: true,
    filterable: true,
    preset: 'basic',
    recommended: true,
  },
  {
    id: 'time',
    header: 'שעה',
    cell: (t) => <span className="tabular-nums">{t.time}</span>,
    sortable: true,
    filterable: true,
    preset: 'basic',
    width: 'w-20',
  },
  { id: 'origin', header: 'מוצא', cell: (t) => t.origin.name, sortable: true, filterable: true, preset: 'basic' },
  { id: 'destination', header: 'יעד', cell: (t) => t.destination.name, sortable: true, filterable: true, preset: 'basic', recommended: true },
  {
    id: 'passenger',
    header: 'נוסע',
    cell: (t) => <span className="font-medium text-slate-700">{t.passenger.fullName}</span>,
    sortable: true,
    filterable: true,
    preset: 'basic',
    recommended: true,
  },
  {
    id: 'driver',
    header: 'נהג',
    cell: (t) => (t.driver ? t.driver.fullName : <span className="text-slate-300">לא שובץ</span>),
    sortable: true,
    filterable: true,
    preset: 'extra',
  },
  {
    id: 'status',
    header: 'סטטוס',
    cell: (t) => <Badge tone={tripStatusMeta[t.status].tone} dot>{tripStatusMeta[t.status].label}</Badge>,
    sortable: true,
    filterable: true,
    preset: 'extra',
    recommended: true,
    formatFilterOption: (v) => tripStatusMeta[Number(v) as TripStatus]?.label ?? v,
  },
  {
    id: 'orderSource',
    header: 'מקור הזמנה',
    cell: (t) => <Badge tone={orderSourceMeta[t.orderSource].tone}>{orderSourceMeta[t.orderSource].label}</Badge>,
    filterable: true,
    preset: 'extra',
    formatFilterOption: (v) => orderSourceMeta[Number(v) as OrderSource]?.label ?? v,
  },
  { id: 'tripType', header: 'סוג נסיעה', cell: (t) => tripTypeMeta[t.tripType].label, preset: 'extra' },
  { id: 'attributes', header: 'מאפיינים', cell: (t) => <AttributeIcons trip={t} />, preset: 'extra' },
  {
    id: 'tariff',
    header: 'תעריף',
    cell: (t) => <span className="font-medium tabular-nums text-slate-700">{formatCurrency(t.tariff)}</span>,
    sortable: true,
    align: 'end',
    preset: 'finance',
    width: 'w-24',
  },
];

export const BASIC_COLUMN_IDS = tripColumns.filter((c) => c.preset === 'basic').map((c) => c.id);
export const ALL_COLUMN_IDS = tripColumns.map((c) => c.id);
