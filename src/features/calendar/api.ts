import { apiClient } from '@/lib/api-client';
import type {
  CalendarEvent,
  CalendarEventsResponse,
  EventCategory,
  WeddingInfo,
} from '@/types/calendar';

// ── Mock 감지 ────────────────────────────────────────────────────────────────
function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ── Mock 데이터 ──────────────────────────────────────────────────────────────
const MOCK_WEDDING: WeddingInfo = {
  weddingDate: '2026-10-10',
  partnerNickname: '이수민',
};

let MOCK_EVENTS: CalendarEvent[] = [
  // 4월
  { id: 'ev-1', title: '결혼식 D-Day', date: '2026-10-10', category: 'DDAY',     createdAt: '2026-04-01T00:00:00Z' },
  { id: 'ev-2', title: '웨딩홀 계약 미팅',  date: '2026-04-14', category: 'MEETING',  note: '그랜드웨딩홀 담당자 홍길동', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'ev-3', title: '드레스 피팅 1차',   date: '2026-04-18', category: 'MEETING',  note: '오후 2시, 압구정 드레스샵', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'ev-4', title: '청첩장 문구 확정',  date: '2026-04-20', category: 'TASK',     createdAt: '2026-04-01T00:00:00Z' },
  { id: 'ev-5', title: '스냅 사진 계약금 납부', date: '2026-04-22', category: 'TASK',  note: '포토스튜디오A - 30만원', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'ev-6', title: '부모님 상견례',      date: '2026-04-26', category: 'REMINDER', note: '강남 모던한식당 예약 완료', createdAt: '2026-04-01T00:00:00Z' },
  // 5월
  { id: 'ev-7', title: '청첩장 인쇄 완료',  date: '2026-05-03', category: 'TASK',     createdAt: '2026-04-01T00:00:00Z' },
  { id: 'ev-8', title: '메이크업 리허설',    date: '2026-05-09', category: 'MEETING',  note: '헤어·메이크업샵 2시', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'ev-9', title: '신혼여행 항공권 발권', date: '2026-05-15', category: 'TASK',    note: '몰디브 왕복', createdAt: '2026-04-01T00:00:00Z' },
  // 3월 (지난 달)
  { id: 'ev-10', title: '웨딩홀 투어',       date: '2026-03-22', category: 'MEETING',  createdAt: '2026-03-20T00:00:00Z' },
];

let evIdCounter = 20;

function genId(): string {
  return `ev-${++evIdCounter}`;
}

// ── API 함수 ─────────────────────────────────────────────────────────────────

/** 특정 연-월의 이벤트 목록 조회 */
export async function fetchEvents(year: number, month: number): Promise<CalendarEventsResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const events = MOCK_EVENTS.filter((e) => e.date.startsWith(prefix));
    return { events };
  }
  return apiClient.get(`api/calendar/events?year=${year}&month=${month}`).json();
}

/** 결혼식 날짜 + 파트너 정보 조회 */
export async function fetchWeddingInfo(): Promise<WeddingInfo> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_WEDDING;
  }
  return apiClient.get('api/calendar/wedding-info').json();
}

/** 이벤트 생성 */
export async function createEvent(
  payload: Omit<CalendarEvent, 'id' | 'createdAt'>,
): Promise<CalendarEvent> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const event: CalendarEvent = {
      ...payload,
      id: genId(),
      createdAt: new Date().toISOString(),
    };
    MOCK_EVENTS = [...MOCK_EVENTS, event];
    return event;
  }
  return apiClient.post('api/calendar/events', { json: payload }).json();
}

/** 이벤트 수정 */
export async function updateEvent(
  id: string,
  payload: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>,
): Promise<CalendarEvent> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    MOCK_EVENTS = MOCK_EVENTS.map((e) => (e.id === id ? { ...e, ...payload } : e));
    return MOCK_EVENTS.find((e) => e.id === id)!;
  }
  return apiClient.patch(`api/calendar/events/${id}`, { json: payload }).json();
}

/** 이벤트 삭제 */
export async function deleteEvent(id: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    MOCK_EVENTS = MOCK_EVENTS.filter((e) => e.id !== id);
    return;
  }
  await apiClient.delete(`api/calendar/events/${id}`);
}

/** 결혼식 날짜 설정/변경 */
export async function updateWeddingDate(weddingDate: string): Promise<WeddingInfo> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    MOCK_WEDDING.weddingDate = weddingDate;
    // D-Day 이벤트도 동기화
    const ddayIdx = MOCK_EVENTS.findIndex((e) => e.category === 'DDAY' && e.id === 'ev-1');
    if (ddayIdx !== -1) {
      MOCK_EVENTS[ddayIdx] = { ...MOCK_EVENTS[ddayIdx], date: weddingDate };
    }
    return { ...MOCK_WEDDING };
  }
  return apiClient.put('api/calendar/wedding-date', { json: { weddingDate } }).json();
}

// EventCategory 재 export (hooks에서 편하게 쓰기 위해)
export type { EventCategory };
