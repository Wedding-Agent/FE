'use client';

import { useEffect, useRef } from 'react';
import { useAIChat } from '@/features/ai/hooks';
import { MessageBubble } from '@/components/ai/MessageBubble';
import { QuickActions } from '@/components/ai/QuickActions';
import { ChatInput } from '@/components/ai/ChatInput';
// couple/ai와 동일한 레이아웃·스타일 재사용
import styles from '@/app/(app)/couple/ai/page.module.css';

export default function PlannerAIPage() {
  const { messages, isStreaming, sendMessage, stopStream, clearHistory } = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const showQuickActions = messages.length <= 1;

  const handleClear = () => {
    if (!confirm('대화 내역을 초기화할까요?')) return;
    clearHistory();
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.headerEmoji} aria-hidden="true">📋</span>
          <div className={styles.headerText}>
            <p className={styles.headerName}>AI 플래너 비서</p>
            <p className={styles.headerSub}>업무 자동화를 도와드려요</p>
          </div>
        </div>
        {messages.length > 1 && (
          <button type="button" className={styles.clearBtn} onClick={handleClear}>
            초기화
          </button>
        )}
      </header>

      <div className={styles.scroll} ref={scrollRef}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {showQuickActions && (
          <div className={styles.quickWrap}>
            <QuickActions onSelect={sendMessage} disabled={isStreaming} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        {isStreaming && (
          <div className={styles.streamingLabel}>
            <span className={styles.streamingDot} aria-hidden="true" />
            AI 플래너 비서가 답변 중이에요...
          </div>
        )}
        <ChatInput onSend={sendMessage} onStop={stopStream} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
