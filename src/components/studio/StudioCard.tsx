'use client';

import { Heart } from 'lucide-react';
import type { Vendor } from '@/types/vendor';
import {
  formatPriceRange,
  getTrustBadge,
  VENDOR_THUMBNAIL_GRADIENT,
  VENDOR_TYPE_EMOJI,
} from '@/types/vendor';
import { cn } from '@/lib/cn';
import styles from './StudioCard.module.css';

interface StudioCardProps {
  vendor:  Vendor;
  wished:  boolean;
  onWish:  (id: number) => void;
  onClick: (id: number) => void;
}

export function StudioCard({ vendor, wished, onWish, onClick }: StudioCardProps) {
  const trust = getTrustBadge(vendor.trustScore);

  return (
    <article
      className={styles.card}
      onClick={() => onClick(vendor.vendor_id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(vendor.vendor_id)}
      aria-label={`${vendor.name} 상세보기`}
    >
      {/* 찜 버튼 — thumbnail 위에 absolute */}
      <button
        type="button"
        className={cn(styles.wishBtn, wished && styles.wished)}
        onClick={(e) => { e.stopPropagation(); onWish(vendor.vendor_id); }}
        aria-label={wished ? '찜 취소' : '찜하기'}
        aria-pressed={wished}
      >
        <Heart size={14} fill={wished ? '#fb7185' : 'none'} />
      </button>

      {/* 썸네일 */}
      <div
        className={styles.thumbnail}
        style={{ background: VENDOR_THUMBNAIL_GRADIENT[vendor.category] }}
        aria-hidden="true"
      >
        <span className={styles.thumbnailEmoji}>{VENDOR_TYPE_EMOJI[vendor.category]}</span>
        {vendor.hasRainyPlan && (
          <span className={styles.rainyBadge} title="우천 플랜 보유">🌂</span>
        )}
      </div>

      {/* 본문 */}
      <div className={styles.body}>
        <h3 className={styles.name}>{vendor.name}</h3>

        <p className={styles.meta}>
          <span>📍 {vendor.region}</span>
          <span className={styles.dot}>·</span>
          <span>{formatPriceRange(vendor.price_range)}</span>
        </p>

        {vendor.tags.length > 0 && (
          <div className={styles.tags}>
            {vendor.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className={styles.ratingRow}>
          <span className={styles.star}>★</span>
          <span className={styles.ratingNum}>{vendor.rating.toFixed(1)}</span>
          <span
            className={styles.trustChip}
            style={{ background: `${trust.color}18`, color: trust.color }}
          >
            {trust.label}
          </span>
        </div>
      </div>
    </article>
  );
}
