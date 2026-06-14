import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { Button, Checkbox, Field, Input } from '@/components/ui';
import { useAuth } from '@/store';
import { validateEmail, validatePassword } from './validation';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('maya@shikum360.co.il');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const nextErrors = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setLoading(true);
    try {
      // Demo: any valid credentials succeed; use password "fail" to preview the error state.
      if (password === 'fail') throw new Error('שם משתמש או סיסמה שגויים');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'אירעה שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">התחברות למערכת</h1>
        <p className="mt-1 text-sm text-slate-500">הזן את פרטי ההתחברות שלך כדי להמשיך</p>
      </div>

      {formError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {formError}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="כתובת אימייל" htmlFor="email" error={errors.email} required>
          <Input
            id="email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            invalid={!!errors.email}
            startIcon={<Mail className="h-4 w-4" />}
            placeholder="name@company.co.il"
            sizeVariant="md"
            autoComplete="email"
          />
        </Field>

        <Field label="סיסמה" htmlFor="password" error={errors.password} required>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            invalid={!!errors.password}
            startIcon={<Lock className="h-4 w-4" />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="pointer-events-auto text-slate-400 transition-colors hover:text-slate-600"
                aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            placeholder="••••••••"
            sizeVariant="md"
            autoComplete="current-password"
          />
        </Field>

        <div className="flex items-center justify-between">
          <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} label="זכור אותי" />
          <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            שכחת סיסמה?
          </Link>
        </div>

        <Button type="submit" size="md" fullWidth loading={loading} icon={<LogIn className="h-4 w-4" />}>
          התחברות
        </Button>
      </form>

      <p className="mt-6 text-center text-2xs text-slate-400">
        דמו — כל אימייל וסיסמה תקפים. השתמש בסיסמה "fail" כדי לראות שגיאה.
      </p>
    </div>
  );
}
