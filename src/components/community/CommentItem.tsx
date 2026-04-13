'use client';

import { Trash2 } from 'lucide-react';
import { formatRelativeTime, type CommunityComment } from '@/types/community';
import styles from './CommentItem.module.css';

interface CommentItemProps {
  comment: CommunityComment;
  onDelete: (commentId: string) => void;
  isPending: boolean;
}

export function CommentItem({ comment, onDelete, isPending }: CommentItemProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.emoji} aria-hidden="true">
          {comment.author.profileEmoji}
        </span>
        <span className={styles.nickname}>{comment.author.nickname}</span>
        <span className={styles.time}>{formatRelativeTime(comment.createdAt)}</span>
        {comment.isOwner && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDelete(comment.commentId)}
            disabled={isPending}
            aria-label="댓글 삭제"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
      <p className={styles.content}>{comment.content}</p>
    </div>
  );
}
