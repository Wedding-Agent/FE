'use client';

import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { AgentBadge } from './AgentBadge';
import { ToolCallCard } from './ToolCallCard';
import { MarkdownText } from './MarkdownText';
import type { AIMessage } from '@/types/ai';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: AIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const router = useRouter();
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className={styles.userWrap}>
        <div className={styles.userBubble}>
          <p className={styles.userText}>{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant bubble
  const parts = message.parts ?? [];
  const hasContent = parts.length > 0;

  return (
    <div className={styles.assistantWrap}>
      {/* Avatar */}
      <div className={styles.avatar} aria-hidden="true">💍</div>

      <div className={styles.assistantContent}>
        {/* Empty: dots loading */}
        {!hasContent && (
          <div className={styles.loadingBubble}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        )}

        {/* Parts */}
        {parts.map((part, idx) => {
          if (part.type === 'agent_switch') {
            return (
              <AgentBadge key={idx} from={part.from} to={part.to} />
            );
          }

          if (part.type === 'tool_call') {
            return (
              <ToolCallCard
                key={part.toolCallId}
                toolName={part.toolName}
                args={part.args}
                status={part.status}
                result={part.result}
              />
            );
          }

          if (part.type === 'text' && part.text) {
            return (
              <div key={idx} className={styles.textBubble}>
                <MarkdownText text={part.text} streaming={part.streaming} />
              </div>
            );
          }

          return null;
        })}

        {/* Navigation suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {message.suggestions.map((s) => (
              <button
                key={s.href}
                type="button"
                className={styles.suggestionBtn}
                onClick={() => router.push(s.href)}
              >
                <span className={styles.suggestionLabel}>{s.label}</span>
                {s.description && (
                  <span className={styles.suggestionDesc}>{s.description}</span>
                )}
                <ExternalLink size={12} className={styles.suggestionIcon} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
