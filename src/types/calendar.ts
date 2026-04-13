// ── 이벤트 카테고리 ─────────────────────────────────────────────────────────
export type EventCategory = 'DDAY' | 'MEETING' | 'TASK' | 'REMINDER' | 'OTHER';

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  DDAY:     'D-Day',
  MEETING:  '업체미팅',
  TASK:     '할일',
  REMINDER: '알림',
  OTHER:    '기타',
};

export const CATEGORY_EMOJI: Record<EventCategory, string> = {
  DDAY:     '💍',
  MEETING:  '📋',
  TASK:     '✅',
  REMINDER: '🔔',
  OTHER:    '🗓️',
};

export const CATEGORY_COLOR: Record<EventCategory, string> = {
  DDAY:     '#fb7185',
  MEETING:  '#60a5fa',
  TASK:     '#34d399',
  REMINDER: '#fbbf24',
  OTHER:    '#94a3b8',
};

export const ALL_CATEGORIES: EventCategory[] = ['DDAY', 'MEETING', 'TASK', 'REMINDER', 'OTHER'];

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
  note?: string;
  createdAt: string;
}

export interface CalendarEventsResponse {
  events: CalendarEvent[];
}

export interface WeddingInfo {
  weddingDate: string | null;
  partnerNickname: string;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateLabel(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = days[date.getDay()];
  return `${m}월 ${d}일 (${w})`;
}

export function calcDDay(weddingDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDateKey(weddingDate);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}
