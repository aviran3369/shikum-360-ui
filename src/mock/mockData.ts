import {
  NotificationKind,
  OrderSource,
  Priority,
  ReferralStatus,
  ReportStatus,
  TripStatus,
  TripType,
  UserRole,
  UserStatus,
} from '@/types/enums';
import type {
  ActivityLogEntry,
  AppNotification,
  DashboardSummary,
  Driver,
  FinancialRow,
  Location,
  Passenger,
  PassengerOrderSummary,
  Referral,
  Report,
  Trip,
  User,
  Vehicle,
} from '@/types';

/* ------------------------------------------------------------------ *
 * Deterministic id/date helpers — stable across reloads (no RNG).
 * ------------------------------------------------------------------ */
const pad = (n: number, len: number) => String(n).padStart(len, '0');
const guid = (seed: number): string =>
  `${pad(seed, 8)}-0000-4000-8000-${pad(seed, 12)}`;
const ts = (day: number, minute: number): string =>
  `2026-06-${pad((day % 28) + 1, 2)}T${pad(8 + (minute % 9), 2)}:${pad(minute % 60, 2)}:00Z`;

/* ------------------------------------------------------------------ *
 * Reference data
 * ------------------------------------------------------------------ */
export const locations: Location[] = [
  { id: guid(1001), name: 'הדסה עין כרם', address: 'קרית הדסה', city: 'ירושלים' },
  { id: guid(1002), name: 'בית חולים מאיר', address: "רח' צבי 59", city: 'כפר סבא' },
  { id: guid(1003), name: 'בית חולים רמב״ם', address: 'העלייה השנייה 8', city: 'חיפה' },
  { id: guid(1004), name: 'שערי צדק', address: 'שמואל בייט 12', city: 'ירושלים' },
  { id: guid(1005), name: 'סורוקה', address: "רח' יצחק רגר", city: 'באר שבע' },
  { id: guid(1006), name: 'אסותא אשדוד', address: 'הרפואה 7', city: 'אשדוד' },
  { id: guid(1007), name: 'איכילוב', address: "רח' ויצמן 6", city: 'תל אביב' },
  { id: guid(1008), name: 'בילינסון', address: 'זאב ז׳בוטינסקי 39', city: 'פתח תקווה' },
  { id: guid(1009), name: 'וולפסון', address: 'הלוחמים 62', city: 'חולון' },
  { id: guid(1010), name: 'מרפאת גרודי', address: 'בן גוריון 22', city: 'אשקלון' },
  { id: guid(1011), name: 'מרפאה אורתופדית', address: 'הרצל 41', city: 'רמלה' },
  { id: guid(1012), name: 'בית המטופל', address: 'ויצמן 14', city: 'ראשון לציון' },
];

const passengerNames = [
  'מאיה לוי', 'יוסי כהן', 'רחל פרץ', 'דניאל סויסה', 'הילה גרודי',
  'יואב גלעדי', 'טובה סלע', 'אורן עוזרי', 'יחיאל מזוז', 'נורית אבני',
  'שמעון דהן', 'אסתר מלכה', 'רון ברק', 'ליאת שרון', 'גדעון נחמיאס',
  'סיגל בן דוד', 'אבי רוזן', 'חנה פרידמן', 'מוטי לוגסי', 'ורד אשכנזי',
];

export const passengers: Passenger[] = passengerNames.map((fullName, i) => {
  const orderedBySelf = 1 + ((i * 3) % 9);
  const orderedByManager = 14 + ((i * 5) % 12);
  return {
    id: guid(2001 + i),
    fullName,
    phone: `05227633${pad(92 + i, 2)}`,
    city: locations[i % locations.length].city,
    orderedBySelf,
    orderedByManager,
    totalTrips: orderedBySelf + orderedByManager,
    isActive: i % 9 !== 0,
  };
});

const driverNames = [
  'יחיאל מזוז', 'סלים חורי', 'בוריס פלדמן', 'אחמד זועבי', 'דוד אוחיון',
  'מיכאל גורן', 'נסים ביטון', 'ראמי חאג׳', 'יוסף אזולאי', 'ויקטור סבן',
];

