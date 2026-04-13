'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { SmsTemplateType, SendTiming, CreateSmsInput } from '@/types/sms-automation';
import { ALL_SMS_TEMPLATES, SMS_TEMPLATE_LABEL, SMS_TEMPLATES } from '@/types/sms-automation';
import { useCustomerList } from '@/features/planner-customers/hooks';
import styles from './SmsComposerModal.module.css';

const MAX_CHARS = 90;

interface SmsComposerModalProps {
  open: boolean;
  isSaving: boolean;
  onSend: (data: CreateSmsInput) => void;
  onClose: () => void;
}

export function SmsComposerModal({ open, isSaving, onSend, onClose }: SmsComposerModalProps) {
  const { data: customers = [] } = useCustomerList();

  const [customerId, setCustomerId]     = useState('');
  const [templateType, setTemplateType] = useState<SmsTemplateType>('WEDDING_REMINDER');
  const [message, setMessage]           = useState(SMS_TEMPLATES['WEDDING_REMINDER']);
  const [timing, setTiming]             = useState<SendTiming>('immediate');
  const [scheduledAt, setScheduledAt]   = useState('');

  // 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setCustomerId('');
      setTemplateType('WEDDING_REMINDER');
      setMessage(SMS_TEMPLATES['WEDDING_REMINDER']);
      setTiming('immediate');
      setScheduledAt('');
    }
  }, [open]);

  // body overflow lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleTemplateChange = (type: SmsTemplateType) => {
    setTemplateType(type);
    if (SMS_TEMPLATES[type]) {
      setMessage(SMS_TEMPLATES[type]);
    } else {
      setMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !message.trim()) return;
    onSend({
      customerId,
      templateType,
      message: message.trim(),
      timing,
      scheduledAt: timing === 'scheduled' ? scheduledAt : undefined,
    });
  };

  const isSubmitDisabled =
    !customerId ||
    !message.trim() ||
    (timing === 'scheduled' && !scheduledAt) ||
    isSaving;

  const modal = (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} aria-hidden="true" />

        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>SMS 작성</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 고객 선택 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="sms-customer">수신 고객 *</label>
            <select
              id="sms-customer"
              className={styles.select}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">고객을 선택하세요</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.phone ? ` (${c.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 템플릿 선택 */}
          <div className={styles.field}>
            <label className={styles.label}>템플릿</label>
            <div className={styles.templateGrid}>
              {ALL_SMS_TEMPLATES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={[
                    styles.templateChip,
                    templateType === type && styles.templateChipActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleTemplateChange(type)}
                >
                  {SMS_TEMPLATE_LABEL[type]}
                </button>
              ))}
            </div>
          </div>

          {/* 메시지 편집 */}
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="sms-message">메시지 *</label>
              <span
                className={[
                  styles.charCount,
                  message.length > MAX_CHARS && styles.charCountOver,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {message.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              id="sms-message"
              className={styles.textarea}
              placeholder="발송할 메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          {/* 발송 방식 */}
          <div className={styles.field}>
            <label className={styles.label}>발송 방식</label>
            <div className={styles.timingRow}>
              {(['immediate', 'scheduled'] as SendTiming[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={[
                    styles.timingChip,
                    timing === t && styles.timingChipActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setTiming(t)}
                >
                  {t === 'immediate' ? '즉시 발송' : '예약 발송'}
                </button>
              ))}
            </div>
            {timing === 'scheduled' && (
              <input
                type="datetime-local"
                className={styles.input}
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            )}
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
              className={styles.sendBtn}
              disabled={isSubmitDisabled}
            >
              {isSaving
                ? '처리 중...'
                : timing === 'immediate'
                ? '발송하기'
                : '예약 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
