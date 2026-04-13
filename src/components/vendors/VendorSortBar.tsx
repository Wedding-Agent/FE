'use client';

import type { VendorSort } from '@/types/vendor';
import { VENDOR_SORT_LABEL } from '@/types/vendor';
import { cn } from '@/lib/cn';
import styles from './VendorSortBar.module.css';

const SORT_OPTIONS: VendorSort[] = ['recommended', 'rating', 'price_asc', 'price_desc'];

interface VendorSortBarProps {
  value:    VendorSort;
  onChange: (sort: VendorSort) => void;
}

export function VendorSortBar({ value, onChange }: VendorSortBarProps) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="정렬 기준">
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          role="tab"
          aria-selected={value === opt}
          className={cn(styles.tab, value === opt && styles.active)}
          onClick={() => onChange(opt)}
        >
          {VENDOR_SORT_LABEL[opt]}
        </button>
      ))}
    </div>
  );
}
