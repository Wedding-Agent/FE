'use client';

import { useRouter } from 'next/navigation';
import type { Notification } from '@/types/notification';
import styles from './NotificationItem.module.css';

const CATEGORY_ICON: Record<string, string> = {
  CHAT:       '💬',
  INVITATION: '💌',
  DOCUMENT:   '📄',
  SYSTEM:     '📢',
};

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return '방금';
  if (mins  < 60) return `${mins}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days  < 7)  return `${days}일 전`;
  return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

interface Props {
  notification: Notification;
}

export function NotificationItem({ notification }: Props) {
  const router = useRouter();
  const { category, content, createdAt, isRead, targetPath } = notification;

  const handleClick = () => {
    router.push(targetPath);
  };

  return (
    <button
      type="button"
      className={`${styles.item} ${isRead ? styles.read : styles.unread}`}
      onClick={handleClick}
    >
      <div className={styles.iconWrap}>
        <span className={styles.icon} aria-hidden="true">
          {CATEGORY_ICON[category] ?? '🔔'}
        </span>
      </div>
      <div className={styles.body}>
        <p className={styles.content}>{content}</p>
        <p className={styles.time}>{formatTime(createdAt)}</p>
      </div>
      {!isRead && <span className={styles.dot} aria-label="읽지 않음" />}
    </button>
  );
}
