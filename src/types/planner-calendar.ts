import type { CalendarEvent } from '@/types/calendar';

export type PlannerFilterType = 'all' | 'customer' | 'vendor';

export interface PlannerCustomer {
  id: string;
  name: string;        // e.g. "김민수 · 이수진"
  weddingDate: string; // YYYY-MM-DD
  color: string;       // hex, for badge coloring
}

export interface PlannerVendorContact {
  id: string;
  name: string;     // e.g. "블루밍 스냅"
  category: string; // e.g. "스냅 스튜디오"
  color: string;
}

// Extends CalendarEvent with optional customer/vendor tagging
export type PlannerCalendarEvent = CalendarEvent & {
  customerId?: string;
  vendorId?: string;
};

export type CreatePlannerEventInput = Omit<CalendarEvent, 'id' | 'createdAt'> & {
  customerId?: string;
  vendorId?: string;
};
