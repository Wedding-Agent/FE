import type { ChatMessage } from '@/types/chat';
import styles from './MessageBubble.module.css';

const SENDER_EMOJI: Record<string, string> = {
  planner: '📋',
  vendor:  '🏪',
  couple:  '💑',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function DateDivider({ date }: { date: string }) {
  return (
    <div className={styles.dateDivider} role="separator" aria-label={date}>
      <span className={styles.dateLine} aria-hidden="true" />
      <span className={styles.dateText}>{date}</span>
      <span className={styles.dateLine} aria-hidden="true" />
    </div>
  );
}

interface Props {
  message: ChatMessage;
  isMyMessage: boolean;
  showSenderName?: boolean;
}

export function MessageBubble({ message, isMyMessage, showSenderName }: Props) {
  if (message.type === 'SYSTEM' || !message.sender) {
    return (
      <div className={styles.row}>
        <div className={styles.bubble + ' ' + styles.bubbleSystem}>
          {message.content}
        </div>
      </div>
    );
  }

  const emoji = SENDER_EMOJI[message.sender.role] ?? '💬';
  const timeStr = formatTime(message.createdAt);
  const isDeleted = message.isSoftDeleted;

  return (
    <div className={`${styles.row} ${isMyMessage ? styles.rowMine : styles.rowOther}`}>
      {!isMyMessage && (
        <div className={styles.avatar} aria-hidden="true">{emoji}</div>
      )}

      <div className={`${styles.col} ${isMyMessage ? styles.colMine : styles.colOther}`}>
        {!isMyMessage && showSenderName && (
          <span className={styles.senderName}>{message.sender.nickname}</span>
        )}
        <div
          className={`${styles.bubble} ${isMyMessage ? styles.bubbleMine : styles.bubbleOther} ${isDeleted ? styles.deletedBubble : ''}`}
        >
          {isDeleted ? '삭제된 메시지입니다.' : message.content}
        </div>
        <span className={styles.meta}>{timeStr}</span>
      </div>
    </div>
  );
}
