'use client';

import { useEffect, useRef } from 'react';
import { useAIChat } from '@/features/ai/hooks';
import { MessageBubble } from '@/components/ai/MessageBubble';
import { QuickActions } from '@/components/ai/QuickActions';
import { ChatInput } from '@/components/ai/ChatInput';
import { VENDOR_QUICK_ACTIONS } from '@/types/ai';
import styles from './page.module.css';

export default function VendorAIPage() {
  const { messages, isStreaming, sendMessage, stopStream, clearHistory } = useAIChat('vendor');
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
          <span className={styles.headerEmoji} aria-hidden="true">🏪</span>
          <div className={styles.headerText}>
            <p className={styles.headerName}>AI 업체 비서</p>
            <p className={styles.headerSub}>업체 운영을 도와드려요</p>
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
            <QuickActions
              onSelect={sendMessage}
              actions={VENDOR_QUICK_ACTIONS}
              disabled={isStreaming}
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        {isStreaming && (
          <div className={styles.streamingLabel}>
            <span className={styles.streamingDot} aria-hidden="true" />
            AI 업체 비서가 답변 중이에요...
          </div>
        )}
        <ChatInput onSend={sendMessage} onStop={stopStream} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
