'use client';

import {
  ALL_BUDGET_CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatKRW,
  formatPct,
  getUsageLevel,
  USAGE_LEVEL_COLOR,
  type BudgetSummary,
} from '@/types/budget';
import { BudgetProgressBar } from './BudgetProgressBar';
import styles from './CategoryBudgetList.module.css';

interface CategoryBudgetListProps {
  summary: BudgetSummary;
}

export function CategoryBudgetList({ summary }: CategoryBudgetListProps) {
  const plannedMap = Object.fromEntries(
    summary.plan.categoryBudgets.map((c) => [c.category, c.planned]),
  );
  const spentMap = Object.fromEntries(
    summary.spentByCategory.map((c) => [c.category, c.spent]),
  );

  // Only show categories that have either a plan or spending
  const visible = ALL_BUDGET_CATEGORIES.filter(
    (cat) => (plannedMap[cat] ?? 0) > 0 || (spentMap[cat] ?? 0) > 0,
  );

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>카테고리별 현황</h2>
      <div className={styles.list}>
        {visible.map((cat) => {
          const planned = plannedMap[cat] ?? 0;
          const spent = spentMap[cat] ?? 0;
          const level = getUsageLevel(spent, planned);
          const color = USAGE_LEVEL_COLOR[level];

          return (
            <div key={cat} className={styles.row}>
              <div className={styles.rowLeft}>
                <span className={styles.emoji} aria-hidden="true">
                  {CATEGORY_EMOJI[cat]}
                </span>
                <span className={styles.catLabel}>{CATEGORY_LABEL[cat]}</span>
              </div>
              <div className={styles.rowBar}>
                <BudgetProgressBar spent={spent} planned={planned} height={7} animated />
              </div>
              <div className={styles.rowRight}>
                <span className={styles.spent} style={{ color }}>
                  {formatKRW(spent)}
                </span>
                <span className={styles.planned}>/ {planned > 0 ? formatKRW(planned) : '미설정'}</span>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className={styles.empty}>카테고리별 예산을 설정해 주세요.</p>
        )}
      </div>
    </section>
  );
}
