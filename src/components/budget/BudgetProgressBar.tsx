'use client';

import { getUsageLevel, USAGE_LEVEL_COLOR } from '@/types/budget';
import styles from './BudgetProgressBar.module.css';

interface BudgetProgressBarProps {
  spent: number;
  planned: number;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export function BudgetProgressBar({
  spent,
  planned,
  height = 10,
  showLabel = false,
  animated = true,
}: BudgetProgressBarProps) {
  const pct = planned > 0 ? Math.min((spent / planned) * 100, 100) : 0;
  const level = getUsageLevel(spent, planned);
  const color = USAGE_LEVEL_COLOR[level];

  return (
    <div className={styles.wrap}>
      <div
        className={styles.track}
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${styles.fill} ${animated ? styles.animated : ''}`}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span className={styles.label} style={{ color }}>
          {planned > 0 ? `${pct.toFixed(1)}%` : '미설정'}
        </span>
      )}
    </div>
  );
}
