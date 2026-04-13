'use client';

import { useRouter } from 'next/navigation';
import type { ChatRoom } from '@/types/chat';
import styles from './ChatRoomListItem.module.css';

const PARTNER_EMOJI: Record<string, string> = {
  planner: '📋',
  vendor:  '🏪',
  couple:  '💑',
};

const ROLE_LABEL: Record<string, string> = {
  planner: '플래너',
  vendor:  '업체',
  couple:  '커플',
};

function formatTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}시간 전`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}일 전`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

interface Props {
  room:      ChatRoom;
  basePath?: string;
}

export function ChatRoomListItem({ room, basePath = '/couple/chat' }: Props) {
  const router = useRouter();
  const emoji = PARTNER_EMOJI[room.partnerRole ?? ''] ?? '💬';
  const roleLabel = room.partnerRole ? ROLE_LABEL[room.partnerRole] : null;

  return (
    <button
      type="button"
      className={styles.item}
      onClick={() => router.push(`${basePath}/${room.roomId}`)}
      aria-label={`${room.title} 채팅방`}
    >
      <div className={styles.avatar} aria-hidden="true">{emoji}</div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{room.title}</span>
          <span className={styles.time}>{formatTime(room.lastMessageAt)}</span>
        </div>
        <div className={styles.previewRow}>
          <span className={styles.preview}>
            {room.lastMessageContent ?? '대화를 시작해보세요'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {roleLabel && (
              <span className={`${styles.rolePill} ${styles[`role-${room.partnerRole}`]}`}>
                {roleLabel}
              </span>
            )}
            {room.unreadCount > 0 && (
              <span className={styles.badge} aria-label={`읽지 않은 메시지 ${room.unreadCount}개`}>
                {room.unreadCount > 99 ? '99+' : room.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
