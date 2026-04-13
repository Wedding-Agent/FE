'use client';

import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import styles from './CommentInput.module.css';

const MAX_LENGTH = 500;

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isPending: boolean;
}

export function CommentInput({ onSubmit, isPending }: CommentInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto resize
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
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
    if (!trimmed || isPending) return;
    onSubmit(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const remaining = MAX_LENGTH - value.length;

  return (
    <div className={styles.wrap}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        placeholder="댓글을 입력하세요... (Enter 전송, Shift+Enter 줄바꿈)"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        maxLength={MAX_LENGTH}
        rows={1}
        disabled={isPending}
      />
      <div className={styles.row}>
        <span className={`${styles.count} ${remaining < 50 ? styles.countWarn : ''}`}>
          {remaining}
        </span>
        <button
          type="button"
          className={styles.sendBtn}
          onClick={submit}
          disabled={!value.trim() || isPending}
          aria-label="댓글 전송"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
