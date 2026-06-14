import {
  NotificationKind,
  OrderSource,
  Priority,
  ReferralStatus,
  ReportStatus,
  SystemStatusLevel,
  TripStatus,
  TripType,
  UserRole,
  UserStatus,
} from '@/types/enums';

export type BadgeTone =
  | 'slate'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'cyan'
  | 'green'
  | 'amber'
  | 'red'
  | 'rose';

/** Tailwind class triplet (bg / text / ring) for each badge tone. */
export const badgeToneClasses: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  blue: 'bg-primary-50 text-primary-700 ring-primary-200',
  indigo: 'bg-brand-100 text-brand-700 ring-brand-200',
  violet: 'bg-violet-100 text-violet-700 ring-violet-200',
  cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
};

/** Solid dot color per tone (used by status dots / indicators). */
export const toneDotClasses: Record<BadgeTone, string> = {
  slate: 'bg-slate-400',
  blue: 'bg-primary-500',
  indigo: 'bg-brand-500',
  violet: 'bg-violet-500',
  cyan: 'bg-cyan-500',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  rose: 'bg-rose-500',
};

interface Meta {
  label: string;
  tone: BadgeTone;
}

export const tripStatusMeta: Record<TripStatus, Meta> = {
  [TripStatus.Draft]: { label: 'טיוטה', tone: 'slate' },
  [TripStatus.Pending]: { label: 'ממתין לשיבוץ', tone: 'amber' },
  [TripStatus.Scheduled]: { label: 'מתוזמן', tone: 'blue' },
  [TripStatus.Assigned]: { label: 'שובץ נהג', tone: 'indigo' },
  [TripStatus.InProgress]: { label: 'בנסיעה', tone: 'cyan' },
  [TripStatus.Completed]: { label: 'הושלמה', tone: 'green' },
  [TripStatus.Cancelled]: { label: 'בוטלה', tone: 'red' },
  [TripStatus.NoShow]: { label: 'לא הופיע', tone: 'rose' },
};

export const orderSourceMeta: Record<OrderSource, Meta> = {
  [OrderSource.Passenger]: { label: 'הוזמן ע״י נוסע', tone: 'violet' },
  [OrderSource.Manager]: { label: 'הוזמן ע״י מנהל', tone: 'blue' },
  [OrderSource.System]: { label: 'הוזמן ע״י מערכת', tone: 'slate' },
};

export const tripTypeMeta: Record<TripType, Meta> = {
  [TripType.OneWay]: { label: 'הלוך', tone: 'slate' },
  [TripType.RoundTrip]: { label: 'הלוך־חזור', tone: 'indigo' },
};

export const priorityMeta: Record<Priority, Meta> = {
  [Priority.Normal]: { label: 'רגיל', tone: 'slate' },
  [Priority.Urgent]: { label: 'דחוף', tone: 'red' },
};

export const referralStatusMeta: Record<ReferralStatus, Meta> = {
  [ReferralStatus.New]: { label: 'חדשה', tone: 'blue' },
  [ReferralStatus.InReview]: { label: 'בבדיקה', tone: 'amber' },
  [ReferralStatus.Approved]: { label: 'אושרה', tone: 'green' },
  [ReferralStatus.Rejected]: { label: 'נדחתה', tone: 'red' },
  [ReferralStatus.Closed]: { label: 'נסגרה', tone: 'slate' },
};

export const userRoleMeta: Record<UserRole, Meta> = {
  [UserRole.Admin]: { label: 'מנהל', tone: 'indigo' },
  [UserRole.Dispatcher]: { label: 'סדרן', tone: 'blue' },
  [UserRole.Driver]: { label: 'נהג', tone: 'cyan' },
  [UserRole.Viewer]: { label: 'צופה', tone: 'slate' },
};

export const userStatusMeta: Record<UserStatus, Meta> = {
  [UserStatus.Active]: { label: 'פעיל', tone: 'green' },
  [UserStatus.Invited]: { label: 'הוזמן', tone: 'amber' },
  [UserStatus.Suspended]: { label: 'מושעה', tone: 'red' },
};

export const reportStatusMeta: Record<ReportStatus, Meta> = {
  [ReportStatus.Queued]: { label: 'בתור', tone: 'slate' },
  [ReportStatus.Processing]: { label: 'בעיבוד', tone: 'amber' },
  [ReportStatus.Ready]: { label: 'מוכן', tone: 'green' },
  [ReportStatus.Failed]: { label: 'נכשל', tone: 'red' },
};

export const notificationKindMeta: Record<NotificationKind, Meta> = {
  [NotificationKind.Info]: { label: 'מידע', tone: 'blue' },
  [NotificationKind.Success]: { label: 'הצלחה', tone: 'green' },
  [NotificationKind.Warning]: { label: 'אזהרה', tone: 'amber' },
  [NotificationKind.Error]: { label: 'שגיאה', tone: 'red' },
};

export const systemStatusMeta: Record<SystemStatusLevel, Meta> = {
  [SystemStatusLevel.Operational]: { label: 'כל המערכות תקינות', tone: 'green' },
  [SystemStatusLevel.Degraded]: { label: 'ביצועים מופחתים', tone: 'amber' },
  [SystemStatusLevel.Down]: { label: 'תקלה מערכתית', tone: 'red' },
};

export const financialStatusMeta: Record<'Paid' | 'Pending' | 'Overdue', Meta> = {
  Paid: { label: 'שולם', tone: 'green' },
  Pending: { label: 'ממתין', tone: 'amber' },
  Overdue: { label: 'באיחור', tone: 'red' },
};
