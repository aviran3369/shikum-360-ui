const LOCALE = 'he-IL';

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

/** "02/07/2026" */
export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(toDate(value));
}

/** "2 ביולי 2026" */
export function formatDateMedium(value: string | Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(toDate(value));
}

/** "חמישי, 2 ביולי 2026" — weekday label without the leading "יום". */
export function formatDateLong(value: string | Date): string {
  const formatted = new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(toDate(value));
  return formatted.replace(/^יום\s/, '');
}

/** "08:00" */
export function formatTime(value: string | Date): string {
  if (typeof value === 'string' && /^\d{1,2}:\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(toDate(value));
}

/** "02/07/2026, 08:00" */
export function formatDateTime(value: string | Date): string {
  return `${formatDate(value)}, ${formatTime(value)}`;
}

/** "1,250" */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}

/** "₪1,250" */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(value);
}

/** "60%" */
export function formatPercent(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** "054-123-4567" from a 10-digit Israeli mobile string. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
}

/** "לפני 5 דקות" — coarse Hebrew relative time. `now` is injectable for determinism/testing. */
export function formatRelative(value: string | Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - toDate(value).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return 'הרגע';
  if (diffMin < 60) return `לפני ${diffMin} דקות`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'אתמול';
  if (diffDays < 30) return `לפני ${diffDays} ימים`;
  return formatDate(value);
}

/** "20301" → trip serial as a plain string (kept distinct for future zero-padding). */
export function formatSerial(serial: number): string {
  return String(serial);
}