export const vehicles: Vehicle[] = [
  { id: guid(4001), plate: '12-345-67', model: 'מרצדס ספרינטר', seats: 16, hasLift: true },
  { id: guid(4002), plate: '23-456-78', model: 'פולקסווגן קרפטר', seats: 14, hasLift: true },
  { id: guid(4003), plate: '34-567-89', model: 'פורד טרנזיט', seats: 12, hasLift: false },
  { id: guid(4004), plate: '45-678-90', model: 'רנו מאסטר', seats: 9, hasLift: false },
  { id: guid(4005), plate: '56-789-01', model: 'יונדאי H1', seats: 7, hasLift: false },
  { id: guid(4006), plate: '67-890-12', model: 'טויוטה האייס', seats: 10, hasLift: true },
  { id: guid(4007), plate: '78-901-23', model: 'מרצדס ויטו', seats: 8, hasLift: false },
  { id: guid(4008), plate: '89-012-34', model: 'איווקו דיילי', seats: 19, hasLift: true },
];

export const drivers: Driver[] = driverNames.map((fullName, i) => ({
  id: guid(3001 + i),
  fullName,
  phone: `05088812${pad(10 + i, 2)}`,
  vehiclePlate: i < vehicles.length ? vehicles[i].plate : null,
  rating: Number((4.1 + ((i * 7) % 9) / 10).toFixed(1)),
  activeTrips: (i * 2) % 6,
  isAvailable: i % 4 !== 0,
}));

/* ------------------------------------------------------------------ *
 * Trips — 100 deterministic rows (Jul 2–6 2026)
 * ------------------------------------------------------------------ */
const TRIP_DATES = ['2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05', '2026-07-06'];
const TRIP_TIMES = [
  '06:45', '07:30', '08:00', '09:15', '10:00', '11:45', '13:00', '08:30', '14:20', '16:15',
  '12:30', '15:45', '06:15', '17:00', '09:45', '13:30', '07:00', '10:30', '11:00', '08:15',
];
const STATUS_CYCLE: TripStatus[] = [
  TripStatus.Scheduled, TripStatus.Assigned, TripStatus.Completed, TripStatus.Pending,
  TripStatus.InProgress, TripStatus.Completed, TripStatus.Assigned, TripStatus.Scheduled,
  TripStatus.Cancelled, TripStatus.Completed, TripStatus.Assigned, TripStatus.NoShow,
  TripStatus.Scheduled, TripStatus.Completed, TripStatus.Pending, TripStatus.Assigned,
  TripStatus.InProgress, TripStatus.Completed, TripStatus.Scheduled, TripStatus.Draft,
];
const STATUS_WITH_DRIVER = new Set<TripStatus>([
  TripStatus.Assigned, TripStatus.InProgress, TripStatus.Completed, TripStatus.NoShow,
]);

const TRIP_COUNT = 100;

function buildTrips(): Trip[] {
  return Array.from({ length: TRIP_COUNT }, (_, i): Trip => {
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
    const passenger = passengers[i % passengers.length];
    const driver = STATUS_WITH_DRIVER.has(status) ? drivers[i % drivers.length] : null;
    const vehicle = driver ? vehicles[i % vehicles.length] : null;
    const origin = locations[(i + 5) % locations.length];
    const destination = locations[i % locations.length];
    return {
      id: guid(5001 + i),
      serialNumber: 20301 + i,
      referralNumber: `2600002153${590 + i}`,
      date: TRIP_DATES[Math.floor(i / (TRIP_COUNT / TRIP_DATES.length))],
      time: TRIP_TIMES[i % TRIP_TIMES.length],
      origin,
      destination,
      passenger: { id: passenger.id, fullName: passenger.fullName, phone: passenger.phone },
      driver: driver ? { id: driver.id, fullName: driver.fullName } : null,
      vehicle: vehicle ? { id: vehicle.id, plate: vehicle.plate } : null,
      status,
      orderSource: i % 5 < 2 ? OrderSource.Passenger : OrderSource.Manager,
      tripType: i % 3 === 0 ? TripType.RoundTrip : TripType.OneWay,
      priority: i % 7 === 0 ? Priority.Urgent : Priority.Normal,
      isLift: i % 4 === 0,
      hasStop: i % 6 === 0,
      usesRoad6: i % 5 === 0,
      tariff: 80 + (i % 12) * 15,
      notes: i % 8 === 0 ? 'נדרש ליווי רפואי בנסיעה' : null,
      createdAt: ts(i, i * 7),
      updatedAt: ts(i, i * 7 + 35),
    };
  });
}

