import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import {
  Button,
  Checkbox,
  Drawer,
  Field,
  Input,
  SegmentedControl,
  Select,
  type SelectOption,
  Textarea,
  Toggle,
} from '@/components/ui';
import { drivers } from '@/mock/mockData';
import { mockMutate } from '@/lib/mockApi';

interface FormState {
  passengerName: string;
  passengerPhone: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  tripType: 'oneway' | 'round';
  urgent: boolean;
  lift: boolean;
  stop: boolean;
  road6: boolean;
  driverId: string;
  tariff: string;
  notes: string;
}

const empty: FormState = {
  passengerName: '',
  passengerPhone: '',
  date: '2026-07-02',
  time: '08:00',
  origin: '',
  destination: '',
  tripType: 'oneway',
  urgent: false,
  lift: false,
  stop: false,
  road6: false,
  driverId: '',
  tariff: '120',
  notes: '',
};

const driverOptions: SelectOption<string>[] = [
  { value: '', label: 'ללא שיבוץ' },
  ...drivers.map((d) => ({ value: d.id, label: d.fullName })),
];

type Errors = Partial<Record<keyof FormState, string>>;

export function NewTripDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(empty);
      setErrors({});
    }
  }, [open]);

  const patch = (partial: Partial<FormState>) => setForm((f) => ({ ...f, ...partial }));

  const submit = async () => {
    const next: Errors = {};
    if (!form.passengerName.trim()) next.passengerName = 'יש להזין שם נוסע';
    if (!/^\d{9,10}$/.test(form.passengerPhone.replace(/\D/g, ''))) next.passengerPhone = 'מספר טלפון אינו תקין';
    if (!form.date) next.date = 'יש לבחור תאריך';
    if (!form.time) next.time = 'יש לבחור שעה';
    if (!form.origin.trim()) next.origin = 'יש להזין מוצא';
    if (!form.destination.trim()) next.destination = 'יש להזין יעד';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    await mockMutate(form, 900);
    setLoading(false);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      width="w-[26rem]"
      title="נסיעה חדשה"
      subtitle="יצירת נסיעת סידור חדשה"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            ביטול
          </Button>
          <Button icon={<Save className="h-4 w-4" />} loading={loading} onClick={submit}>
            שמירת נסיעה
          </Button>
        </div>
      }
    >
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="שם נוסע" error={errors.passengerName} required>
            <Input value={form.passengerName} onChange={(e) => patch({ passengerName: e.target.value })} invalid={!!errors.passengerName} placeholder="שם מלא" />
          </Field>
          <Field label="טלפון" error={errors.passengerPhone} required>
            <Input value={form.passengerPhone} onChange={(e) => patch({ passengerPhone: e.target.value })} invalid={!!errors.passengerPhone} placeholder="050-0000000" dir="ltr" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="תאריך" error={errors.date} required>
            <Input type="date" value={form.date} onChange={(e) => patch({ date: e.target.value })} invalid={!!errors.date} dir="ltr" />
          </Field>
          <Field label="שעה" error={errors.time} required>
            <Input type="time" value={form.time} onChange={(e) => patch({ time: e.target.value })} invalid={!!errors.time} dir="ltr" />
          </Field>
        </div>

        <Field label="מוצא" error={errors.origin} required>
          <Input value={form.origin} onChange={(e) => patch({ origin: e.target.value })} invalid={!!errors.origin} placeholder="כתובת / מוסד מוצא" />
        </Field>
        <Field label="יעד" error={errors.destination} required>
          <Input value={form.destination} onChange={(e) => patch({ destination: e.target.value })} invalid={!!errors.destination} placeholder="כתובת / מוסד יעד" />
        </Field>

        <Field label="סוג נסיעה">
          <SegmentedControl<'oneway' | 'round'>
            className="w-full"
            options={[
              { value: 'oneway', label: 'הלוך' },
              { value: 'round', label: 'הלוך־חזור' },
            ]}
            value={form.tripType}
            onChange={(tripType) => patch({ tripType })}
          />
        </Field>

        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
          <p className="mb-2.5 text-xs font-semibold text-slate-600">מאפיינים</p>
          <div className="space-y-2.5">
            <Toggle checked={form.urgent} onChange={(urgent) => patch({ urgent })} label="נסיעה דחופה" />
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Checkbox checked={form.lift} onChange={(e) => patch({ lift: e.target.checked })} label="מעלון" />
              <Checkbox checked={form.stop} onChange={(e) => patch({ stop: e.target.checked })} label="עצירת ביניים" />
              <Checkbox checked={form.road6} onChange={(e) => patch({ road6: e.target.checked })} label="כביש 6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="שיבוץ נהג">
            <Select<string> value={form.driverId} options={driverOptions} onChange={(driverId) => patch({ driverId })} />
          </Field>
          <Field label="תעריף (₪)">
            <Input type="number" value={form.tariff} onChange={(e) => patch({ tariff: e.target.value })} dir="ltr" />
          </Field>
        </div>

        <Field label="הערות">
          <Textarea value={form.notes} onChange={(e) => patch({ notes: e.target.value })} placeholder="הערות לנהג / מוקד…" />
        </Field>
      </div>
    </Drawer>
  );
}
