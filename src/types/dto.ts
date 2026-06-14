import type {
  NotificationKind,
  OrderSource,
  Priority,
  ReferralStatus,
  ReportStatus,
  TripStatus,
  TripType,
  UserRole,
  UserStatus,
} from './enums';

/** Branded primitive aliases that document the backend wire format. */
export type Guid = string;
export type IsoDateTime = string; // e.g. "2026-07-02T08:00:00Z"
export type IsoDate = string; // e.g. "2026-07-02"
export type TimeString = string; // e.g. "08:00"

export interface Location {
  id: Guid;
  name: string;
  address: string;
  city: string;
}

export interface Passenger {
  id: Guid;
  fullName: string;
  phone: string;
  city: string;
  orderedBySelf: number;
  orderedByManager: number;
  totalTrips: number;
  isActive: boolean;
}

export interface Vehicle {
  id: Guid;
  plate: string;
  model: string;
  seats: number;
  hasLift: boolean;
}

export interface Driver {
  id: Guid;
  fullName: string;
  phone: string;
  vehiclePlate: string | null;
  rating: number;
  activeTrips: number;
  isAvailable: boolean;
}

export interface Trip {
  id: Guid;
  serialNumber: number;
  referralNumber: string;
  date: IsoDate;
  time: TimeString;
  origin: Location;
  destination: Location;
  passenger: Pick<Passenger, 'id' | 'fullName' | 'phone'>;
  driver: { id: Guid; fullName: string } | null;
  vehicle: { id: Guid; plate: string } | null;
  status: TripStatus;
  orderSource: OrderSource;
  tripType: TripType;
  priority: Priority;
  isLift: boolean;
  hasStop: boolean;
  usesRoad6: boolean;
  tariff: number;
  notes: string | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface Referral {
  id: Guid;
  referralNumber: string;
  passengerName: string;
  passengerPhone: string;
  fundingSource: string;
  status: ReferralStatus;
  tripsCount: number;
  openedAt: IsoDate;
  validUntil: IsoDate;
  assignedTo: string | null;
}

export interface User {
  id: Guid;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  lastActiveAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  avatarColor: string;
}

export interface AppNotification {
  id: Guid;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: IsoDateTime;
  read: boolean;
  href: string | null;
}

export interface ActivityLogEntry {
  id: Guid;
  actorName: string;
  actorRole: UserRole;
  action: string;
  summary: string;
  entityType: string;
  entityId: string;
  createdAt: IsoDateTime;
}

export interface Report {
  id: Guid;
  name: string;
  type: string;
  rangeFrom: IsoDate;
  rangeTo: IsoDate;
  status: ReportStatus;
  format: 'PDF' | 'XLSX' | 'CSV';
  sizeKb: number | null;
  requestedBy: string;
  createdAt: IsoDateTime;
}

export interface FinancialRow {
  id: Guid;
  period: string;
  fundingSource: string;
  tripsCount: number;
  grossAmount: number;
  discounts: number;
  netAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface PassengerOrderSummary {
  id: Guid;
  fullName: string;
  phone: string;
  orderedBySelf: number;
  orderedByManager: number;
  total: number;
}

export interface DashboardSummary {
  totalTrips: number;
  orderedBySelf: number;
  orderedByManager: number;
  pending: number;
  completed: number;
  cancelled: number;
  activeDrivers: number;
  totalDrivers: number;
  todayTrips: number;
  byStatus: { status: TripStatus; count: number }[];
  byDay: { date: IsoDate; count: number }[];
}

/** Generic API envelopes that mirror the backend response shapes. */
export interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: IsoDateTime;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
