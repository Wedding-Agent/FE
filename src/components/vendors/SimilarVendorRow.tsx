'use client';

import type { Vendor } from '@/types/vendor';
import { formatPriceRange, VENDOR_THUMBNAIL_GRADIENT, VENDOR_TYPE_EMOJI } from '@/types/vendor';
import styles from './SimilarVendorRow.module.css';

interface SimilarVendorRowProps {
  vendors:  Vendor[];
  onSelect: (id: number) => void;
}

export function SimilarVendorRow({ vendors, onSelect }: SimilarVendorRowProps) {
  if (vendors.length === 0) return null;

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>비슷한 업체</h3>
      <div className={styles.scroll}>
        {vendors.map((v) => (
          <button
            key={v.vendor_id}
            type="button"
            className={styles.card}
            onClick={() => onSelect(v.vendor_id)}
          >
            <div
              className={styles.thumbnail}
              style={{ background: VENDOR_THUMBNAIL_GRADIENT[v.category] }}
              aria-hidden="true"
            >
              <span className={styles.emoji}>{VENDOR_TYPE_EMOJI[v.category]}</span>
            </div>
            <p className={styles.name}>{v.name}</p>
            <p className={styles.region}>📍 {v.region}</p>
            <div className={styles.rating}>
              <span className={styles.star}>★</span>
              <span>{v.rating.toFixed(1)}</span>
            </div>
            <p className={styles.price}>{formatPriceRange(v.price_range)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
