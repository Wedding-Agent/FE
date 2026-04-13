'use client';

import type { PlannerCustomer, PlannerFilterType, PlannerVendorContact } from '@/types/planner-calendar';
import styles from './PlannerFilterBar.module.css';

interface PlannerFilterBarProps {
  filterType:   PlannerFilterType;
  onFilterType: (t: PlannerFilterType) => void;
  customers:    PlannerCustomer[];
  vendors:      PlannerVendorContact[];
  selectedId:   string | null;
  onSelectId:   (id: string | null) => void;
}

const TABS: { key: PlannerFilterType; label: string }[] = [
  { key: 'all',      label: '전체' },
  { key: 'customer', label: '고객별' },
  { key: 'vendor',   label: '업체별' },
];

export function PlannerFilterBar({
  filterType,
  onFilterType,
  customers,
  vendors,
  selectedId,
  onSelectId,
}: PlannerFilterBarProps) {
  const showChips = filterType !== 'all';

  return (
    <div className={styles.bar}>
      {/* 탭 행 */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={[styles.tab, filterType === t.key && styles.tabActive]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onFilterType(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 칩 행 */}
      {showChips && (
        <div className={styles.chips}>
          {filterType === 'customer' &&
            customers.map((c) => {
              const isActive = selectedId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={[styles.chip, isActive && styles.chipActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onSelectId(isActive ? null : c.id)}
                >
                  <span
                    className={styles.dot}
                    style={{ background: isActive ? '#fff' : c.color }}
                    aria-hidden="true"
                  />
                  {c.name}
                </button>
              );
            })}

          {filterType === 'vendor' &&
            vendors.map((v) => {
              const isActive = selectedId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={[styles.chip, isActive && styles.chipActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onSelectId(isActive ? null : v.id)}
                >
                  <span
                    className={styles.dot}
                    style={{ background: isActive ? '#fff' : v.color }}
                    aria-hidden="true"
                  />
                  {v.name}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
