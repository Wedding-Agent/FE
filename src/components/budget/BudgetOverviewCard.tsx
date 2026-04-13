'use client';

import { Settings } from 'lucide-react';
import type { BudgetSummary } from '@/types/budget';
import {
  formatKRW,
  formatPct,
  getUsageLevel,
  USAGE_LEVEL_BG,
  USAGE_LEVEL_COLOR,
  USAGE_LEVEL_LABEL,
} from '@/types/budget';
import { BudgetProgressBar } from './BudgetProgressBar';
import styles from './BudgetOverviewCard.module.css';

interface BudgetOverviewCardProps {
  summary: BudgetSummary;
  onEditBudget: () => void;
}

export function BudgetOverviewCard({ summary, onEditBudget }: BudgetOverviewCardProps) {
  const { plan, totalSpent } = summary;
  const { totalBudget } = plan;
  const remaining = Math.max(0, totalBudget - totalSpent);
  const level = getUsageLevel(totalSpent, totalBudget);
  const color = USAGE_LEVEL_COLOR[level];
  const bg = USAGE_LEVEL_BG[level];
  const pct = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0';

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>총 예산 현황</h2>
          <p className={styles.sub}>웨딩 전체 예산 대비 지출 현황</p>
        </div>
        <button
          type="button"
          className={styles.editBtn}
          onClick={onEditBudget}
          aria-label="예산 설정"
        >
          <Settings size={16} />
          예산 설정
        </button>
      </div>

      <div className={styles.amounts}>
        <div className={styles.amountMain}>
          <span className={styles.amountLabel}>사용 금액</span>
          <span className={styles.amountValue} style={{ color }}>
            {formatKRW(totalSpent)}
          </span>
        </div>
        <div className={styles.amountDivider} />
        <div className={styles.amountSub}>
          <div>
            <span className={styles.amountLabel}>총 예산</span>
            <span className={styles.amountSmall}>{formatKRW(totalBudget)}</span>
          </div>
          <div>
            <span className={styles.amountLabel}>잔여 예산</span>
            <span className={styles.amountSmall}>{formatKRW(remaining)}</span>
          </div>
        </div>
      </div>

      <div className={styles.barWrap}>
        <BudgetProgressBar spent={totalSpent} planned={totalBudget} height={16} animated />
        <div className={styles.barMeta}>
          <span className={styles.pctBadge} style={{ background: bg, color }}>
            {USAGE_LEVEL_LABEL[level]}
          </span>
          <span className={styles.pctText} style={{ color }}>
            {pct}% 사용
          </span>
        </div>
      </div>
    </section>
  );
}
