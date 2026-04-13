'use client';

import { Heart, Pencil, Trash2 } from 'lucide-react';
import type { StoryEntry } from '@/types/story';
import { MILESTONE_COLOR, MILESTONE_EMOJI, MILESTONE_LABEL, formatStoryDate } from '@/types/story';
import { cn } from '@/lib/cn';
import styles from './StoryCard.module.css';

interface StoryCardProps {
  entry:    StoryEntry;
  onLike:   (id: string) => void;
  onEdit:   (entry: StoryEntry) => void;
  onDelete: (id: string) => void;
}

export function StoryCard({ entry, onLike, onEdit, onDelete }: StoryCardProps) {
  return (
    <article
      className={styles.card}
      style={{ borderLeftColor: MILESTONE_COLOR[entry.milestone] }}
    >
      {/* 헤더: 날짜 + 마일스톤 */}
      <div className={styles.headerRow}>
        <span className={styles.dateChip}>{formatStoryDate(entry.date)}</span>
        <span
          className={styles.milestoneChip}
          style={{
            background: `${MILESTONE_COLOR[entry.milestone]}18`,
            color:       MILESTONE_COLOR[entry.milestone],
          }}
        >
          {MILESTONE_EMOJI[entry.milestone]} {MILESTONE_LABEL[entry.milestone]}
        </span>
      </div>

      {/* 이모지 */}
      <div className={styles.emoji} aria-hidden="true">
        {MILESTONE_EMOJI[entry.milestone]}
      </div>

      {/* 제목 */}
      <h3 className={styles.title}>{entry.title}</h3>

      {/* 내용 (3줄 클램프) */}
      <p className={styles.content}>{entry.content}</p>

      {/* 푸터: 좋아요 + 수정/삭제 */}
      <div className={styles.footerRow}>
        <button
          type="button"
          className={cn(styles.likeBtn, entry.liked && styles.liked)}
          onClick={() => onLike(entry.id)}
          aria-label={entry.liked ? '좋아요 취소' : '좋아요'}
          aria-pressed={entry.liked}
        >
          <Heart
            size={15}
            fill={entry.liked ? '#f43f5e' : 'none'}
            color={entry.liked ? '#f43f5e' : 'rgba(50,50,70,0.35)'}
          />
        </button>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onEdit(entry)}
            aria-label="수정"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onDelete(entry.id)}
            aria-label="삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
