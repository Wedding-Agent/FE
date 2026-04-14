'use client';

import { Copy, Pencil, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import type { Promotion } from '@/types/promotions';
import {
  PROMOTION_CHANNEL_LABEL,
  PROMOTION_CHANNEL_EMOJI,
  PROMOTION_CATEGORY_LABEL,
} from '@/types/promotions';
import styles from './PromotionCard.module.css';

interface Props {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'short', day: 'numeric',
  });
}

export function PromotionCard({ promotion, onEdit, onDelete }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promotion.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: textarea select
      const ta = document.createElement('textarea');
      ta.value = promotion.content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className={styles.card}>
      {/* 상단: 채널 + 카테고리 + 날짜 */}
      <div className={styles.top}>
        <div className={styles.chips}>
          <span className={styles.channelChip}>
            {PROMOTION_CHANNEL_EMOJI[promotion.channel]}{' '}
            {PROMOTION_CHANNEL_LABEL[promotion.channel]}
          </span>
          <span className={styles.categoryChip}>
            {PROMOTION_CATEGORY_LABEL[promotion.category]}
          </span>
        </div>
        <span className={styles.date}>{formatDate(promotion.updatedAt)}</span>
      </div>

      {/* 제목 */}
      <p className={styles.title}>{promotion.title}</p>

      {/* 본문 미리보기 */}
      <p className={styles.preview}>{promotion.content}</p>

      {/* 하단 액션 버튼 */}
      <div className={styles.actions}>
        <button
          type="button"
          className={[styles.actionBtn, styles.copyBtn, copied && styles.copiedBtn]
            .filter(Boolean)
            .join(' ')}
          onClick={handleCopy}
          aria-label="복사"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? '복사됨' : '복사'}
        </button>
        <button
          type="button"
          className={[styles.actionBtn, styles.editBtn].join(' ')}
          onClick={() => onEdit(promotion)}
          aria-label="수정"
        >
          <Pencil size={14} />
          수정
        </button>
        <button
          type="button"
          className={[styles.actionBtn, styles.deleteBtn].join(' ')}
          onClick={() => {
            if (confirm('홍보 멘트를 삭제할까요?')) onDelete(promotion.id);
          }}
          aria-label="삭제"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}
