import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Mail, Send } from 'lucide-react';
import { Button, Field, Input } from '@/components/ui';
import { mockMutate } from '@/lib/mockApi';
import { validateEmail } from './validation';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    setLoading(true);
    await mockMutate({ email }, 900);
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">הקישור נשלח</h1>
        <p className="mt-2 text-sm text-slate-500">
          שלחנו קישור לאיפוס הסיסמה לכתובת <span className="font-medium text-slate-700">{email}</span>. בדוק את תיבת הדואר שלך.
        </p>
        <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
          <ArrowRight className="h-4 w-4" />
          חזרה להתחברות
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">איפוס סיסמה</h1>
        <p className="mt-1 text-sm text-slate-500">הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="כתובת אימייל" htmlFor="email" error={error} required>
          <Input
            id="email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            invalid={!!error}
            startIcon={<Mail className="h-4 w-4" />}
            placeholder="name@company.co.il"
            sizeVariant="md"
          />
        </Field>
        <Button type="submit" size="md" fullWidth loading={loading} icon={<Send className="h-4 w-4" />}>
          שליחת קישור איפוס
        </Button>
      </form>

      <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
        <ArrowRight className="h-4 w-4" />
        חזרה להתחברות
      </Link>
    </div>
  );
}
