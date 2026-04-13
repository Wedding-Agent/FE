'use client';

import type { VendorType } from '@/types/vendor';
import { ALL_VENDOR_TYPES, VENDOR_TYPE_EMOJI, VENDOR_TYPE_LABEL } from '@/types/vendor';
import { cn } from '@/lib/cn';
import styles from './VendorTypeFilter.module.css';

interface VendorTypeFilterProps {
  selected: VendorType | null;
  onChange: (type: VendorType | null) => void;
}

export function VendorTypeFilter({ selected, onChange }: VendorTypeFilterProps) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="업체 카테고리">
      <button
        type="button"
        role="tab"
        aria-selected={selected === null}
        className={cn(styles.chip, selected === null && styles.active)}
        onClick={() => onChange(null)}
      >
        전체
      </button>
      {ALL_VENDOR_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          role="tab"
          aria-selected={selected === type}
          className={cn(styles.chip, selected === type && styles.active)}
          onClick={() => onChange(type)}
        >
          <span aria-hidden="true">{VENDOR_TYPE_EMOJI[type]}</span>
          {VENDOR_TYPE_LABEL[type]}
        </button>
      ))}
    </div>
  );
}
