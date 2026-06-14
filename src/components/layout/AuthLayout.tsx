import { Outlet } from 'react-router-dom';
import { Bus, CalendarCheck2, ShieldCheck, Sparkles } from 'lucide-react';

const highlights = [
  { icon: CalendarCheck2, title: 'סידור נסיעות חכם', body: 'ניהול ושיבוץ נסיעות ונהגים במקום אחד.' },
  { icon: ShieldCheck, title: 'אבטחה ברמת ארגון', body: 'הרשאות, תיעוד פעולות ובקרת גישה מלאה.' },
  { icon: Sparkles, title: 'דוחות בזמן אמת', body: 'תובנות והתחשבנות מול מקורות מימון.' },
];

export function AuthLayout() {
  return (
    <div className="flex h-screen bg-surface-page">
      {/* Form side (inline-start / right in RTL) */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900">
              <Bus className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-lg font-bold text-slate-800">שיקום 360</p>
              <p className="text-xs text-slate-400">ניהול הסעות וסידור</p>
            </div>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Brand side (inline-end / left in RTL) */}
      <div className="chrome-gradient top-bg-banner relative hidden w-[44%] flex-col justify-between overflow-hidden p-10 text-white lg:flex">
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 shadow-soft">
            <Bus className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-xl font-bold">שיקום 360</p>
            <p className="text-sm text-brand-200">פלטפורמת ניהול הסעות וסידור</p>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          <h2 className="text-3xl font-bold leading-snug">
            המרכז התפעולי
            <br />
            למערך ההסעות שלך
          </h2>
          <ul className="space-y-3">
            {highlights.map((h) => (
              <li key={h.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <h.icon className="h-4.5 w-4.5 text-white" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{h.title}</p>
                  <p className="text-xs text-brand-200">{h.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-2xs text-brand-300">© 2026 שיקום 360 · כל הזכויות שמורות</p>
      </div>
    </div>
  );
}
