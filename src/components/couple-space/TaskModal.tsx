'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { CreateTaskInput, SharedTask, TaskCategory, TaskPriority } from '@/types/couple-space';
import {
  ALL_TASK_CATEGORIES,
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  TASK_CATEGORY_EMOJI,
  TASK_CATEGORY_LABEL,
} from '@/types/couple-space';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  mode:     'create' | 'edit';
  task?:    SharedTask;
  isSaving: boolean;
  onClose:  () => void;
  onSubmit: (data: CreateTaskInput) => void;
}

const DEFAULT_CATEGORY: TaskCategory = 'etc';
const DEFAULT_PRIORITY: TaskPriority = 'normal';
const PRIORITIES: TaskPriority[] = ['high', 'normal', 'low'];

export function TaskModal({ mode, task, isSaving, onClose, onSubmit }: TaskModalProps) {
  const [title,    setTitle]    = useState('');
  const [category, setCategory] = useState<TaskCategory>(DEFAULT_CATEGORY);
  const [priority, setPriority] = useState<TaskPriority>(DEFAULT_PRIORITY);
  const [dueDate,  setDueDate]  = useState('');

  // 열릴 때 폼 초기화
  useEffect(() => {
    if (mode === 'edit' && task) {
      setTitle(task.title);
      setCategory(task.category);
      setPriority(task.priority);
      setDueDate(task.dueDate ?? '');
    } else {
      setTitle('');
      setCategory(DEFAULT_CATEGORY);
      setPriority(DEFAULT_PRIORITY);
      setDueDate('');
    }
  }, [mode, task]);

  // body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title:    title.trim(),
      category,
      priority,
      dueDate:  dueDate || undefined,
    });
  };

  const isEdit    = mode === 'edit';
  const canSubmit = title.trim().length > 0;

  const modal = (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.header}>
          <h2 className={styles.headerTitle}>{isEdit ? '할 일 수정' : '할 일 추가'}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 제목 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-title">제목 *</label>
            <input
              id="task-title"
              type="text"
              className={styles.input}
              placeholder="할 일을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              autoFocus
            />
          </div>

          {/* 카테고리 */}
          <div className={styles.field}>
            <label className={styles.label}>카테고리</label>
            <div className={styles.chipRow}>
              {ALL_TASK_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={[styles.chip, category === c && styles.chipSelected]
                    .filter(Boolean).join(' ')}
                  onClick={() => setCategory(c)}
                >
                  <span>{TASK_CATEGORY_EMOJI[c]}</span>
                  <span>{TASK_CATEGORY_LABEL[c]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 우선순위 */}
          <div className={styles.field}>
            <label className={styles.label}>우선순위</label>
            <div className={styles.chipRow}>
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={[styles.chip, priority === p && styles.chipSelected]
                    .filter(Boolean).join(' ')}
                  style={
                    priority === p
                      ? { background: PRIORITY_COLOR[p], borderColor: PRIORITY_COLOR[p] }
                      : {}
                  }
                  onClick={() => setPriority(p)}
                >
                  {PRIORITY_LABEL[p]}
                </button>
              ))}
            </div>
          </div>

          {/* 마감일 (선택) */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-due">마감일 (선택)</label>
            <input
              id="task-due"
              type="date"
              className={styles.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* 버튼 */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isSaving}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={!canSubmit || isSaving}
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
