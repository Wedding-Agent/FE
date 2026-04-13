'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight, Calendar } from 'lucide-react';
import type { PlannerCustomerDetail } from '@/types/planner-customers';
import { CONTRACT_STATUS_COLOR } from '@/types/planner-customers';
import type { PlannerCalendarEvent } from '@/types/planner-calendar';
import { calcDDay, CATEGORY_EMOJI } from '@/types/calendar';
import styles from './CustomerCard.module.css';

interface CustomerCardProps {
  customer: PlannerCustomerDetail;
  nextEvent?: PlannerCalendarEvent;
}

function formatDDay(dday: number): string {
  if (dday === 0) return 'D-Day';
  if (dday > 0) return `D-${dday}`;
  return `D+${Math.abs(dday)}`;
}

function formatWeddingDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

function formatEventDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${Number(m)}월 ${Number(d)}일`;
}

export function CustomerCard({ customer, nextEvent }: CustomerCardProps) {
  const router = useRouter();
  const dday = calcDDay(customer.weddingDate);
  const confirmedCount = customer.vendors.filter((v) => v.status === 'confirmed').length;

  return (
    <button
      className={styles.card}
      onClick={() => router.push(`/planner/customers/${customer.id}`)}
      type="button"
    >
      {/* 헤더 행: 이름 + D-Day */}
      <div className={styles.header}>
        <div className={styles.nameRow}>
          <span className={styles.colorDot} style={{ background: customer.color }} />
          <span className={styles.name}>{customer.name}</span>
        </div>
        <span
          className={styles.ddayBadge}
          style={{
            background: dday <= 30 && dday >= 0 ? `${customer.color}22` : 'rgba(148,163,184,0.12)',
            color: dday <= 30 && dday >= 0 ? customer.color : '#64748b',
          }}
        >
          {formatDDay(dday)}
        </span>
      </div>

      {/* 웨딩일 */}
      <div className={styles.weddingDate}>
        <Calendar size={12} strokeWidth={2.5} />
        {formatWeddingDate(customer.weddingDate)}
      </div>

      {/* 업체 칩 */}
      <div className={styles.chipRow}>
        {customer.vendors.map((v) => (
          <span
            key={v.id}
            className={styles.chip}
            style={{ borderColor: `${CONTRACT_STATUS_COLOR[v.status]}55` }}
          >
            <span
              className={styles.chipDot}
              style={{ background: CONTRACT_STATUS_COLOR[v.status] }}
            />
            {v.vendorCategory}
          </span>
        ))}
        {customer.vendors.length === 0 && (
          <span className={styles.chipEmpty}>업체 미배정</span>
        )}
      </div>

      {/* 진행률 요약 */}
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: customer.vendors.length
                ? `${(confirmedCount / customer.vendors.length) * 100}%`
                : '0%',
              background: customer.color,
            }}
          />
        </div>
        <span className={styles.progressText}>
          {confirmedCount}/{customer.vendors.length} 확정
        </span>
      </div>

      {/* 다음 일정 */}
      {nextEvent && (
        <div className={styles.nextEvent}>
          <span className={styles.nextEventEmoji}>{CATEGORY_EMOJI[nextEvent.category]}</span>
          <span className={styles.nextEventText}>
            {formatEventDate(nextEvent.date)} · {nextEvent.title}
          </span>
        </div>
      )}

      <ChevronRight size={16} className={styles.chevron} />
    </button>
  );
}
