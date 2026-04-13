// ── Template Types ────────────────────────────────────────────────────────────

export type SmsTemplateType =
  | 'WEDDING_REMINDER'   // 결혼식 D-Day 알림
  | 'PAYMENT_REMINDER'   // 잔금 납부 알림
  | 'MEETING_CONFIRM'    // 미팅 확정 안내
  | 'DOCUMENT_REQUEST'   // 서류 제출 요청
  | 'CUSTOM';            // 직접 작성

export type SmsStatus   = 'scheduled' | 'sent' | 'failed' | 'cancelled';
export type SendTiming  = 'immediate' | 'scheduled';

export const ALL_SMS_TEMPLATES: SmsTemplateType[] = [
  'WEDDING_REMINDER',
  'PAYMENT_REMINDER',
  'MEETING_CONFIRM',
  'DOCUMENT_REQUEST',
  'CUSTOM',
];

export const SMS_TEMPLATE_LABEL: Record<SmsTemplateType, string> = {
  WEDDING_REMINDER: '결혼식 D-Day 알림',
  PAYMENT_REMINDER: '잔금 납부 알림',
  MEETING_CONFIRM:  '미팅 확정 안내',
  DOCUMENT_REQUEST: '서류 제출 요청',
  CUSTOM:           '직접 작성',
};

export const SMS_STATUS_LABEL: Record<SmsStatus, string> = {
  scheduled: '예약됨',
  sent:      '발송 완료',
  failed:    '발송 실패',
  cancelled: '취소됨',
};

export const SMS_STATUS_COLOR: Record<SmsStatus, string> = {
  scheduled: '#2E7BFF',
  sent:      '#22c55e',
  failed:    '#ef4444',
  cancelled: '#94a3b8',
};

/** 선택 시 textarea에 자동 채워지는 기본 문구 */
export const SMS_TEMPLATES: Record<SmsTemplateType, string> = {
  WEDDING_REMINDER: '[Promise Marry]\n안녕하세요 {{고객명}} 고객님, 결혼식이 {{날짜}}로 다가왔습니다 🎊 최종 일정 확인 부탁드립니다.',
  PAYMENT_REMINDER: '[Promise Marry]\n안녕하세요 {{고객명}} 고객님, {{업체명}} 잔금 납부 기한이 {{날짜}}입니다. 꼭 확인 부탁드립니다.',
  MEETING_CONFIRM:  '[Promise Marry]\n안녕하세요 {{고객명}} 고객님, {{날짜}} {{업체명}} 미팅이 확정되었습니다. 시간 맞춰 방문 부탁드립니다.',
  DOCUMENT_REQUEST: '[Promise Marry]\n안녕하세요 {{고객명}} 고객님, 진행을 위해 {{날짜}}까지 서류 제출이 필요합니다. 플래너에게 전달 부탁드립니다.',
  CUSTOM:           '',
};

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface SmsSchedule {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  templateType: SmsTemplateType;
  message: string;        // 변수 치환 후 실제 발송 메시지
  status: SmsStatus;
  scheduledAt?: string;   // ISO datetime (예약 발송)
  sentAt?: string;        // ISO datetime (발송 완료)
  createdAt: string;
}

export interface CreateSmsInput {
  customerId: string;
  templateType: SmsTemplateType;
  message: string;
  timing: SendTiming;
  scheduledAt?: string;   // timing === 'scheduled'일 때 필수
}
