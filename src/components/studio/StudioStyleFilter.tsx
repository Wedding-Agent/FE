'use client';

import type { VendorStyle } from '@/types/vendor';
import { ALL_STYLES } from '@/types/vendor';
import { cn } from '@/lib/cn';
import styles from './StudioStyleFilter.module.css';

const STYLE_EMOJI: Record<VendorStyle, string> = {
  '자연':  '🌿',
  '모던':  '🏙️',
  '클래식': '🎞️',
  '럭셔리': '💎',
};

interface StudioStyleFilterProps {
  selected: VendorStyle | null;
  onChange: (s: VendorStyle | null) => void;
}

export function StudioStyleFilter({ selected, onChange }: StudioStyleFilterProps) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="스튜디오 스타일 필터">
      <button
        type="button"
        role="tab"
        aria-selected={selected === null}
        className={cn(styles.chip, selected === null && styles.active)}
        onClick={() => onChange(null)}
      >
        전체
      </button>
      {ALL_STYLES.map((style) => (
        <button
          key={style}
          type="button"
          role="tab"
          aria-selected={selected === style}
          className={cn(styles.chip, selected === style && styles.active)}
          onClick={() => onChange(style)}
        >
          <span aria-hidden="true">{STYLE_EMOJI[style]}</span>
          {style}
        </button>
      ))}
    </div>
  );
}
