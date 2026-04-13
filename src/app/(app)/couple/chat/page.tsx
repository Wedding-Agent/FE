'use client';

import { useRouter } from 'next/navigation';
import { ChatRoomListItem } from '@/components/chat/ChatRoomListItem';
import { useChatRooms } from '@/features/chat/hooks';
import styles from './page.module.css';

export default function ChatListPage() {
  const router = useRouter();
  const { data, isError, refetch } = useChatRooms();
  const rooms = data?.rooms ?? [];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>채팅</h1>
            <p className={styles.subTitle}>플래너·업체와의 대화</p>
          </div>
          <button
            type="button"
            className={styles.newChatBtn}
            onClick={() => router.push('/couple/chat/new')}
            aria-label="새 대화 시작"
            title="새 대화"
          >
            +
          </button>
        </header>

        {isError ? (
          <div className={styles.errorWrap}>
            <p className={styles.errorText}>채팅 목록을 불러오지 못했어요.</p>
            <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        ) : rooms.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>💬</div>
            <p className={styles.emptyTitle}>아직 대화가 없어요</p>
            <p className={styles.emptyDesc}>
              플래너나 업체와 새 대화를 시작해보세요
            </p>
            <button
              type="button"
              className={styles.emptyStartBtn}
              onClick={() => router.push('/couple/chat/new')}
            >
              새 대화 시작하기
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {rooms.map((room) => (
              <ChatRoomListItem key={room.roomId} room={room} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
