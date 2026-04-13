'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Promotion, PromotionChannel, PromotionCategory, CreatePromotionInput } from '@/types/promotions';
import {
  ALL_PROMOTION_CHANNELS,
  ALL_PROMOTION_CATEGORIES,
  PROMOTION_CHANNEL_LABEL,
  PROMOTION_CHANNEL_EMOJI,
  PROMOTION_CATEGORY_LABEL,
  PROMOTION_TEMPLATES,
} from '@/types/promotions';
import styles from './PromotionComposerModal.module.css';

interface PromotionComposerModalProps {
  open: boolean;
  editTarget?: Promotion;
  isSaving: boolean;
  onSave: (data: CreatePromotionInput) => void;
  onClose: () => void;
}

export function PromotionComposerModal({
  open,
  editTarget,
  isSaving,
  onSave,
  onClose,
}: PromotionComposerModalProps) {
  const [channel, setChannel]   = useState<PromotionChannel>('INSTAGRAM');
  const [category, setCategory] = useState<PromotionCategory>('NEW_CUSTOMER');
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState(PROMOTION_TEMPLATES['NEW_CUSTOMER']);

  const isEdit = !!editTarget;

  // 열릴 때 초기화
  useEffect(() => {
    if (open) {
      if (editTarget) {
        setChannel(editTarget.channel);
        setCategory(editTarget.category);
        setTitle(editTarget.title);
        setContent(editTarget.content);
      } else {
        setChannel('INSTAGRAM');
        setCategory('NEW_CUSTOMER');
        setTitle('');
        setContent(PROMOTION_TEMPLATES['NEW_CUSTOMER']);
      }
    }
  }, [open, editTarget]);

  // body overflow lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleCategoryChange = (cat: PromotionCategory) => {
    setCategory(cat);
    // 수정 모드이거나 이미 내용을 직접 입력했으면 덮어쓰지 않음
    if (!isEdit && PROMOTION_TEMPLATES[cat]) {
      setContent(PROMOTION_TEMPLATES[cat]);
    } else if (!isEdit && !PROMOTION_TEMPLATES[cat]) {
      setContent('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ channel, category, title: title.trim(), content: content.trim() });
  };

  const modal = (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} aria-hidden="true" />

        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>{isEdit ? '홍보 멘트 수정' : '홍보 멘트 작성'}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 채널 선택 */}
          <div className={styles.field}>
            <label className={styles.label}>채널</label>
            <div className={styles.channelGrid}>
              {ALL_PROMOTION_CHANNELS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className={[
                    styles.channelChip,
                    channel === ch && styles.channelChipActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setChannel(ch)}
                >
                  <span>{PROMOTION_CHANNEL_EMOJI[ch]}</span>
                  {PROMOTION_CHANNEL_LABEL[ch]}
                </button>
              ))}
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className={styles.field}>
            <label className={styles.label}>유형</label>
            <div className={styles.categoryGrid}>
              {ALL_PROMOTION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {PROMOTION_CATEGORY_LABEL[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="promo-title">제목 (관리용) *</label>
            <input
              id="promo-title"
              type="text"
              className={styles.input}
              placeholder="예: 봄 시즌 인스타 홍보"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
            />
          </div>

          {/* 홍보 문구 */}
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="promo-content">홍보 문구 *</label>
              <span className={styles.charCount}>{content.length}자</span>
            </div>
            <textarea
              id="promo-content"
              className={styles.textarea}
              placeholder="홍보 문구를 입력하거나 템플릿을 선택하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
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
              disabled={!title.trim() || !content.trim() || isSaving}
            >
              {isSaving ? '저장 중...' : isEdit ? '수정 완료' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
