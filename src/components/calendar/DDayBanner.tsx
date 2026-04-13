'use client';

import { useState } from 'react';
import type { WeddingInfo } from '@/types/calendar';
import { calcDDay } from '@/types/calendar';
import { useUpdateWeddingDate } from '@/features/calendar/hooks';
import styles from './DDayBanner.module.css';

interface DDayBannerProps {
  weddingInfo: WeddingInfo | undefined;
}

export function DDayBanner({ weddingInfo }: DDayBannerProps) {
  const [editing, setEditing] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const updateMutation = useUpdateWeddingDate();

  const weddingDate = weddingInfo?.weddingDate;
  const partnerNickname = weddingInfo?.partnerNickname ?? '';

  const dday = weddingDate ? calcDDay(weddingDate) : null;

  const ddayLabel =
    dday === null
      ? '결혼식 날짜 미설정'
      : dday === 0
      ? 'D-Day 🎉'
      : dday > 0
      ? `D-${dday}`
      : `D+${Math.abs(dday)}`;

  const handleSave = () => {
    if (!inputDate) return;
    updateMutation.mutate(inputDate, { onSuccess: () => setEditing(false) });
  };

  const formattedDate = weddingDate
    ? (() => {
        const [y, m, d] = weddingDate.split('-');
        return `${y}년 ${Number(m)}월 ${Number(d)}일`;
      })()
    : null;

  if (editing) {
    return (
      <div className={styles.banner}>
        <div className={styles.editWrap}>
          <span className={styles.editLabel}>결혼식 날짜 설정</span>
          <div className={styles.editRow}>
            <input
              type="date"
              className={styles.dateInput}
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!inputDate || updateMutation.isPending}
            >
              저장
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setEditing(false)}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.ring} aria-hidden="true">💍</span>
          <div className={styles.info}>
            {formattedDate ? (
              <>
                <p className={styles.date}>{formattedDate} 결혼식</p>
                {partnerNickname && (
                  <p className={styles.partner}>{partnerNickname}님과 함께하는 날</p>
                )}
              </>
            ) : (
              <p className={styles.date}>결혼식 날짜를 등록해보세요</p>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.ddayChip}
            onClick={() => {
              setInputDate(weddingDate ?? '');
              setEditing(true);
            }}
            title="날짜 변경"
          >
            <span className={styles.ddayText}>{ddayLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