export const trips: Trip[] = buildTrips();

/* ------------------------------------------------------------------ *
 * Passenger order breakdown
 * ------------------------------------------------------------------ */
export const passengerOrderSummaries: PassengerOrderSummary[] = passengers.map((p) => ({
  id: p.id,
  fullName: p.fullName,
  phone: p.phone,
  orderedBySelf: p.orderedBySelf,
  orderedByManager: p.orderedByManager,
  total: p.totalTrips,
}));

/* ------------------------------------------------------------------ *
 * Referrals
 * ------------------------------------------------------------------ */
const fundingSources = ['משרד הבריאות', 'ביטוח לאומי', 'כללית', 'מכבי', 'מאוחדת', 'לאומית'];
const referralStatusCycle: ReferralStatus[] = [
  ReferralStatus.Approved, ReferralStatus.InReview, ReferralStatus.New,
  ReferralStatus.Approved, ReferralStatus.Closed, ReferralStatus.Rejected,
];

export const referrals: Referral[] = Array.from({ length: 20 }, (_, i): Referral => {
  const passenger = passengers[i % passengers.length];
  return {
    id: guid(6001 + i),
    referralNumber: `2600002153${590 + i}`,
    passengerName: passenger.fullName,
    passengerPhone: passenger.phone,
    fundingSource: fundingSources[i % fundingSources.length],
    status: referralStatusCycle[i % referralStatusCycle.length],
    tripsCount: 2 + ((i * 3) % 18),
    openedAt: `2026-0${(i % 5) + 1}-${pad((i % 27) + 1, 2)}`,
    validUntil: `2026-${pad((i % 6) + 7, 2)}-${pad((i % 27) + 1, 2)}`,
    assignedTo: i % 3 === 0 ? null : driverNames[i % driverNames.length],
  };
});

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */
const avatarColors = ['#6240D6', '#7C3AED', '#9333EA', '#16A34A', '#D97706', '#DB2777', '#4F46E5', '#5B21B6'];
const userSeed: Array<{ name: string; role: UserRole; status: UserStatus }> = [
  { name: 'מאיה כהן', role: UserRole.Admin, status: UserStatus.Active },
  { name: 'אורי שלום', role: UserRole.Dispatcher, status: UserStatus.Active },
  { name: 'נועה ברקת', role: UserRole.Dispatcher, status: UserStatus.Active },
  { name: 'יחיאל מזוז', role: UserRole.Driver, status: UserStatus.Active },
  { name: 'סלים חורי', role: UserRole.Driver, status: UserStatus.Active },
  { name: 'בוריס פלדמן', role: UserRole.Driver, status: UserStatus.Suspended },
  { name: 'תמר גולן', role: UserRole.Viewer, status: UserStatus.Active },
  { name: 'איל רגב', role: UserRole.Dispatcher, status: UserStatus.Invited },
  { name: 'שירה אלון', role: UserRole.Admin, status: UserStatus.Active },
  { name: 'עומר ניר', role: UserRole.Driver, status: UserStatus.Active },
  { name: 'דנה פרי', role: UserRole.Viewer, status: UserStatus.Invited },
  { name: 'גיא מורן', role: UserRole.Driver, status: UserStatus.Active },
];

export const users: User[] = userSeed.map((u, i) => ({
  id: guid(7001 + i),
  fullName: u.name,
  email: `user${i + 1}@shikum360.co.il`,
  phone: `05${pad(20000000 + i * 111111, 8)}`,
  role: u.role,
  status: u.status,
  lastActiveAt: u.status === UserStatus.Invited ? null : ts(i, i * 13),
  createdAt: `2025-${pad((i % 12) + 1, 2)}-${pad((i % 27) + 1, 2)}T09:00:00Z`,
  avatarColor: avatarColors[i % avatarColors.length],
}));

export const currentUser: User = users[0];

