'use client';

import type { WeddingInfo } from '@/types/calendar';
import { calcDDay } from '@/types/calendar';
import styles from './CoupleProfileCard.module.css';

interface CoupleProfileCardProps {
  weddingInfo: WeddingInfo;
  doneCount:   number;
  totalCount:  number;
}

function formatWeddingDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

function getDDayLabel(weddingDate: string | null): string {
  if (!weddingDate) return '날짜 미설정';
  const dday = calcDDay(weddingDate);
  if (dday === 0) return 'D-Day 🎉';
  if (dday > 0)  return `D-${dday}`;
  return `D+${Math.abs(dday)}`;
}

export function CoupleProfileCard({ weddingInfo, doneCount, totalCount }: CoupleProfileCardProps) {
  const ddayLabel  = getDDayLabel(weddingInfo.weddingDate);
  const dateLabel  = weddingInfo.weddingDate ? formatWeddingDate(weddingInfo.weddingDate) : '결혼식 날짜를 설정해 주세요';
  const progress   = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.coupleLabel}>💑 커플 D-Day</span>
        <span className={styles.ddayBadge}>{ddayLabel}</span>
      </div>

      <p className={styles.namesText}>나 &amp; {weddingInfo.partnerNickname}</p>
      <p className={styles.dateText}>{dateLabel}</p>

      <div className={styles.progressWrap}>
        <p className={styles.progressLabel}>
          체크리스트: {doneCount} / {totalCount} 완료
        </p>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
          />
        </div>
      </div>
    </div>
  );
}
