import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button, Drawer, Field, Input, Select, type SelectOption } from '@/components/ui';
import { UserRole, UserStatus } from '@/types/enums';
import { userRoleMeta, userStatusMeta } from '@/lib/statusMaps';
import { mockMutate } from '@/lib/mockApi';
import type { User } from '@/types';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

const roleOptions: SelectOption<UserRole>[] = (Object.values(UserRole).filter((v) => typeof v === 'number') as UserRole[]).map(
  (r) => ({ value: r, label: userRoleMeta[r].label }),
);
const statusOptions: SelectOption<UserStatus>[] = (Object.values(UserStatus).filter((v) => typeof v === 'number') as UserStatus[]).map(
  (s) => ({ value: s, label: userStatusMeta[s].label }),
);

type Errors = Partial<Record<keyof FormState, string>>;

export function UserEditorDrawer({ open, onClose, user }: { open: boolean; onClose: () => void; user: User | null }) {
  const [form, setForm] = useState<FormState>({ fullName: '', email: '', phone: '', role: UserRole.Dispatcher, status: UserStatus.Active });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      user
        ? { fullName: user.fullName, email: user.email, phone: user.phone, role: user.role, status: user.status }
        : { fullName: '', email: '', phone: '', role: UserRole.Dispatcher, status: UserStatus.Active },
    );
  }, [open, user]);

  const patch = (partial: Partial<FormState>) => setForm((f) => ({ ...f, ...partial }));

  const submit = async () => {
    const next: Errors = {};
    if (!form.fullName.trim()) next.fullName = 'יש להזין שם מלא';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'כתובת אימייל אינה תקינה';
    if (!/^\d{9,10}$/.test(form.phone.replace(/\D/g, ''))) next.phone = 'מספר טלפון אינו תקין';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    await mockMutate(form, 800);
    setLoading(false);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      title={user ? 'עריכת משתמש' : 'משתמש חדש'}
      subtitle={user ? user.email : 'הזמנת משתמש חדש למערכת'}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            ביטול
          </Button>
          <Button icon={<Save className="h-4 w-4" />} loading={loading} onClick={submit}>
            {user ? 'שמירת שינויים' : 'יצירת משתמש'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 p-4">
        <Field label="שם מלא" error={errors.fullName} required>
          <Input value={form.fullName} onChange={(e) => patch({ fullName: e.target.value })} invalid={!!errors.fullName} placeholder="שם מלא" />
        </Field>
        <Field label="אימייל" error={errors.email} required>
          <Input value={form.email} onChange={(e) => patch({ email: e.target.value })} invalid={!!errors.email} placeholder="name@shikum360.co.il" dir="ltr" />
        </Field>
        <Field label="טלפון" error={errors.phone} required>
          <Input value={form.phone} onChange={(e) => patch({ phone: e.target.value })} invalid={!!errors.phone} placeholder="050-0000000" dir="ltr" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="תפקיד">
            <Select<UserRole> value={form.role} options={roleOptions} onChange={(role) => patch({ role })} />
          </Field>
          <Field label="סטטוס">
            <Select<UserStatus> value={form.status} options={statusOptions} onChange={(status) => patch({ status })} />
          </Field>
        </div>
      </div>
    </Drawer>
  );
}
