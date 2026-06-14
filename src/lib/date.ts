export const HEB_WEEKDAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

export interface DateRange {
  from: string | null;
  to: string | null;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const base = new Date(year, month + delta, 1);
  return { year: base.getFullYear(), month: base.getMonth() };
}

/** 6×7 matrix of Dates covering the month grid (with leading/trailing days). */
export function getMonthMatrix(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0 = Sunday
  const weeks: Date[][] = [];
  let cursor = new Date(year, month, 1 - startWeekday);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()));
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function monthTitle(year: number, month: number): string {
  return new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function clampRange(from: string, to: string): DateRange {
  return from <= to ? { from, to } : { from: to, to: from };
}
