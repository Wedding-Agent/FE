import { apiClient } from '@/lib/api-client';
import type { SmsSchedule, CreateSmsInput } from '@/types/sms-automation';

// ── Mock 감지 ────────────────────────────────────────────────────────────────
function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ── Mock 데이터 ──────────────────────────────────────────────────────────────
let MOCK_SCHEDULES: SmsSchedule[] = [
  {
    id: 'sms-1',
    customerId: 'c-1',
    customerName: '김민수 · 이수진',
    phone: '010-1234-5678',
    templateType: 'WEDDING_REMINDER',
    message: '[Promise Marry]\n안녕하세요 김민수·이수진 고객님, 결혼식이 2026-06-14로 다가왔습니다 🎊 최종 일정 확인 부탁드립니다.',
    status: 'scheduled',
    scheduledAt: '2026-06-07T09:00:00',
    createdAt: '2026-04-10T11:00:00',
  },
  {
    id: 'sms-2',
    customerId: 'c-2',
    customerName: '박준혁 · 최아름',
    phone: '010-2345-6789',
    templateType: 'PAYMENT_REMINDER',
    message: '[Promise Marry]\n안녕하세요 박준혁·최아름 고객님, 그랜드 웨딩홀 잔금 납부 기한이 2026-07-01입니다. 꼭 확인 부탁드립니다.',
    status: 'scheduled',
    scheduledAt: '2026-06-25T10:00:00',
    createdAt: '2026-04-12T09:30:00',
  },
  {
    id: 'sms-3',
    customerId: 'c-1',
    customerName: '김민수 · 이수진',
    phone: '010-1234-5678',
    templateType: 'MEETING_CONFIRM',
    message: '[Promise Marry]\n안녕하세요 김민수·이수진 고객님, 2026-04-05 로즈드레스 미팅이 확정되었습니다.',
    status: 'sent',
    sentAt: '2026-04-05T08:59:58',
    createdAt: '2026-04-03T15:00:00',
  },
  {
    id: 'sms-4',
    customerId: 'c-3',
    customerName: '이현호 · 정유나',
    phone: '010-3456-7890',
    templateType: 'DOCUMENT_REQUEST',
    message: '[Promise Marry]\n안녕하세요 이현호·정유나 고객님, 진행을 위해 2026-04-15까지 서류 제출이 필요합니다.',
    status: 'failed',
    scheduledAt: '2026-04-13T09:00:00',
    createdAt: '2026-04-11T14:00:00',
  },
];

let smsIdCounter = 100;

// ── API 함수 ─────────────────────────────────────────────────────────────────

export async function fetchSmsSchedules(): Promise<SmsSchedule[]> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    return [...MOCK_SCHEDULES];
  }
  return apiClient.get('api/planner/sms').json();
}

export async function createSms(payload: CreateSmsInput): Promise<SmsSchedule> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 250));
    // 고객 정보를 customerId로 찾기 (실제로는 서버가 처리)
    const CUSTOMER_MAP: Record<string, { name: string; phone: string }> = {
      'c-1': { name: '김민수 · 이수진', phone: '010-1234-5678' },
      'c-2': { name: '박준혁 · 최아름', phone: '010-2345-6789' },
      'c-3': { name: '이현호 · 정유나', phone: '010-3456-7890' },
    };
    const customer = CUSTOMER_MAP[payload.customerId] ?? { name: '알 수 없음', phone: '' };
    const now = new Date().toISOString();
    const newSchedule: SmsSchedule = {
      id: `sms-mock-${++smsIdCounter}`,
      customerId:   payload.customerId,
      customerName: customer.name,
      phone:        customer.phone,
      templateType: payload.templateType,
      message:      payload.message,
      status:       payload.timing === 'immediate' ? 'sent' : 'scheduled',
      scheduledAt:  payload.timing === 'scheduled' ? payload.scheduledAt : undefined,
      sentAt:       payload.timing === 'immediate' ? now : undefined,
      createdAt:    now,
    };
    MOCK_SCHEDULES = [...MOCK_SCHEDULES, newSchedule];
    return newSchedule;
  }
  return apiClient.post('api/planner/sms', { json: payload }).json();
}

export async function deleteSms(id: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    MOCK_SCHEDULES = MOCK_SCHEDULES.filter((s) => s.id !== id);
    return;
  }
  await apiClient.delete(`api/planner/sms/${id}`);
}

export async function sendSmsNow(id: string): Promise<{ sentAt: string }> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const sentAt = new Date().toISOString();
    MOCK_SCHEDULES = MOCK_SCHEDULES.map((s) =>
      s.id === id ? { ...s, status: 'sent' as const, sentAt } : s,
    );
    return { sentAt };
  }
  return apiClient.post(`api/planner/sms/${id}/send`).json();
}