/* ------------------------------------------------------------------ *
 * Notifications
 * ------------------------------------------------------------------ */
const notificationSeed: Array<{ kind: NotificationKind; title: string; body: string; href: string | null }> = [
  { kind: NotificationKind.Success, title: 'נהג שובץ לנסיעה', body: 'יחיאל מזוז שובץ לנסיעה 20342 לבית חולים מאיר.', href: '/scheduling' },
  { kind: NotificationKind.Info, title: 'הפניה חדשה התקבלה', body: 'הפניה 2600002153604 בהמתנה לאישור.', href: '/referrals' },
  { kind: NotificationKind.Warning, title: 'נסיעה דחופה ללא נהג', body: 'נסיעה 20355 מסומנת כדחופה וטרם שובץ נהג.', href: '/scheduling' },
  { kind: NotificationKind.Success, title: 'דוח כספי מוכן', body: 'הדוח הכספי לחודש יוני 2026 מוכן להורדה.', href: '/reports/financial' },
  { kind: NotificationKind.Error, title: 'נסיעה בוטלה', body: 'הנוסע ביטל את נסיעה 20349.', href: '/scheduling' },
  { kind: NotificationKind.Info, title: 'משתמש חדש הוזמן', body: 'איל רגב הוזמן כסדרן למערכת.', href: '/users' },
  { kind: NotificationKind.Warning, title: 'תוקף הפניה מסתיים', body: 'הפניה 2600002153592 תפוג בעוד 3 ימים.', href: '/referrals' },
  { kind: NotificationKind.Success, title: 'נסיעה הושלמה', body: 'נסיעה 20318 הושלמה בהצלחה.', href: '/scheduling' },
  { kind: NotificationKind.Info, title: 'עדכון מדיניות אפליקציה', body: 'מדיניות הביטולים עודכנה.', href: '/settings' },
  { kind: NotificationKind.Warning, title: 'רכב בטיפול', body: 'רכב 34-567-89 נכנס לטיפול תקופתי.', href: null },
  { kind: NotificationKind.Success, title: 'סקר שביעות רצון', body: '24 נוסעים ענו על הסקר השבוע.', href: null },
  { kind: NotificationKind.Info, title: 'גיבוי הושלם', body: 'גיבוי נתונים יומי הסתיים בהצלחה.', href: null },
  { kind: NotificationKind.Error, title: 'שגיאת סנכרון', body: 'סנכרון מול ספק חיצוני נכשל ויתבצע שוב.', href: null },
  { kind: NotificationKind.Info, title: 'נסיעה עודכנה', body: 'שעת נסיעה 20327 עודכנה ל-09:30.', href: '/scheduling' },
  { kind: NotificationKind.Success, title: 'תעריף עודכן', body: 'תעריף עבור 6 נסיעות עודכן בהצלחה.', href: '/scheduling' },
];

export const notifications: AppNotification[] = notificationSeed.map((n, i) => ({
  id: guid(8001 + i),
  kind: n.kind,
  title: n.title,
  body: n.body,
  createdAt: ts(i, i * 17),
  read: i > 4,
  href: n.href,
}));

/* ------------------------------------------------------------------ *
 * Activity / audit log
 * ------------------------------------------------------------------ */
