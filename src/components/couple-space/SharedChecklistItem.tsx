'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { SharedTask } from '@/types/couple-space';
import { PRIORITY_COLOR, TASK_CATEGORY_EMOJI } from '@/types/couple-space';
import { cn } from '@/lib/cn';
import styles from './SharedChecklistItem.module.css';

interface SharedChecklistItemProps {
  task:     SharedTask;
  onToggle: (id: string) => void;
  onEdit:   (task: SharedTask) => void;
  onDelete: (id: string) => void;
}

function formatDueDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  return `~ ${m}월 ${d}일`;
}

export function SharedChecklistItem({ task, onToggle, onEdit, onDelete }: SharedChecklistItemProps) {
  return (
    <div className={cn(styles.item, task.done && styles.done)}>
      <div className={styles.mainRow}>
        {/* 체크 버튼 */}
        <button
          type="button"
          className={cn(styles.checkBtn, task.done && styles.checkBtnDone)}
          onClick={() => onToggle(task.id)}
          aria-label={task.done ? '완료 취소' : '완료로 표시'}
          aria-pressed={task.done}
        >
          {task.done ? '✓' : ''}
        </button>

        {/* 카테고리 이모지 */}
        <span className={styles.emoji} aria-hidden="true">
          {TASK_CATEGORY_EMOJI[task.category]}
        </span>

        {/* 제목 */}
        <span className={styles.title}>{task.title}</span>

        {/* 우선순위 도트 */}
        <span
          className={styles.priorityDot}
          style={{ background: PRIORITY_COLOR[task.priority] }}
          title={task.priority}
          aria-hidden="true"
        />

        {/* 수정/삭제 */}
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onEdit(task)}
          aria-label="수정"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onDelete(task.id)}
          aria-label="삭제"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* 마감일 서브텍스트 */}
      {task.dueDate && (
        <p className={styles.dueDate}>{formatDueDate(task.dueDate)}</p>
      )}
    </div>
  );
}
