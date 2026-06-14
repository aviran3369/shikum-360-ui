import {
  Activity,
  Bell,
  CalendarDays,
  FileText,
  History,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
import type { Crumb } from '@/components/ui';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    items: [
      { label: 'ראשי', to: '/dashboard', icon: LayoutDashboard },
      { label: 'הפניות', to: '/referrals', icon: FileText },
      { label: 'סידור', to: '/scheduling', icon: CalendarDays },
      { label: 'משתמשים', to: '/users', icon: Users },
    ],
  },
  {
    label: 'דוחות וקבצים',
    items: [
      { label: 'היסטוריית דוחות', to: '/reports/history', icon: History },
      { label: 'דוחות כספיים', to: '/reports/financial', icon: Wallet },
    ],
  },
  {
    label: 'שירותים נוספים',
    items: [
      { label: 'יומן פעילות', to: '/activity', icon: Activity },
      { label: 'מרכז התראות', to: '/notifications', icon: Bell },
      { label: 'הגדרות', to: '/settings', icon: Settings },
    ],
  },
];

const HOME: Crumb = { label: 'בית', href: '/dashboard' };

/** Per-route page title + breadcrumb trail (longest-prefix match). */
export const routeMeta: Record<string, { title: string; subtitle?: string; crumbs: Crumb[] }> = {
  '/dashboard': { title: 'סקירה כללית', subtitle: 'תמונת מצב יומית של מערך ההסעות', crumbs: [{ label: 'ראשי' }] },
  '/scheduling': {
    title: 'ניהול סידור',
    subtitle: 'ניהול ומעקב אחר נסיעות הסידור של הנהגים והנוסעים',
    crumbs: [HOME, { label: 'סידור' }],
  },
  '/referrals': { title: 'ניהול הפניות', subtitle: 'הפניות נוסעים ומקורות מימון', crumbs: [HOME, { label: 'הפניות' }] },
  '/users': { title: 'ניהול משתמשים', subtitle: 'משתמשי המערכת, תפקידים והרשאות', crumbs: [HOME, { label: 'משתמשים' }] },
  '/reports/history': { title: 'היסטוריית דוחות', subtitle: 'דוחות שהופקו וייצואים', crumbs: [HOME, { label: 'דוחות' }, { label: 'היסטוריה' }] },
  '/reports/financial': { title: 'דוחות כספיים', subtitle: 'התחשבנות מול מקורות מימון', crumbs: [HOME, { label: 'דוחות' }, { label: 'כספים' }] },
  '/activity': { title: 'יומן פעילות', subtitle: 'תיעוד פעולות משתמשים במערכת', crumbs: [HOME, { label: 'יומן פעילות' }] },
  '/notifications': { title: 'מרכז התראות', subtitle: 'כל ההתראות והעדכונים', crumbs: [HOME, { label: 'התראות' }] },
  '/settings': { title: 'הגדרות', subtitle: 'פרופיל, העדפות ואבטחה', crumbs: [HOME, { label: 'הגדרות' }] },
};

export function metaForPath(pathname: string): { title: string; subtitle?: string; crumbs: Crumb[] } {
  const keys = Object.keys(routeMeta).sort((a, b) => b.length - a.length);
  const match = keys.find((k) => pathname === k || pathname.startsWith(`${k}/`));
  return match ? routeMeta[match] : { title: 'שיקום 360', crumbs: [{ label: 'בית' }] };
}