const activitySeed: Array<{ actor: number; action: string; summary: string; entityType: string; entityId: string }> = [
  { actor: 1, action: 'trip.assign', summary: 'שיבץ את יחיאל מזוז לנסיעה 20342', entityType: 'Trip', entityId: '20342' },
  { actor: 0, action: 'trip.create', summary: 'יצר נסיעה חדשה 20401 עבור מאיה לוי', entityType: 'Trip', entityId: '20401' },
  { actor: 2, action: 'referral.approve', summary: 'אישר הפניה 2600002153604', entityType: 'Referral', entityId: '2600002153604' },
  { actor: 0, action: 'user.invite', summary: 'הזמין את איל רגב כסדרן', entityType: 'User', entityId: '7008' },
  { actor: 1, action: 'trip.cancel', summary: 'ביטל את נסיעה 20349', entityType: 'Trip', entityId: '20349' },
  { actor: 8, action: 'report.generate', summary: 'הפיק דוח כספי לחודש יוני 2026', entityType: 'Report', entityId: 'R-2026-06' },
  { actor: 2, action: 'filter.save', summary: 'שמר תצוגת מסננים "נסיעות דחופות"', entityType: 'View', entityId: 'V-12' },
  { actor: 1, action: 'trip.bulkUpdate', summary: 'עדכן תעריף עבור 6 נסיעות', entityType: 'Trip', entityId: 'bulk' },
  { actor: 0, action: 'settings.update', summary: 'עדכן את מדיניות הביטולים', entityType: 'Settings', entityId: 'policy' },
  { actor: 1, action: 'trip.complete', summary: 'סימן את נסיעה 20318 כהושלמה', entityType: 'Trip', entityId: '20318' },
  { actor: 2, action: 'referral.reject', summary: 'דחה הפניה 2600002153598', entityType: 'Referral', entityId: '2600002153598' },
  { actor: 8, action: 'user.role', summary: 'שינה את תפקיד תמר גולן לצופה', entityType: 'User', entityId: '7007' },
  { actor: 0, action: 'export.csv', summary: 'ייצא 100 נסיעות לקובץ CSV', entityType: 'Export', entityId: 'exp-554' },
  { actor: 1, action: 'trip.assign', summary: 'שיבץ את סלים חורי לנסיעה 20356', entityType: 'Trip', entityId: '20356' },
  { actor: 2, action: 'trip.create', summary: 'יצר נסיעה חדשה 20402 עבור יוסי כהן', entityType: 'Trip', entityId: '20402' },
  { actor: 0, action: 'login', summary: 'התחבר/ה למערכת', entityType: 'Session', entityId: 'sess-901' },
  { actor: 1, action: 'trip.update', summary: 'עדכן שעת נסיעה 20327 ל-09:30', entityType: 'Trip', entityId: '20327' },
  { actor: 8, action: 'report.download', summary: 'הוריד דוח נסיעות יומי', entityType: 'Report', entityId: 'R-2026-07-02' },
  { actor: 2, action: 'referral.create', summary: 'פתח הפניה חדשה 2600002153610', entityType: 'Referral', entityId: '2600002153610' },
  { actor: 1, action: 'trip.assign', summary: 'שיבץ את דוד אוחיון לנסיעה 20361', entityType: 'Trip', entityId: '20361' },
  { actor: 0, action: 'user.suspend', summary: 'השעה את המשתמש בוריס פלדמן', entityType: 'User', entityId: '7006' },
  { actor: 2, action: 'view.column', summary: 'עדכן הגדרות עמודות בטבלת הסידור', entityType: 'View', entityId: 'cols' },
  { actor: 1, action: 'trip.noshow', summary: 'סימן את נסיעה 20312 כ"לא הופיע"', entityType: 'Trip', entityId: '20312' },
  { actor: 8, action: 'finance.mark', summary: 'סימן תקופה Q2 ככזו ששולמה', entityType: 'Finance', entityId: 'Q2-2026' },
  { actor: 0, action: 'settings.security', summary: 'הפעיל אימות דו-שלבי לחשבון', entityType: 'Settings', entityId: 'mfa' },
];

export const activityLog: ActivityLogEntry[] = activitySeed.map((a, i) => {
  const actor = users[a.actor];
  return {
    id: guid(9001 + i),
    actorName: actor.fullName,
    actorRole: actor.role,
    action: a.action,
    summary: a.summary,
    entityType: a.entityType,
    entityId: a.entityId,
    createdAt: ts(i, i * 23),
  };
});

/* ------------------------------------------------------------------ *
 * Reports
 * ------------------------------------------------------------------ */
