'use client';

import { useEffect, useRef } from 'react';
import { useAIChat } from '@/features/ai/hooks';
import { MessageBubble } from '@/components/ai/MessageBubble';
import { QuickActions } from '@/components/ai/QuickActions';
import { ChatInput } from '@/components/ai/ChatInput';
import styles from './page.module.css';

export default function AIPage() {
  const { messages, isStreaming, sendMessage, stopStream, clearHistory } = useAIChat();
  const scrollRef  = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages / streaming
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Show quick actions only at start (only welcome message)
  const showQuickActions = messages.length <= 1;

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  const handleClear = () => {
    if (!confirm('대화 내역을 초기화할까요?')) return;
    clearHistory();
  };

  return (
    <div className={styles.shell}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.headerEmoji} aria-hidden="true">💍</span>
          <div className={styles.headerText}>
            <p className={styles.headerName}>AI 웨딩 비서</p>
            <p className={styles.headerSub}>웨딩 준비의 모든 것을 도와드려요</p>
          </div>
        </div>
        {messages.length > 1 && (
          <button type="button" className={styles.clearBtn} onClick={handleClear}>
            초기화
          </button>
        )}
      </header>

      {/* Messages */}
      <div className={styles.scroll} ref={scrollRef}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Quick actions — shown only at start */}
        {showQuickActions && (
          <div className={styles.quickWrap}>
            <QuickActions onSelect={handleSend} disabled={isStreaming} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className={styles.inputArea}>
        {isStreaming && (
          <div className={styles.streamingLabel}>
            <span className={styles.streamingDot} aria-hidden="true" />
            AI 웨딩 비서가 답변 중이에요...
          </div>
        )}
        <ChatInput
          onSend={handleSend}
          onStop={stopStream}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
