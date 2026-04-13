'use client';

import type { VendorSummary } from '@/types/vendor';
import styles from './SentimentSummary.module.css';

interface SentimentSummaryProps {
  summary: VendorSummary;
}

export function SentimentSummary({ summary }: SentimentSummaryProps) {
  return (
    <div className={styles.card}>
      <p className={styles.title}>🤖 AI 리뷰 요약</p>
      <div className={styles.row}>
        <span className={styles.icon}>✅</span>
        <div>
          <span className={styles.label}>좋았던 점</span>
          <p className={styles.text}>{summary.pros}</p>
        </div>
      </div>
      <div className={styles.row}>
        <span className={styles.icon}>⚠️</span>
        <div>
          <span className={styles.label}>아쉬운 점</span>
          <p className={styles.text}>{summary.cons}</p>
        </div>
      </div>
      <div className={styles.row}>
        <span className={styles.icon}>📌</span>
        <div>
          <span className={styles.label}>주의사항</span>
          <p className={styles.text}>{summary.caution}</p>
        </div>
      </div>
    </div>
  );
}