const reportSeed: Array<{ name: string; type: string; status: ReportStatus; format: Report['format'] }> = [
  { name: 'דוח נסיעות יומי - 02/07', type: 'נסיעות', status: ReportStatus.Ready, format: 'PDF' },
  { name: 'דוח כספי חודשי - יוני', type: 'כספים', status: ReportStatus.Ready, format: 'XLSX' },
  { name: 'דוח שיבוץ נהגים', type: 'נהגים', status: ReportStatus.Processing, format: 'XLSX' },
  { name: 'ייצוא הפניות פתוחות', type: 'הפניות', status: ReportStatus.Ready, format: 'CSV' },
  { name: 'דוח ביטולים שבועי', type: 'נסיעות', status: ReportStatus.Failed, format: 'PDF' },
  { name: 'סיכום שביעות רצון', type: 'סקרים', status: ReportStatus.Ready, format: 'PDF' },
  { name: 'דוח תעריפים לפי מממן', type: 'כספים', status: ReportStatus.Queued, format: 'XLSX' },
  { name: 'דוח נסיעות מעלון', type: 'נסיעות', status: ReportStatus.Ready, format: 'CSV' },
  { name: 'דוח פעילות משתמשים', type: 'מערכת', status: ReportStatus.Ready, format: 'PDF' },
  { name: 'דוח כספי רבעוני - Q2', type: 'כספים', status: ReportStatus.Processing, format: 'XLSX' },
];

export const reports: Report[] = reportSeed.map((r, i) => ({
  id: guid(10001 + i),
  name: r.name,
  type: r.type,
  rangeFrom: `2026-0${(i % 6) + 1}-01`,
  rangeTo: `2026-0${(i % 6) + 1}-28`,
  status: r.status,
  format: r.format,
  sizeKb: r.status === ReportStatus.Ready ? 120 + i * 84 : null,
  requestedBy: users[i % users.length].fullName,
  createdAt: ts(i, i * 29),
}));

/* ------------------------------------------------------------------ *
 * Financial rows
 * ------------------------------------------------------------------ */
const financialSeed: Array<{ period: string; source: string; status: FinancialRow['status'] }> = [
  { period: 'יוני 2026', source: 'משרד הבריאות', status: 'Paid' },
  { period: 'יוני 2026', source: 'ביטוח לאומי', status: 'Pending' },
  { period: 'יוני 2026', source: 'כללית', status: 'Paid' },
  { period: 'יוני 2026', source: 'מכבי', status: 'Overdue' },
  { period: 'מאי 2026', source: 'משרד הבריאות', status: 'Paid' },
  { period: 'מאי 2026', source: 'מאוחדת', status: 'Paid' },
  { period: 'מאי 2026', source: 'לאומית', status: 'Pending' },
  { period: 'אפריל 2026', source: 'משרד הבריאות', status: 'Paid' },
];

export const financialRows: FinancialRow[] = financialSeed.map((f, i) => {
  const tripsCount = 120 + i * 37;
  const grossAmount = tripsCount * (140 + (i % 5) * 12);
  const discounts = Math.round(grossAmount * 0.06);
  return {
    id: guid(11001 + i),
    period: f.period,
    fundingSource: f.source,
    tripsCount,
    grossAmount,
    discounts,
    netAmount: grossAmount - discounts,
    status: f.status,
  };
});

/* ------------------------------------------------------------------ *
 * Dashboard summary — derived from the trip set
 * ------------------------------------------------------------------ */
function buildDashboardSummary(): DashboardSummary {
  const byStatus = (Object.values(TripStatus).filter((v) => typeof v === 'number') as TripStatus[]).map(
    (status) => ({ status, count: trips.filter((t) => t.status === status).length }),
  );
  const byDayMap = new Map<string, number>();
  for (const t of trips) byDayMap.set(t.date, (byDayMap.get(t.date) ?? 0) + 1);
  const byDay = [...byDayMap.entries()].sort().map(([date, count]) => ({ date, count }));

  return {
    totalTrips: trips.length,
    orderedBySelf: trips.filter((t) => t.orderSource === OrderSource.Passenger).length,
    orderedByManager: trips.filter((t) => t.orderSource === OrderSource.Manager).length,
    pending: trips.filter((t) => t.status === TripStatus.Pending).length,
    completed: trips.filter((t) => t.status === TripStatus.Completed).length,
    cancelled: trips.filter((t) => t.status === TripStatus.Cancelled).length,
    activeDrivers: drivers.filter((d) => d.isAvailable).length,
    totalDrivers: drivers.length,
    todayTrips: trips.filter((t) => t.date === TRIP_DATES[0]).length,
    byStatus,
    byDay,
  };
}

export const dashboardSummary: DashboardSummary = buildDashboardSummary();
