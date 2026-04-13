'use client';

import { QUICK_ACTIONS } from '@/types/ai';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.hint}>빠른 메뉴</p>
      <div className={styles.grid}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className={styles.chip}
            onClick={() => onSelect(action.prompt)}
            disabled={disabled}
          >
            <span className={styles.emoji} aria-hidden="true">{action.emoji}</span>
            <span className={styles.label}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
