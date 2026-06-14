import { type ReactNode, useState } from 'react';
import { Bell, Check, Globe, LayoutGrid, Lock, Shield, SlidersHorizontal, User as UserIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  SegmentedControl,
  Tabs,
  Toggle,
} from '@/components/ui';
import { useAuth } from '@/store';
import { userRoleMeta } from '@/lib/statusMaps';
import { mockMutate } from '@/lib/mockApi';
import { formatPhone } from '@/lib/format';

const tabs = [
  { id: 'profile', label: 'פרופיל', icon: <UserIcon className="h-4 w-4" /> },
  { id: 'preferences', label: 'העדפות', icon: <SlidersHorizontal className="h-4 w-4" /> },
  { id: 'notifications', label: 'התראות', icon: <Bell className="h-4 w-4" /> },
  { id: 'security', label: 'אבטחה', icon: <Shield className="h-4 w-4" /> },
];

export function SettingsPage() {
  const [tab, setTab] = useState('profile');

  return (
    <div>
      <PageHeader title="הגדרות" subtitle="פרופיל, העדפות ואבטחה" />
      <div className="mx-auto max-w-3xl space-y-4 p-5">
        <Tabs items={tabs} value={tab} onChange={setTab} />
        {tab === 'profile' && <ProfileTab />}
        {tab === 'preferences' && <PreferencesTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}

function SaveButton({ onSave }: { onSave: () => Promise<unknown> }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <Button
      icon={saved ? <Check className="h-4 w-4" /> : undefined}
      loading={loading}
      onClick={async () => {
        setLoading(true);
        await onSave();
        setLoading(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
      }}
    >
      {saved ? 'נשמר' : 'שמירת שינויים'}
    </Button>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(formatPhone(user.phone));

  return (
    <Card>
      <CardHeader title="פרטי פרופיל" subtitle="עדכון הפרטים האישיים שלך" />
      <CardBody className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.fullName} color={user.avatarColor} size="lg" />
          <div>
            <p className="text-md font-semibold text-slate-800">{user.fullName}</p>
            <Badge tone={userRoleMeta[user.role].tone}>{userRoleMeta[user.role].label}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="שם מלא">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} sizeVariant="md" />
          </Field>
          <Field label="אימייל">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" sizeVariant="md" />
          </Field>
          <Field label="טלפון">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" sizeVariant="md" />
          </Field>
          <Field label="תפקיד">
            <Input value={userRoleMeta[user.role].label} disabled sizeVariant="md" />
          </Field>
        </div>
        <div className="flex justify-end">
          <SaveButton onSave={() => mockMutate({ fullName, email, phone })} />
        </div>
      </CardBody>
    </Card>
  );
}

function PreferencesTab() {
  const [density, setDensity] = useState<'comfortable' | 'compact'>('compact');
  const [theme, setTheme] = useState<'indigo' | 'navy'>('indigo');
  const [landing, setLanding] = useState<'dashboard' | 'scheduling'>('dashboard');

  return (
    <Card>
      <CardHeader title="העדפות תצוגה" subtitle="התאמה אישית של חוויית המערכת" />
      <CardBody className="space-y-4">
        <Row icon={<LayoutGrid className="h-4 w-4" />} title="צפיפות תצוגה" desc="מרווחים בטבלאות ובטפסים">
          <SegmentedControl
            options={[
              { value: 'comfortable', label: 'מרווח' },
              { value: 'compact', label: 'צפוף' },
            ]}
            value={density}
            onChange={setDensity}
          />
        </Row>
        <Row icon={<SlidersHorizontal className="h-4 w-4" />} title="ערכת צבעים" desc="גוון המותג של המערכת">
          <SegmentedControl
            options={[
              { value: 'indigo', label: 'אינדיגו' },
              { value: 'navy', label: 'נייבי' },
            ]}
            value={theme}
            onChange={setTheme}
          />
        </Row>
        <Row icon={<Globe className="h-4 w-4" />} title="עמוד פתיחה" desc="העמוד שייטען בכניסה למערכת">
          <SegmentedControl
            options={[
              { value: 'dashboard', label: 'ראשי' },
              { value: 'scheduling', label: 'סידור' },
            ]}
            value={landing}
            onChange={setLanding}
          />
        </Row>
        <div className="flex justify-end">
          <SaveButton onSave={() => mockMutate({ density, theme, landing })} />
        </div>
      </CardBody>
    </Card>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    tripAssigned: true,
    tripCancelled: true,
    newReferral: true,
    reportReady: true,
    weeklyDigest: false,
    sms: false,
  });
  const set = (key: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [key]: v }));
  const items: { key: keyof typeof prefs; title: string; desc: string }[] = [
    { key: 'tripAssigned', title: 'שיבוץ נהג לנסיעה', desc: 'התראה כאשר נהג משובץ לנסיעה' },
    { key: 'tripCancelled', title: 'ביטול נסיעה', desc: 'התראה על ביטול נסיעה ע״י נוסע או מנהל' },
    { key: 'newReferral', title: 'הפנייה חדשה', desc: 'התראה על קליטת הפנייה חדשה' },
    { key: 'reportReady', title: 'דוח מוכן', desc: 'התראה כאשר דוח מוכן להורדה' },
    { key: 'weeklyDigest', title: 'סיכום שבועי', desc: 'תקציר פעילות שבועי במייל' },
    { key: 'sms', title: 'התראות SMS', desc: 'קבלת התראות דחופות גם ב-SMS' },
  ];

  return (
    <Card>
      <CardHeader title="העדפות התראות" subtitle="בחר אילו התראות תרצה לקבל" />
      <CardBody className="space-y-1">
        {items.map((item) => (
          <Row key={item.key} title={item.title} desc={item.desc}>
            <Toggle checked={prefs[item.key]} onChange={set(item.key)} />
          </Row>
        ))}
        <div className="flex justify-end pt-2">
          <SaveButton onSave={() => mockMutate(prefs)} />
        </div>
      </CardBody>
    </Card>
  );
}

function SecurityTab() {
  const [mfa, setMfa] = useState(true);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="שינוי סיסמה" icon={<Lock className="h-4 w-4" />} />
        <CardBody className="space-y-4">
          <Field label="סיסמה נוכחית">
            <Input type="password" placeholder="••••••••" sizeVariant="md" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="סיסמה חדשה">
              <Input type="password" placeholder="••••••••" sizeVariant="md" />
            </Field>
            <Field label="אימות סיסמה">
              <Input type="password" placeholder="••••••••" sizeVariant="md" />
            </Field>
          </div>
          <div className="flex justify-end">
            <SaveButton onSave={() => mockMutate({})} />
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="אימות דו-שלבי" subtitle="שכבת הגנה נוספת לחשבון" />
        <CardBody>
          <Row icon={<Shield className="h-4 w-4" />} title="אימות דו-שלבי (2FA)" desc={mfa ? 'מופעל — נדרש קוד בכל התחברות' : 'כבוי'}>
            <Toggle checked={mfa} onChange={setMfa} />
          </Row>
        </CardBody>
      </Card>
    </div>
  );
}

function Row({ icon, title, desc, children }: { icon?: ReactNode; title: string; desc: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-50 py-2.5 last:border-0">
      <div className="flex items-start gap-2.5">
        {icon && <span className="mt-0.5 text-slate-400">{icon}</span>}
        <div>
          <p className="text-sm font-medium text-slate-700">{title}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
