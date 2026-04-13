'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ALL_BUDGET_CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatKRW,
  type BudgetCategory,
  type BudgetPlan,
} from '@/types/budget';
import styles from './modal.module.css';
import localStyles from './SetBudgetModal.module.css';

interface SetBudgetModalProps {
  open: boolean;
  onClose: () => void;
  currentPlan: BudgetPlan;
  onSubmit: (plan: BudgetPlan) => void;
  isPending: boolean;
}

type CategoryAmounts = Record<BudgetCategory, string>;

function planToAmounts(plan: BudgetPlan): CategoryAmounts {
  const base = Object.fromEntries(
    ALL_BUDGET_CATEGORIES.map((c) => [c, '']),
  ) as CategoryAmounts;
  plan.categoryBudgets.forEach((cb) => {
    base[cb.category] = cb.planned > 0 ? cb.planned.toLocaleString('ko-KR') : '';
  });
  return base;
}

export function SetBudgetModal({
  open,
  onClose,
  currentPlan,
  onSubmit,
  isPending,
}: SetBudgetModalProps) {
  const [totalBudget, setTotalBudget] = useState('');
  const [amounts, setAmounts] = useState<CategoryAmounts>(() => planToAmounts(currentPlan));

  useEffect(() => {
    if (open) {
      setTotalBudget(
        currentPlan.totalBudget > 0
          ? currentPlan.totalBudget.toLocaleString('ko-KR')
          : '',
      );
      setAmounts(planToAmounts(currentPlan));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, currentPlan]);

  const parseNum = (s: string) => parseInt(s.replace(/,/g, ''), 10) || 0;
  const formatInput = (s: string) => {
    const n = parseInt(s.replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? '' : n.toLocaleString('ko-KR');
  };

  const categoryTotal = useMemo(
    () => ALL_BUDGET_CATEGORIES.reduce((sum, cat) => sum + parseNum(amounts[cat]), 0),
    [amounts],
  );

  const total = parseNum(totalBudget);
  const isOver = categoryTotal > total && total > 0;

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plan: BudgetPlan = {
      totalBudget: total,
      categoryBudgets: ALL_BUDGET_CATEGORIES.map((cat) => ({
        category: cat,
        planned: parseNum(amounts[cat]),
      })).filter((cb) => cb.planned > 0),
    };
    onSubmit(plan);
  };

  return createPortal(
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="예산 설정">
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>예산 설정</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Total budget */}
          <div className={styles.field}>
            <label className={styles.label}>총 예산 (원) *</label>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              placeholder="예: 30,000,000"
              value={totalBudget}
              onChange={(e) =>
                setTotalBudget(formatInput(e.target.value))
              }
              required
            />
          </div>

          {/* Category budgets */}
          <p className={localStyles.sectionTitle}>카테고리별 예산 (선택)</p>
          <div className={localStyles.catGrid}>
            {ALL_BUDGET_CATEGORIES.map((cat) => (
              <div key={cat} className={localStyles.catRow}>
                <span className={localStyles.catLabel}>
                  {CATEGORY_EMOJI[cat]} {CATEGORY_LABEL[cat]}
                </span>
                <input
                  className={`${styles.input} ${localStyles.catInput}`}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={amounts[cat]}
                  onChange={(e) => {
                    const val = formatInput(e.target.value);
                    setAmounts((prev) => ({ ...prev, [cat]: val }));
                  }}
                />
              </div>
            ))}
          </div>

          {/* Running total */}
          <div className={`${localStyles.summary} ${isOver ? localStyles.summaryOver : ''}`}>
            <span>카테고리 합계</span>
            <span>
              {formatKRW(categoryTotal)}
              {total > 0 && ` / ${formatKRW(total)}`}
            </span>
          </div>
          {isOver && (
            <p className={localStyles.overWarn}>
              ⚠️ 카테고리 합계가 총 예산을 초과했습니다.
            </p>
          )}

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending ? '저장 중…' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
