'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { CalendarEvent, EventCategory } from '@/types/calendar';
import { ALL_CATEGORIES, CATEGORY_COLOR, CATEGORY_EMOJI, CATEGORY_LABEL } from '@/types/calendar';
import styles from './EventModal.module.css';

interface EventModalProps {
  open: boolean;
  initialDate?: string;       // YYYY-MM-DD (새 이벤트 기본 날짜)
  editTarget?: CalendarEvent; // 수정 시 기존 이벤트
  isSaving: boolean;
  onSave: (data: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const DEFAULT_CATEGORY: EventCategory = 'TASK';

export function EventModal({
  open,
  initialDate = '',
  editTarget,
  isSaving,
  onSave,
  onClose,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<EventCategory>(DEFAULT_CATEGORY);
  const [note, setNote] = useState('');

  // 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      if (editTarget) {
        setTitle(editTarget.title);
        setDate(editTarget.date);
        setCategory(editTarget.category);
        setNote(editTarget.note ?? '');
      } else {
        setTitle('');
        setDate(initialDate);
        setCategory(DEFAULT_CATEGORY);
        setNote('');
      }
    }
  }, [open, editTarget, initialDate]);

  // body overflow lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSave({ title: title.trim(), date, category, note: note.trim() || undefined });
  };

  const isEdit = !!editTarget;

  const modal = (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        {/* 핸들 */}
        <div className={styles.handle} aria-hidden="true" />

        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>{isEdit ? '일정 수정' : '일정 추가'}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 제목 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ev-title">제목 *</label>
            <input
              id="ev-title"
              type="text"
              className={styles.input}
              placeholder="일정 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              autoFocus
            />
          </div>

          {/* 날짜 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ev-date">날짜 *</label>
            <input
              id="ev-date"
              type="date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 카테고리 */}
          <div className={styles.field}>
            <label className={styles.label}>카테고리</label>
            <div className={styles.categoryRow}>
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={[styles.catChip, category === cat && styles.catSelected]
                    .filter(Boolean)
                    .join(' ')}
                  style={
                    category === cat
                      ? { background: CATEGORY_COLOR[cat], borderColor: CATEGORY_COLOR[cat] }
                      : {}
                  }
                  onClick={() => setCategory(cat)}
                >
                  <span>{CATEGORY_EMOJI[cat]}</span>
                  <span>{CATEGORY_LABEL[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 메모 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ev-note">메모 (선택)</label>
            <textarea
              id="ev-note"
              className={styles.textarea}
              placeholder="장소, 담당자, 준비물 등을 적어두세요"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              rows={3}
            />
          </div>

          {/* 저장 버튼 */}
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
              disabled={!title.trim() || !date || isSaving}
            >
              {isSaving ? '저장 중...' : isEdit ? '수정 완료' : '일정 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
