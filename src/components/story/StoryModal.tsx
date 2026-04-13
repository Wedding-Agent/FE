'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { CreateStoryInput, StoryEntry, StoryMilestone } from '@/types/story';
import { ALL_MILESTONES, MILESTONE_COLOR, MILESTONE_EMOJI, MILESTONE_LABEL } from '@/types/story';
import styles from './StoryModal.module.css';

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface StoryModalProps {
  mode:     'create' | 'edit';
  entry?:   StoryEntry;
  isSaving: boolean;
  onClose:  () => void;
  onSubmit: (data: CreateStoryInput) => void;
}

const DEFAULT_MILESTONE: StoryMilestone = 'etc';

export function StoryModal({ mode, entry, isSaving, onClose, onSubmit }: StoryModalProps) {
  const [date,      setDate]      = useState('');
  const [milestone, setMilestone] = useState<StoryMilestone>(DEFAULT_MILESTONE);
  const [title,     setTitle]     = useState('');
  const [content,   setContent]   = useState('');

  // 열릴 때 폼 초기화
  useEffect(() => {
    if (mode === 'edit' && entry) {
      setDate(entry.date);
      setMilestone(entry.milestone);
      setTitle(entry.title);
      setContent(entry.content);
    } else {
      setDate(todayStr());
      setMilestone(DEFAULT_MILESTONE);
      setTitle('');
      setContent('');
    }
  }, [mode, entry]);

  // body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !date) return;
    onSubmit({ title: title.trim(), content: content.trim(), date, milestone });
  };

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && date !== '';
  const isEdit    = mode === 'edit';

  const modal = (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.header}>
          <h2 className={styles.headerTitle}>{isEdit ? '스토리 수정' : '스토리 추가'}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 날짜 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="st-date">날짜 *</label>
            <input
              id="st-date"
              type="date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 마일스톤 */}
          <div className={styles.field}>
            <label className={styles.label}>마일스톤</label>
            <div className={styles.milestoneRow}>
              {ALL_MILESTONES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={[styles.msChip, milestone === m && styles.msSelected]
                    .filter(Boolean).join(' ')}
                  style={
                    milestone === m
                      ? { background: MILESTONE_COLOR[m], borderColor: MILESTONE_COLOR[m] }
                      : {}
                  }
                  onClick={() => setMilestone(m)}
                >
                  <span>{MILESTONE_EMOJI[m]}</span>
                  <span>{MILESTONE_LABEL[m]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="st-title">제목 *</label>
            <input
              id="st-title"
              type="text"
              className={styles.input}
              placeholder="이 순간의 제목을 써주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              autoFocus
            />
          </div>

          {/* 내용 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="st-content">내용 *</label>
            <textarea
              id="st-content"
              className={styles.textarea}
              placeholder="우리의 이야기를 기록해보세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              rows={4}
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
