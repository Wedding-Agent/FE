'use client';

import { QUICK_ACTIONS } from '@/types/ai';
import type { QuickAction } from '@/types/ai';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  actions?: QuickAction[];
}

export function QuickActions({ onSelect, disabled, actions }: QuickActionsProps) {
  const items = actions ?? QUICK_ACTIONS;
  return (
    <div className={styles.wrap}>
      <p className={styles.hint}>빠른 메뉴</p>
      <div className={styles.grid}>
        {items.map((action) => (
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
