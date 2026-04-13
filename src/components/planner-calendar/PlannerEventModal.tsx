'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { EventCategory } from '@/types/calendar';
import { ALL_CATEGORIES, CATEGORY_COLOR, CATEGORY_EMOJI, CATEGORY_LABEL } from '@/types/calendar';
import type {
  PlannerCalendarEvent,
  PlannerCustomer,
  PlannerVendorContact,
  CreatePlannerEventInput,
} from '@/types/planner-calendar';
import eventStyles from '@/components/calendar/EventModal.module.css';
import styles from './PlannerEventModal.module.css';

interface PlannerEventModalProps {
  open:         boolean;
  initialDate?: string;
  editTarget?:  PlannerCalendarEvent;
  customers:    PlannerCustomer[];
  vendors:      PlannerVendorContact[];
  isSaving:     boolean;
  onSave:       (data: CreatePlannerEventInput) => void;
  onClose:      () => void;
}

const DEFAULT_CATEGORY: EventCategory = 'TASK';

export function PlannerEventModal({
  open,
  initialDate = '',
  editTarget,
  customers,
  vendors,
  isSaving,
  onSave,
  onClose,
}: PlannerEventModalProps) {
  const [title,      setTitle]      = useState('');
  const [date,       setDate]       = useState('');
  const [category,   setCategory]   = useState<EventCategory>(DEFAULT_CATEGORY);
  const [note,       setNote]       = useState('');
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [vendorId,   setVendorId]   = useState<string | null>(null);

  // 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      if (editTarget) {
        setTitle(editTarget.title);
        setDate(editTarget.date);
        setCategory(editTarget.category);
        setNote(editTarget.note ?? '');
        setCustomerId(editTarget.customerId ?? null);
        setVendorId(editTarget.vendorId ?? null);
      } else {
        setTitle('');
        setDate(initialDate);
        setCategory(DEFAULT_CATEGORY);
        setNote('');
        setCustomerId(null);
        setVendorId(null);
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
    onSave({
      title:      title.trim(),
      date,
      category,
      note:       note.trim() || undefined,
      customerId: customerId ?? undefined,
      vendorId:   vendorId ?? undefined,
    });
  };

  const isEdit = !!editTarget;

  const modal = (
    <div className={eventStyles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={eventStyles.sheet} onClick={(e) => e.stopPropagation()}>
        {/* 핸들 */}
        <div className={eventStyles.handle} aria-hidden="true" />

        {/* 헤더 */}
        <div className={eventStyles.header}>
          <h2 className={eventStyles.headerTitle}>{isEdit ? '일정 수정' : '일정 추가'}</h2>
          <button type="button" className={eventStyles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className={eventStyles.form}>
          {/* 제목 */}
          <div className={eventStyles.field}>
            <label className={eventStyles.label} htmlFor="planner-ev-title">제목 *</label>
            <input
              id="planner-ev-title"
              type="text"
              className={eventStyles.input}
              placeholder="일정 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              autoFocus
            />
          </div>

          {/* 날짜 */}
          <div className={eventStyles.field}>
            <label className={eventStyles.label} htmlFor="planner-ev-date">날짜 *</label>
            <input
              id="planner-ev-date"
              type="date"
              className={eventStyles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 카테고리 */}
          <div className={eventStyles.field}>
            <label className={eventStyles.label}>카테고리</label>
            <div className={eventStyles.categoryRow}>
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={[eventStyles.catChip, category === cat && eventStyles.catSelected]
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

          {/* 고객 연결 */}
          <div className={styles.entitySection}>
            <label className={eventStyles.label}>고객 연결 (선택)</label>
            <div className={styles.entityChips}>
              {/* 없음 */}
              <button
                type="button"
                className={[
                  styles.entityChip,
                  customerId === null && styles.entityChipSelected,
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={
                  customerId === null
                    ? { background: 'rgba(100,116,139,0.7)', borderColor: 'rgba(100,116,139,0.7)' }
                    : {}
                }
                onClick={() => setCustomerId(null)}
              >
                없음
              </button>
              {customers.map((c) => {
                const isActive = customerId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={[
                      styles.entityChip,
                      isActive && styles.entityChipSelected,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={
                      isActive
                        ? {
                            background: `${c.color}d9`,
                            borderColor: c.color,
                          }
                        : {}
                    }
                    onClick={() => setCustomerId(isActive ? null : c.id)}
                  >
                    <span
                      className={styles.entityDot}
                      style={{ background: isActive ? '#fff' : c.color }}
                      aria-hidden="true"
                    />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 업체 연결 */}
          <div className={styles.entitySection}>
            <label className={eventStyles.label}>업체 연결 (선택)</label>
            <div className={styles.entityChips}>
              {/* 없음 */}
              <button
                type="button"
                className={[
                  styles.entityChip,
                  vendorId === null && styles.entityChipSelected,
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={
                  vendorId === null
                    ? { background: 'rgba(100,116,139,0.7)', borderColor: 'rgba(100,116,139,0.7)' }
                    : {}
                }
                onClick={() => setVendorId(null)}
              >
                없음
              </button>
              {vendors.map((v) => {
                const isActive = vendorId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    className={[
                      styles.entityChip,
                      isActive && styles.entityChipSelected,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={
                      isActive
                        ? {
                            background: `${v.color}d9`,
                            borderColor: v.color,
                          }
                        : {}
                    }
                    onClick={() => setVendorId(isActive ? null : v.id)}
                  >
                    <span
                      className={styles.entityDot}
                      style={{ background: isActive ? '#fff' : v.color }}
                      aria-hidden="true"
                    />
                    {v.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 메모 */}
          <div className={eventStyles.field}>
            <label className={eventStyles.label} htmlFor="planner-ev-note">메모 (선택)</label>
            <textarea
              id="planner-ev-note"
              className={eventStyles.textarea}
              placeholder="장소, 담당자, 준비물 등을 적어두세요"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              rows={3}
            />
          </div>

          {/* 저장 버튼 */}
          <div className={eventStyles.footer}>
            <button
              type="button"
              className={eventStyles.cancelBtn}
              onClick={onClose}
              disabled={isSaving}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.saveBtnBlue}
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
