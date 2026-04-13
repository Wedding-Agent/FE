'use client';

import type { DocumentCategory } from '@/types/document';
import { CATEGORY_LABEL } from '@/types/document';
import styles from './CategoryTabs.module.css';

const TABS: Array<DocumentCategory | 'ALL'> = ['ALL', 'CONTRACT', 'RECEIPT', 'OTHER'];

interface Props {
  value: DocumentCategory | 'ALL';
  onChange: (cat: DocumentCategory | 'ALL') => void;
}

export function CategoryTabs({ value, onChange }: Props) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="문서 카테고리 필터">
      {TABS.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={value === cat}
          className={`${styles.tab} ${value === cat ? styles.active : ''}`}
          onClick={() => onChange(cat)}
        >
          {CATEGORY_LABEL[cat]}
        </button>
      ))}
    </div>
  );
}
