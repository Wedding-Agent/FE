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
  DDAY:     '#fb7185', // rose
  MEETING:  '#60a5fa', // blue
  TASK:     '#34d399', // emerald
  REMINDER: '#fbbf24', // amber
  OTHER:    '#94a3b8', // slate
};

export const ALL_CATEGORIES: EventCategory[] = ['DDAY', 'MEETING', 'TASK', 'REMINDER', 'OTHER'];

// ── 캘린더 이벤트 ────────────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;          // YYYY-MM-DD
  category: EventCategory;
  note?: string;
  createdAt: string;
}

// ── API 응답 ─────────────────────────────────────────────────────────────────
export interface CalendarEventsResponse {
  events: CalendarEvent[];
}

export interface WeddingInfo {
  weddingDate: string | null; // YYYY-MM-DD, null이면 미설정
  partnerNickname: string;
}

// ── 날짜 유틸 ────────────────────────────────────────────────────────────────
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

/** YYYY-MM-DD → "4월 12일 (토)" */
export function formatDateLabel(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = days[date.getDay()];
  return `${m}월 ${d}일 (${w})`;
}

/** 웨딩 D-Day 계산: 양수면 D-N (미래), 음수면 D+N (과거) */
export function calcDDay(weddingDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDateKey(weddingDate);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}
