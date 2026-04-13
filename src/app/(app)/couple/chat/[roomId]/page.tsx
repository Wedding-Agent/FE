'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatInput } from '@/components/chat/ChatInput';
import { DateDivider, MessageBubble } from '@/components/chat/MessageBubble';
import { useChatMessages, useChatRooms, usePatchLastRead, useSendMessage } from '@/features/chat/hooks';
import { getMyUserId } from '@/features/chat/api';
import type { ChatMessage } from '@/types/chat';
import styles from './page.module.css';

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

function groupByDate(messages: ChatMessage[]): Array<{ date: string; messages: ChatMessage[] }> {
  const map = new Map<string, ChatMessage[]>();
  messages.forEach((msg) => {
    const d = new Date(msg.createdAt);
    const key = d.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
    });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(msg);
  });
  return Array.from(map.entries()).map(([date, messages]) => ({ date, messages }));
}

export default function ChatRoomPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId ?? '';
  const router = useRouter();
  const myId = getMyUserId();

  const { data: roomsData } = useChatRooms();
  const room = roomsData?.rooms.find((r) => r.roomId === roomId);

  const { data: msgData, isLoading, isError } = useChatMessages(roomId);
  const sendMutation = useSendMessage(roomId);
  const patchRead = usePatchLastRead(roomId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 낙관적 업데이트: 서버 응답 전에 메시지를 먼저 표시
  const [optimisticExtra, setOptimisticExtra] = useState<ChatMessage[]>([]);
  const optimisticMessages = [...(msgData?.messages ?? []), ...optimisticExtra];

  // 입장 시 읽음 처리
  useEffect(() => {
    patchRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // 메시지 로드/업데이트 후 스크롤 맨 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [msgData]);

  // 서버에서 새 데이터 오면 낙관적 메시지 제거
  useEffect(() => {
    if (optimisticExtra.length > 0) setOptimisticExtra([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgData?.messages?.length]);

  const handleSend = (content: string) => {
    const optimistic: ChatMessage = {
      messageId: `opt-${Date.now()}`,
      roomId,
      sender: { userId: myId, nickname: '나', role: 'couple' },
      type: 'TEXT',
      content,
      status: 'SENDING',
      createdAt: new Date().toISOString(),
    };
    setOptimisticExtra((prev) => [...prev, optimistic]);
    sendMutation.mutate(content);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const grouped = groupByDate(optimisticMessages);
  const partnerRole = room?.partnerRole ?? 'planner';
  const emoji = PARTNER_EMOJI[partnerRole] ?? '💬';

  return (
    <div className={styles.layout}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.push('/couple/chat')}
          aria-label="채팅 목록으로"
        >
          ←
        </button>
        <div className={styles.headerAvatar} aria-hidden="true">{emoji}</div>
        <div className={styles.headerInfo}>
          <p className={styles.headerName}>{room?.title ?? '채팅'}</p>
          {partnerRole && (
            <p className={styles.headerRole}>{ROLE_LABEL[partnerRole] ?? ''}</p>
          )}
        </div>
      </div>

      {/* 메시지 목록 */}
      {isLoading ? (
        <div className={styles.centerState}>
          <div className={styles.spinner} aria-label="로딩 중" />
        </div>
      ) : isError ? (
        <div className={styles.centerState}>
          <p className={styles.errorText}>메시지를 불러오지 못했어요.</p>
        </div>
      ) : (
        <div ref={listRef} className={styles.messageList} role="log" aria-live="polite" aria-label="메시지 목록">
          {grouped.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(50,50,70,.45)', fontSize: 13, marginTop: 32 }}>
              첫 메시지를 보내보세요 👋
            </div>
          )}

          {grouped.map(({ date, messages }) => (
            <div key={date}>
              <DateDivider date={date} />
              {messages.map((msg, idx) => {
                const isMe = msg.sender?.userId === myId;
                const prev = messages[idx - 1];
                const showSenderName =
                  !isMe && (!prev || prev.sender?.userId !== msg.sender?.userId);
                return (
                  <MessageBubble
                    key={msg.messageId}
                    message={msg}
                    isMyMessage={isMe}
                    showSenderName={showSenderName}
                  />
                );
              })}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 스크롤 아래로 버튼 */}
      <button
        type="button"
        className={styles.scrollToBottom}
        onClick={scrollToBottom}
        aria-label="최신 메시지로 이동"
        title="최신 메시지로"
      >
        ↓
      </button>

      {/* 입력창 */}
      <div className={styles.inputWrap}>
        <ChatInput
          onSend={handleSend}
          disabled={sendMutation.isPending}
          placeholder="메시지를 입력하세요"
        />
      </div>
    </div>
  );
}
