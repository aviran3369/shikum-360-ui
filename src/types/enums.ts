/**
 * Numeric enums mirroring the backend (.NET) contract one-to-one.
 * Values are explicit so the front-end serializes identically to the API.
 */

export enum TripStatus {
  Draft = 0,
  Pending = 1,
  Scheduled = 2,
  Assigned = 3,
  InProgress = 4,
  Completed = 5,
  Cancelled = 6,
  NoShow = 7,
}

export enum OrderSource {
  Passenger = 0,
  Manager = 1,
  System = 2,
}

export enum TripType {
  OneWay = 0,
  RoundTrip = 1,
}

export enum Priority {
  Normal = 0,
  Urgent = 1,
}

export enum UserRole {
  Admin = 0,
  Dispatcher = 1,
  Driver = 2,
  Viewer = 3,
}

export enum UserStatus {
  Active = 0,
  Invited = 1,
  Suspended = 2,
}

export enum ReferralStatus {
  New = 0,
  InReview = 1,
  Approved = 2,
  Rejected = 3,
  Closed = 4,
}

export enum NotificationKind {
  Info = 0,
  Success = 1,
  Warning = 2,
  Error = 3,
}

export enum SystemStatusLevel {
  Operational = 0,
  Degraded = 1,
  Down = 2,
}

export enum ReportStatus {
  Queued = 0,
  Processing = 1,
  Ready = 2,
  Failed = 3,
}
