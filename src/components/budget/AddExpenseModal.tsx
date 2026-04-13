'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ALL_BUDGET_CATEGORIES,
  CATEGORY_LABEL,
  type BudgetCategory,
  type BudgetItem,
} from '@/types/budget';
import styles from './modal.module.css';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: Omit<BudgetItem, 'id' | 'createdAt'>) => void;
  isPending: boolean;
}

const DEFAULT_FORM = {
  label: '',
  category: 'VENUE' as BudgetCategory,
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  isUnexpected: false,
  note: '',
};

export function AddExpenseModal({ open, onClose, onSubmit, isPending }: AddExpenseModalProps) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (open) {
      setForm(DEFAULT_FORM);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(form.amount.replace(/,/g, ''), 10);
    if (!form.label.trim() || isNaN(amount) || amount <= 0) return;

    onSubmit({
      category: form.category,
      label: form.label.trim(),
      amount,
      isUnexpected: form.isUnexpected,
      note: form.note.trim() || undefined,
      date: form.date,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setForm((f) => ({ ...f, amount: raw ? parseInt(raw, 10).toLocaleString('ko-KR') : '' }));
  };

  return createPortal(
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="지출 추가">
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>지출 추가</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>내용 *</label>
            <input
              className={styles.input}
              type="text"
              placeholder="예: 웨딩홀 계약금"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              required
              maxLength={100}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>카테고리 *</label>
            <select
              className={styles.select}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as BudgetCategory }))}
            >
              {ALL_BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABEL[cat]}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>금액 (원) *</label>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              placeholder="예: 5,500,000"
              value={form.amount}
              onChange={handleAmountChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>날짜 *</label>
            <input
              className={styles.input}
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={form.isUnexpected}
                onChange={(e) => setForm((f) => ({ ...f, isUnexpected: e.target.checked }))}
              />
              <span className={styles.checkLabel}>예상치 못한 지출</span>
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>메모 (선택)</label>
            <textarea
              className={styles.textarea}
              placeholder="추가 메모를 입력하세요"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              maxLength={300}
            />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending ? '저장 중…' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
