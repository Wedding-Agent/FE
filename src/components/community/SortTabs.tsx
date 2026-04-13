'use client';

import type { CommunitySort } from '@/types/community';
import styles from './SortTabs.module.css';

const SORT_OPTIONS: { value: CommunitySort; label: string }[] = [
  { value: 'LATEST',  label: '최신순' },
  { value: 'POPULAR', label: '인기순' },
];

interface SortTabsProps {
  value: CommunitySort;
  onChange: (sort: CommunitySort) => void;
}

export function SortTabs({ value, onChange }: SortTabsProps) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="정렬">
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          className={`${styles.tab} ${value === opt.value ? styles.active : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
