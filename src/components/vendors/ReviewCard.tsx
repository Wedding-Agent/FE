'use client';

import type { VendorReview } from '@/types/vendor';
import { SENTIMENT_EMOJI } from '@/types/vendor';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
  review: VendorReview;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.sentiment} aria-label={review.sentiment}>
          {SENTIMENT_EMOJI[review.sentiment]}
        </span>
        <div className={styles.stars} aria-label={`평점 ${review.rating}점`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < review.rating ? styles.starFull : styles.starEmpty}>★</span>
          ))}
        </div>
        <span className={styles.author}>{review.author}</span>
        <span className={styles.date}>{formatDate(review.createdAt)}</span>
      </div>
      <p className={styles.content}>{review.content}</p>
      {review.tags.length > 0 && (
        <div className={styles.tags}>
          {review.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
