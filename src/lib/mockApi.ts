import { OrderSource, TripStatus } from '@/types/enums';
import type {
  ActivityLogEntry,
  AppNotification,
  DashboardSummary,
  Driver,
  FinancialRow,
  Location,
  Paginated,
  PassengerOrderSummary,
  Referral,
  Report,
  Trip,
  User,
} from '@/types';
import {
  activityLog,
  dashboardSummary,
  drivers,
  financialRows,
  locations,
  notifications,
  passengerOrderSummaries,
  referrals,
  reports,
  trips,
  users,
} from '@/mock/mockData';

/* ------------------------------------------------------------------ *
 * Async simulation helpers
 * ------------------------------------------------------------------ */
export type Simulate = 'error' | 'empty' | undefined;

const delay = (min = 380, max = 680) =>
  new Promise<void>((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

async function respond<T>(value: T, simulate: Simulate, emptyValue: T): Promise<T> {
  await delay();
  if (simulate === 'error') throw new Error('שגיאת רשת — לא ניתן לטעון את הנתונים. נסה שוב.');
  if (simulate === 'empty') return emptyValue;
  return value;
}

function paginate<T>(items: T[], page = 1, pageSize = 25): Paginated<T> {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}

/* ------------------------------------------------------------------ *
 * Trips
 * ------------------------------------------------------------------ */
export interface TripAttributesFilter {
  lift?: boolean;
  stop?: boolean;
  road6?: boolean;
  urgent?: boolean;
  roundTrip?: boolean;
}

export interface TripQuery {
  search?: string;
  status?: TripStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  origin?: string;
  destination?: string;
  driver?: string;
  passenger?: string;
  referralNumber?: string;
  attributes?: TripAttributesFilter;
  columnFilters?: Record<string, string[]>;
  sortBy?: string;
  sortDir?: 'asc' | 'desc' | null;
  page?: number;
  pageSize?: number;
  simulate?: Simulate;
}

/** String key used for per-column funnel filters; mirrors the table column ids. */
export function tripColumnValue(t: Trip, key: string): string {
  switch (key) {
    case 'serialNumber': return String(t.serialNumber);
    case 'referralNumber': return t.referralNumber;
    case 'date': return t.date;
    case 'time': return t.time;
    case 'origin': return t.origin.name;
    case 'destination': return t.destination.name;
    case 'passenger': return t.passenger.fullName;
    case 'driver': return t.driver?.fullName ?? '—';
    case 'status': return String(t.status);
    case 'tariff': return String(t.tariff);
    default: return '';
  }
}

function tripSortValue(t: Trip, key: string): string | number {
  switch (key) {
    case 'serialNumber': return t.serialNumber;
    case 'date': return `${t.date} ${t.time}`;
    case 'tariff': return t.tariff;
    case 'status': return t.status;
    default: return tripColumnValue(t, key);
  }
}

export async function getTrips(query: TripQuery = {}): Promise<Paginated<Trip>> {
  const {
    search, status, dateFrom, dateTo, origin, destination, driver, passenger, referralNumber,
    attributes, columnFilters, sortBy, sortDir, page = 1, pageSize = 25, simulate,
  } = query;

  let result = trips.slice();

  if (search) {
    const q = search.trim().toLowerCase();
    result = result.filter((t) =>
      [String(t.serialNumber), t.referralNumber, t.passenger.fullName, t.origin.name,
        t.destination.name, t.driver?.fullName ?? '']
        .some((v) => v.toLowerCase().includes(q)),
    );
  }
  if (status !== undefined && status !== 'all') result = result.filter((t) => t.status === status);
  if (dateFrom) result = result.filter((t) => t.date >= dateFrom);
  if (dateTo) result = result.filter((t) => t.date <= dateTo);
  if (origin) result = result.filter((t) => t.origin.name.includes(origin));
  if (destination) result = result.filter((t) => t.destination.name.includes(destination));
  if (driver) result = result.filter((t) => (t.driver?.fullName ?? '').includes(driver));
  if (passenger) result = result.filter((t) => t.passenger.fullName.includes(passenger));
  if (referralNumber) result = result.filter((t) => t.referralNumber.includes(referralNumber));

  if (attributes) {
    if (attributes.lift) result = result.filter((t) => t.isLift);
    if (attributes.stop) result = result.filter((t) => t.hasStop);
    if (attributes.road6) result = result.filter((t) => t.usesRoad6);
    if (attributes.urgent) result = result.filter((t) => t.priority === 1);
    if (attributes.roundTrip) result = result.filter((t) => t.tripType === 1);
  }

  if (columnFilters) {
    for (const [key, values] of Object.entries(columnFilters)) {
      if (values.length) result = result.filter((t) => values.includes(tripColumnValue(t, key)));
    }
  }

  if (sortBy && sortDir) {
    const dir = sortDir === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      const av = tripSortValue(a, sortBy);
      const bv = tripSortValue(b, sortBy);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  } else {
    result.sort((a, b) => a.serialNumber - b.serialNumber);
  }

  return respond(paginate(result, page, pageSize), simulate, {
    items: [], total: 0, page, pageSize,
  });
}

export async function getTripStats(query: TripQuery = {}): Promise<{
  total: number;
  orderedBySelf: number;
  orderedByManager: number;
}> {
  const { items } = await getTrips({ ...query, pageSize: trips.length, page: 1 });
  return {
    total: items.length,
    orderedBySelf: items.filter((t) => t.orderSource === OrderSource.Passenger).length,
    orderedByManager: items.filter((t) => t.orderSource === OrderSource.Manager).length,
  };
}

/** Distinct values for a column funnel menu. */
export async function getTripColumnOptions(key: string): Promise<string[]> {
  await delay(120, 260);
  return [...new Set(trips.map((t) => tripColumnValue(t, key)))].sort();
}

/* ------------------------------------------------------------------ *
 * Passengers / referrals / users
 * ------------------------------------------------------------------ */
export async function getPassengerOrders(search = '', simulate?: Simulate): Promise<PassengerOrderSummary[]> {
  const q = search.trim().toLowerCase();
  const filtered = q
    ? passengerOrderSummaries.filter((p) => p.fullName.toLowerCase().includes(q) || p.phone.includes(q))
    : passengerOrderSummaries;
  return respond(filtered, simulate, []);
}

export interface ListQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  simulate?: Simulate;
}

export async function getReferrals(query: ListQuery = {}): Promise<Paginated<Referral>> {
  const { search, page = 1, pageSize = 25, simulate } = query;
  let result = referrals.slice();
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((r) => r.passengerName.toLowerCase().includes(q) || r.referralNumber.includes(q));
  }
  return respond(paginate(result, page, pageSize), simulate, { items: [], total: 0, page, pageSize });
}

