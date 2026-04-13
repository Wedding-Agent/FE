'use client';

import { Trash2, Send } from 'lucide-react';
import type { SmsSchedule } from '@/types/sms-automation';
import { SMS_TEMPLATE_LABEL, SMS_STATUS_LABEL, SMS_STATUS_COLOR } from '@/types/sms-automation';
import styles from './SmsScheduleCard.module.css';

interface Props {
  schedule: SmsSchedule;
  onSendNow: (id: string) => void;
  onDelete: (id: string) => void;
  isSending?: boolean;
  isDeleting?: boolean;
}

function formatDatetime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function SmsScheduleCard({ schedule, onSendNow, onDelete, isSending, isDeleting }: Props) {
  const statusColor = SMS_STATUS_COLOR[schedule.status];
  const timeLabel =
    schedule.status === 'sent' && schedule.sentAt
      ? `발송: ${formatDatetime(schedule.sentAt)}`
      : schedule.scheduledAt
      ? `예약: ${formatDatetime(schedule.scheduledAt)}`
      : null;

  return (
    <article className={styles.card}>
      {/* 상단: 고객 정보 + 상태 배지 */}
      <div className={styles.top}>
        <div className={styles.customerInfo}>
          <span className={styles.customerName}>{schedule.customerName}</span>
          <span className={styles.phone}>{schedule.phone}</span>
        </div>
        <span
          className={styles.statusBadge}
          style={{ background: `${statusColor}18`, color: statusColor }}
        >
          {SMS_STATUS_LABEL[schedule.status]}
        </span>
      </div>

      {/* 중간: 템플릿 chip + 메시지 미리보기 */}
      <div className={styles.middle}>
        <span className={styles.templateChip}>
          {SMS_TEMPLATE_LABEL[schedule.templateType]}
        </span>
        <p className={styles.messagePreview}>{schedule.message}</p>
      </div>

      {/* 하단: 시간 + 액션 버튼 */}
      <div className={styles.bottom}>
        <span className={styles.timeLabel}>{timeLabel ?? ''}</span>
        <div className={styles.actions}>
          {schedule.status === 'scheduled' && (
            <button
              type="button"
              className={styles.sendNowBtn}
              onClick={() => onSendNow(schedule.id)}
              disabled={isSending || isDeleting}
              aria-label="지금 발송"
            >
              <Send size={13} />
              지금 발송
            </button>
          )}
          {(schedule.status === 'scheduled' || schedule.status === 'failed') && (
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => onDelete(schedule.id)}
              disabled={isSending || isDeleting}
              aria-label="삭제"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
