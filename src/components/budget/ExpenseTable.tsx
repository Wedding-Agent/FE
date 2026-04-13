'use client';

import { useState } from 'react';
import { Trash2, Paperclip, AlertTriangle } from 'lucide-react';
import {
  ALL_BUDGET_CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatKRW,
  type BudgetCategory,
  type BudgetItem,
} from '@/types/budget';
import styles from './ExpenseTable.module.css';

type SortField = 'date' | 'amount';
type SortDir = 'asc' | 'desc';

type CategoryFilter = BudgetCategory | 'ALL';

const TABS: { value: CategoryFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  ...ALL_BUDGET_CATEGORIES.map((cat) => ({
    value: cat as CategoryFilter,
    label: `${CATEGORY_EMOJI[cat]} ${CATEGORY_LABEL[cat]}`,
  })),
];

interface ExpenseTableProps {
  items: BudgetItem[];
  onDelete: (id: string) => void;
  isPendingDelete: boolean;
}

export function ExpenseTable({ items, onDelete, isPendingDelete }: ExpenseTableProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered =
    activeCategory === 'ALL' ? items : items.filter((i) => i.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'date') return (a.date < b.date ? -1 : 1) * dir;
    return (a.amount - b.amount) * dir;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.wrap}>
      {/* Category filter tabs */}
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={activeCategory === tab.value}
            className={`${styles.tab} ${activeCategory === tab.value ? styles.tabActive : ''}`}
            onClick={() => setActiveCategory(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className={styles.empty}>
          <p>지출 내역이 없습니다.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    className={styles.sortBtn}
                    onClick={() => handleSort('date')}
                  >
                    날짜 {sortIcon('date')}
                  </button>
                </th>
                <th>카테고리</th>
                <th>내용</th>
                <th>
                  <button
                    type="button"
                    className={styles.sortBtn}
                    onClick={() => handleSort('amount')}
                  >
                    금액 {sortIcon('amount')}
                  </button>
                </th>
                <th>비고</th>
                <th aria-label="삭제" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr
                  key={item.id}
                  className={item.isUnexpected ? styles.unexpectedRow : ''}
                >
                  <td className={styles.dateCell}>{item.date}</td>
                  <td>
                    <span className={styles.catBadge}>
                      {CATEGORY_EMOJI[item.category]} {CATEGORY_LABEL[item.category]}
                    </span>
                  </td>
                  <td className={styles.labelCell}>
                    <span className={styles.labelText}>{item.label}</span>
                    {item.isUnexpected && (
                      <AlertTriangle
                        size={13}
                        className={styles.unexpectedIcon}
                        aria-label="예상치 못한 지출"
                      />
                    )}
                    {item.documentId && (
                      <Paperclip
                        size={13}
                        className={styles.paperclipIcon}
                        aria-label="문서 연동됨"
                      />
                    )}
                  </td>
                  <td className={styles.amountCell}>{formatKRW(item.amount)}</td>
                  <td className={styles.noteCell}>{item.note ?? '—'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => onDelete(item.id)}
                      disabled={isPendingDelete}
                      aria-label={`${item.label} 삭제`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