export async function getUsers(query: ListQuery = {}): Promise<Paginated<User>> {
  const { search, page = 1, pageSize = 25, simulate } = query;
  let result = users.slice();
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  return respond(paginate(result, page, pageSize), simulate, { items: [], total: 0, page, pageSize });
}

export async function getDrivers(simulate?: Simulate): Promise<Driver[]> {
  return respond(drivers, simulate, []);
}

export async function getLocations(): Promise<Location[]> {
  await delay(120, 240);
  return locations;
}

/* ------------------------------------------------------------------ *
 * Shell data
 * ------------------------------------------------------------------ */
export async function getNotifications(simulate?: Simulate): Promise<AppNotification[]> {
  return respond(notifications, simulate, []);
}

export async function getActivityLog(simulate?: Simulate): Promise<ActivityLogEntry[]> {
  return respond(activityLog, simulate, []);
}

export async function getDashboardSummary(simulate?: Simulate): Promise<DashboardSummary> {
  return respond(dashboardSummary, simulate, {
    ...dashboardSummary, totalTrips: 0, byStatus: [], byDay: [],
  });
}

export async function getReports(simulate?: Simulate): Promise<Report[]> {
  return respond(reports, simulate, []);
}

export async function getFinancialRows(simulate?: Simulate): Promise<FinancialRow[]> {
  return respond(financialRows, simulate, []);
}

/* ------------------------------------------------------------------ *
 * Mutations (mocked) — resolve after a short delay.
 * ------------------------------------------------------------------ */
export async function mockMutate<T>(payload: T, ms = 700): Promise<T> {
  await delay(ms, ms + 250);
  return payload;
}
