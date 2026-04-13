'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, CheckCircle2 } from 'lucide-react';
import { TOOL_EMOJI, TOOL_LABEL, type ToolName } from '@/types/ai';
import styles from './ToolCallCard.module.css';

interface ToolCallCardProps {
  toolName: string;
  args: Record<string, unknown>;
  status: 'pending' | 'done';
  result?: unknown;
}

export function ToolCallCard({ toolName, args, status, result }: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(false);
  const label = TOOL_LABEL[toolName as ToolName] ?? toolName;
  const emoji = TOOL_EMOJI[toolName as ToolName] ?? '🔧';

  const hasResult = status === 'done' && result !== undefined;

  return (
    <div className={`${styles.card} ${status === 'done' ? styles.done : styles.pending}`}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className={styles.headerLeft}>
          {status === 'pending' ? (
            <Loader2 size={13} className={styles.spinner} />
          ) : (
            <CheckCircle2 size={13} className={styles.checkIcon} />
          )}
          <span className={styles.emoji} aria-hidden="true">{emoji}</span>
          <span className={styles.label}>{label}</span>
          <span className={styles.status}>
            {status === 'pending' ? '실행 중…' : '완료'}
          </span>
        </div>
        {hasResult && (
          expanded ? <ChevronUp size={13} className={styles.chevron} /> : <ChevronDown size={13} className={styles.chevron} />
        )}
      </button>

      {expanded && hasResult && (
        <div className={styles.body}>
          <pre className={styles.json}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
