'use client';

import { useState } from 'react';
import { ChevronDown, CloudRain, X } from 'lucide-react';
import type { VendorFilter } from '@/types/vendor';
import { ALL_REGIONS, ALL_STYLES } from '@/types/vendor';
import { cn } from '@/lib/cn';
import styles from './VendorFilterBar.module.css';

interface VendorFilterBarProps {
  filter:   VendorFilter;
  onChange: (filter: VendorFilter) => void;
}

const PRICE_OPTIONS: { label: string; value: number | undefined }[] = [
  { label: '전체 가격', value: undefined },
  { label: '100만원 이하', value: 1_000_000 },
  { label: '300만원 이하', value: 3_000_000 },
  { label: '1,000만원 이하', value: 10_000_000 },
  { label: '3,000만원 이하', value: 30_000_000 },
  { label: '5,000만원 이하', value: 50_000_000 },
];

export function VendorFilterBar({ filter, onChange }: VendorFilterBarProps) {
  const [open, setOpen] = useState(false);

  const activeCount = [
    filter.region,
    filter.maxPrice,
    filter.style,
    filter.minCapacity,
    filter.hasRainyPlan,
  ].filter(Boolean).length;

  const clear = () =>
    onChange({ ...filter, region: undefined, maxPrice: undefined, style: undefined, minCapacity: undefined, hasRainyPlan: undefined });

  return (
    <div className={styles.wrap}>
      {/* 필터 토글 버튼 */}
      <button
        type="button"
        className={cn(styles.filterBtn, open && styles.filterBtnOpen)}
        onClick={() => setOpen((v) => !v)}
      >
        <span>필터</span>
        {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
        <ChevronDown size={14} className={open ? styles.iconUp : styles.iconDown} />
      </button>

      {/* 활성 필터 칩 */}
      {filter.region && (
        <span className={styles.activeChip}>
          📍 {filter.region}
          <button type="button" onClick={() => onChange({ ...filter, region: undefined })} aria-label="지역 필터 제거"><X size={11} /></button>
        </span>
      )}
      {filter.maxPrice && (
        <span className={styles.activeChip}>
          💰 {(filter.maxPrice / 10_000).toLocaleString('ko-KR')}만원 이하
          <button type="button" onClick={() => onChange({ ...filter, maxPrice: undefined })} aria-label="가격 필터 제거"><X size={11} /></button>
        </span>
      )}
      {filter.style && (
        <span className={styles.activeChip}>
          ✨ {filter.style}
          <button type="button" onClick={() => onChange({ ...filter, style: undefined })} aria-label="스타일 필터 제거"><X size={11} /></button>
        </span>
      )}
      {filter.hasRainyPlan && (
        <span className={styles.activeChip}>
          🌂 우천 플랜
          <button type="button" onClick={() => onChange({ ...filter, hasRainyPlan: undefined })} aria-label="우천 플랜 필터 제거"><X size={11} /></button>
        </span>
      )}
      {activeCount > 0 && (
        <button type="button" className={styles.clearBtn} onClick={clear}>전체 초기화</button>
      )}

      {/* 드롭다운 패널 */}
      {open && (
        <div className={styles.panel}>
          {/* 지역 */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>지역</p>
            <div className={styles.chipRow}>
              <button
                type="button"
                className={cn(styles.optionChip, !filter.region && styles.optionActive)}
                onClick={() => onChange({ ...filter, region: undefined })}
              >전체</button>
              {ALL_REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={cn(styles.optionChip, filter.region === r && styles.optionActive)}
                  onClick={() => { onChange({ ...filter, region: r }); }}
                >{r}</button>
              ))}
            </div>
          </div>

          {/* 가격대 */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>최대 가격</p>
            <div className={styles.chipRow}>
              {PRICE_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className={cn(styles.optionChip, filter.maxPrice === opt.value && styles.optionActive)}
                  onClick={() => onChange({ ...filter, maxPrice: opt.value })}
                >{opt.label}</button>
              ))}
            </div>
          </div>

          {/* 스타일 */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>스타일</p>
            <div className={styles.chipRow}>
              <button
                type="button"
                className={cn(styles.optionChip, !filter.style && styles.optionActive)}
                onClick={() => onChange({ ...filter, style: undefined })}
              >전체</button>
              {ALL_STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={cn(styles.optionChip, filter.style === s && styles.optionActive)}
                  onClick={() => onChange({ ...filter, style: s })}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* 우천 플랜 */}
          <div className={styles.section}>
            <button
              type="button"
              className={cn(styles.rainyBtn, filter.hasRainyPlan && styles.rainyActive)}
              onClick={() => onChange({ ...filter, hasRainyPlan: filter.hasRainyPlan ? undefined : true })}
            >
              <CloudRain size={14} />
              우천 플랜 보유 업체만
            </button>
          </div>

          <button type="button" className={styles.applyBtn} onClick={() => setOpen(false)}>
            적용하기
          </button>
        </div>
      )}
    </div>
  );
}
