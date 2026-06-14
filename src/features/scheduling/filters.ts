import type { TripStatus } from '@/types/enums';
import type { DateRange } from '@/lib/date';

export interface TripFiltersState {
  search: string;
  status: TripStatus | 'all';
  dateRange: DateRange;
  origin: string;
  destination: string;
  driver: string;
  passenger: string;
  referralNumber: string;
  attributes: {
    lift: boolean;
    stop: boolean;
    road6: boolean;
    urgent: boolean;
    roundTrip: boolean;
  };
}

export const defaultTripFilters: TripFiltersState = {
  search: '',
  status: 'all',
  dateRange: { from: null, to: null },
  origin: '',
  destination: '',
  driver: '',
  passenger: '',
  referralNumber: '',
  attributes: { lift: false, stop: false, road6: false, urgent: false, roundTrip: false },
};

export function countActiveFilters(f: TripFiltersState): number {
  let n = 0;
  if (f.search) n++;
  if (f.status !== 'all') n++;
  if (f.dateRange.from || f.dateRange.to) n++;
  if (f.origin) n++;
  if (f.destination) n++;
  if (f.driver) n++;
  if (f.passenger) n++;
  if (f.referralNumber) n++;
  n += Object.values(f.attributes).filter(Boolean).length;
  return n;
}
