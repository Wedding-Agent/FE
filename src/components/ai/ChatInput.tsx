'use client';

import { useRef, useState } from 'react';
import { Send, Square } from 'lucide-react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className={styles.wrap}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        placeholder="웨딩 관련 무엇이든 물어보세요... (Enter 전송, Shift+Enter 줄바꿈)"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isStreaming}
        maxLength={2000}
      />
      <button
        type="button"
        className={`${styles.sendBtn} ${isStreaming ? styles.stopBtn : ''}`}
        onClick={isStreaming ? onStop : submit}
        aria-label={isStreaming ? '중단' : '전송'}
        disabled={!isStreaming && !value.trim()}
      >
        {isStreaming ? <Square size={16} fill="currentColor" /> : <Send size={16} />}
      </button>
    </div>
  );
}
