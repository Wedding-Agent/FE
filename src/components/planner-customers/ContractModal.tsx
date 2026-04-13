'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { VendorContract, ContractStatus, CreateContractInput } from '@/types/planner-customers';
import { ALL_CONTRACT_STATUSES, CONTRACT_STATUS_LABEL, CONTRACT_STATUS_COLOR } from '@/types/planner-customers';
import type { PlannerVendorContact } from '@/types/planner-calendar';
import styles from './ContractModal.module.css';

interface ContractModalProps {
  open: boolean;
  vendors: PlannerVendorContact[];   // 선택 가능한 업체 목록
  editTarget?: VendorContract;       // 수정 시 기존 계약
  isSaving: boolean;
  onSave: (data: CreateContractInput) => void;
  onClose: () => void;
}

export function ContractModal({
  open,
  vendors,
  editTarget,
  isSaving,
  onSave,
  onClose,
}: ContractModalProps) {
  const [vendorId, setVendorId] = useState('');
  const [status, setStatus]     = useState<ContractStatus>('pending');
  const [contractDate, setContractDate] = useState('');
  const [amount, setAmount]     = useState('');
  const [memo, setMemo]         = useState('');

  // 열릴 때 초기화
  useEffect(() => {
    if (open) {
      if (editTarget) {
        setVendorId(editTarget.vendorId);
        setStatus(editTarget.status);
        setContractDate(editTarget.contractDate ?? '');
        setAmount(editTarget.amount != null ? String(editTarget.amount) : '');
        setMemo(editTarget.memo ?? '');
      } else {
        setVendorId('');
        setStatus('pending');
        setContractDate('');
        setAmount('');
        setMemo('');
      }
    }
  }, [open, editTarget]);

  // body overflow lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const selectedVendor = vendors.find((v) => v.id === vendorId);
  const isEdit = !!editTarget;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId || !selectedVendor) return;
    onSave({
      vendorId,
      vendorName:     selectedVendor.name,
      vendorCategory: selectedVendor.category,
      status,
      contractDate:   contractDate || undefined,
      amount:         amount ? Number(amount.replace(/,/g, '')) : undefined,
      memo:           memo.trim() || undefined,
    });
  };

  const modal = (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} aria-hidden="true" />

        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>{isEdit ? '계약 수정' : '업체 계약 추가'}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 업체 선택 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ct-vendor">업체 *</label>
            <select
              id="ct-vendor"
              className={styles.select}
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              disabled={isEdit}
            >
              <option value="">업체를 선택하세요</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>

          {/* 계약 상태 */}
          <div className={styles.field}>
            <label className={styles.label}>계약 상태</label>
            <div className={styles.chipRow}>
              {ALL_CONTRACT_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={[styles.chip, status === s && styles.chipSelected].filter(Boolean).join(' ')}
                  style={
                    status === s
                      ? { background: CONTRACT_STATUS_COLOR[s], borderColor: CONTRACT_STATUS_COLOR[s] }
                      : {}
                  }
                  onClick={() => setStatus(s)}
                >
                  {CONTRACT_STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* 계약일 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ct-date">계약일 (선택)</label>
            <input
              id="ct-date"
              type="date"
              className={styles.input}
              value={contractDate}
              onChange={(e) => setContractDate(e.target.value)}
            />
          </div>

          {/* 계약금 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ct-amount">계약금 (선택)</label>
            <div className={styles.inputWrap}>
              <input
                id="ct-amount"
                type="number"
                className={styles.input}
                placeholder="예: 20000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={0}
              />
              <span className={styles.inputUnit}>원</span>
            </div>
          </div>

          {/* 메모 */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ct-memo">메모 (선택)</label>
            <textarea
              id="ct-memo"
              className={styles.textarea}
              placeholder="계약 조건, 특이사항 등"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              maxLength={200}
            />
          </div>

          {/* 버튼 */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
              취소
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={!vendorId || isSaving}
            >
              {isSaving ? '저장 중...' : isEdit ? '수정 완료' : '계약 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
