import { apiClient } from '@/lib/api-client';
import type {
  PlannerCalendarEvent,
  PlannerCustomer,
  PlannerVendorContact,
  CreatePlannerEventInput,
} from '@/types/planner-calendar';

// ── Mock 감지 ────────────────────────────────────────────────────────────────
function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ── Mock 데이터 ──────────────────────────────────────────────────────────────
const MOCK_CUSTOMERS: PlannerCustomer[] = [
  { id: 'c-1', name: '김민수 · 이수진', weddingDate: '2026-06-14', color: '#fb7185' },
  { id: 'c-2', name: '박준혁 · 최아름', weddingDate: '2026-08-22', color: '#60a5fa' },
  { id: 'c-3', name: '이현호 · 정유나', weddingDate: '2026-10-10', color: '#a78bfa' },
];

const MOCK_VENDORS: PlannerVendorContact[] = [
  { id: 'v-1', name: '블루밍 스냅',   category: '스냅 스튜디오', color: '#34d399' },
  { id: 'v-2', name: '로즈드레스',    category: '드레스샵',      color: '#fb923c' },
  { id: 'v-3', name: '그랜드 웨딩홀', category: '웨딩홀',        color: '#facc15' },
];

let MOCK_EVENTS: PlannerCalendarEvent[] = [
  { id: 'pe-1',  title: '웨딩홀 상담',        date: '2026-04-10', category: 'MEETING', customerId: 'c-1', vendorId: 'v-3', note: '그랜드웨딩홀 1층 미팅룸', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-2',  title: '스냅 계약 미팅',      date: '2026-04-12', category: 'MEETING', customerId: 'c-2', vendorId: 'v-1', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-3',  title: '드레스 피팅 1차',     date: '2026-04-15', category: 'MEETING', customerId: 'c-1', vendorId: 'v-2', note: '오후 2시', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-4',  title: '초기 상담',           date: '2026-04-16', category: 'MEETING', customerId: 'c-3', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-5',  title: '식순 확인 미팅',      date: '2026-04-18', category: 'TASK',    customerId: 'c-2', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-6',  title: '웨딩홀 투어',         date: '2026-04-20', category: 'MEETING', customerId: 'c-3', vendorId: 'v-3', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-7',  title: '계약서 갱신 검토',    date: '2026-04-22', category: 'TASK',    vendorId: 'v-3', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-8',  title: '포트폴리오 검토',     date: '2026-04-25', category: 'MEETING', vendorId: 'v-1', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-9',  title: '청첩장 문구 확정',    date: '2026-04-30', category: 'TASK',    customerId: 'c-1', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-10', title: 'D-Day',               date: '2026-06-14', category: 'DDAY',    customerId: 'c-1', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-11', title: 'D-Day',               date: '2026-08-22', category: 'DDAY',    customerId: 'c-2', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-12', title: 'D-Day',               date: '2026-10-10', category: 'DDAY',    customerId: 'c-3', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-13', title: '드레스 피팅 2차',     date: '2026-05-08', category: 'MEETING', customerId: 'c-1', vendorId: 'v-2', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'pe-14', title: '로즈드레스 신상 확인', date: '2026-05-14', category: 'MEETING', vendorId: 'v-2', createdAt: '2026-04-01T00:00:00Z' },
];

let peIdCounter = 20;

// ── API 함수 ─────────────────────────────────────────────────────────────────

export async function fetchPlannerCustomers(): Promise<PlannerCustomer[]> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    return [...MOCK_CUSTOMERS];
  }
  return apiClient.get('api/planner/customers').json();
}

export async function fetchPlannerVendorContacts(): Promise<PlannerVendorContact[]> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    return [...MOCK_VENDORS];
  }
  return apiClient.get('api/planner/vendors').json();
}

export async function fetchPlannerEvents(
  year: number,
  month: number,
): Promise<{ events: PlannerCalendarEvent[] }> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const events = MOCK_EVENTS.filter((e) => e.date.startsWith(prefix));
    return { events };
  }
  return apiClient.get(`api/planner/events?year=${year}&month=${month}`).json();
}

export async function createPlannerEvent(
  payload: CreatePlannerEventInput,
): Promise<PlannerCalendarEvent> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const event: PlannerCalendarEvent = {
      ...payload,
      id: `pe-${++peIdCounter}`,
      createdAt: new Date().toISOString(),
    };
    MOCK_EVENTS = [...MOCK_EVENTS, event];
    return event;
  }
  return apiClient.post('api/planner/events', { json: payload }).json();
}

export async function updatePlannerEvent(
  id: string,
  payload: Partial<CreatePlannerEventInput>,
): Promise<PlannerCalendarEvent> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    MOCK_EVENTS = MOCK_EVENTS.map((e) => (e.id === id ? { ...e, ...payload } : e));
    return MOCK_EVENTS.find((e) => e.id === id)!;
  }
  return apiClient.patch(`api/planner/events/${id}`, { json: payload }).json();
}

export async function deletePlannerEvent(id: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    MOCK_EVENTS = MOCK_EVENTS.filter((e) => e.id !== id);
    return;
  }
  await apiClient.delete(`api/planner/events/${id}`);
}
