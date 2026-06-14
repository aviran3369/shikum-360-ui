import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button, Drawer, Field, Input, Select, type SelectOption, Textarea } from '@/components/ui';
import { mockMutate } from '@/lib/mockApi';

interface FormState {
  referralNumber: string;
  passengerName: string;
  passengerPhone: string;
  fundingSource: string;
  validUntil: string;
  notes: string;
}

const empty: FormState = {
  referralNumber: '',
  passengerName: '',
  passengerPhone: '',
  fundingSource: 'משרד הבריאות',
  validUntil: '2026-12-31',
  notes: '',
};

const fundingOptions: SelectOption<string>[] = ['משרד הבריאות', 'ביטוח לאומי', 'כללית', 'מכבי', 'מאוחדת', 'לאומית'].map((v) => ({
  value: v,
  label: v,
}));

type Errors = Partial<Record<keyof FormState, string>>;

export function ReferralIntakeDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    if (!/^\d{10,13}$/.test(form.referralNumber.replace(/\D/g, ''))) next.referralNumber = 'מספר הפנייה אינו תקין';
    if (!form.passengerName.trim()) next.passengerName = 'יש להזין שם נוסע';
    if (!/^\d{9,10}$/.test(form.passengerPhone.replace(/\D/g, ''))) next.passengerPhone = 'מספר טלפון אינו תקין';
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
      title="הפנייה חדשה"
      subtitle="קליטת הפניית נוסע חדשה"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            ביטול
          </Button>
          <Button icon={<Save className="h-4 w-4" />} loading={loading} onClick={submit}>
            שמירת הפנייה
          </Button>
        </div>
      }
    >
      <div className="space-y-4 p-4">
        <Field label="מספר הפנייה" error={errors.referralNumber} required>
          <Input value={form.referralNumber} onChange={(e) => patch({ referralNumber: e.target.value })} invalid={!!errors.referralNumber} placeholder="2600002153xxx" dir="ltr" />
        </Field>
        <Field label="שם נוסע" error={errors.passengerName} required>
          <Input value={form.passengerName} onChange={(e) => patch({ passengerName: e.target.value })} invalid={!!errors.passengerName} placeholder="שם מלא" />
        </Field>
        <Field label="טלפון נוסע" error={errors.passengerPhone} required>
          <Input value={form.passengerPhone} onChange={(e) => patch({ passengerPhone: e.target.value })} invalid={!!errors.passengerPhone} placeholder="050-0000000" dir="ltr" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="מקור מימון">
            <Select<string> value={form.fundingSource} options={fundingOptions} onChange={(fundingSource) => patch({ fundingSource })} />
          </Field>
          <Field label="תוקף עד">
            <Input type="date" value={form.validUntil} onChange={(e) => patch({ validUntil: e.target.value })} dir="ltr" />
          </Field>
        </div>
        <Field label="הערות">
          <Textarea value={form.notes} onChange={(e) => patch({ notes: e.target.value })} placeholder="פרטים נוספים על ההפנייה…" />
        </Field>
      </div>
    </Drawer>
  );
}
