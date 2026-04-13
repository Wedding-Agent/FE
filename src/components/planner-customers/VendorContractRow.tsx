'use client';

import { Pencil, Trash2, Building2 } from 'lucide-react';
import type { VendorContract } from '@/types/planner-customers';
import { CONTRACT_STATUS_LABEL, CONTRACT_STATUS_COLOR } from '@/types/planner-customers';
import styles from './VendorContractRow.module.css';

interface VendorContractRowProps {
  contract: VendorContract;
  onEdit: (contract: VendorContract) => void;
  onDelete: (contractId: string) => void;
}

function formatContractDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${Number(m)}월 ${Number(d)}일`;
}

function formatAmount(amount: number): string {
  if (amount >= 10_000_000) {
    const man = Math.floor(amount / 10_000);
    return `${man.toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function VendorContractRow({ contract, onEdit, onDelete }: VendorContractRowProps) {
  return (
    <div className={styles.row}>
      {/* 왼쪽: 아이콘 + 정보 */}
      <div className={styles.left}>
        <div className={styles.iconWrap}>
          <Building2 size={16} strokeWidth={2} />
        </div>
        <div className={styles.info}>
          <div className={styles.topLine}>
            <span className={styles.vendorName}>{contract.vendorName}</span>
            <span
              className={styles.statusBadge}
              style={{
                background: `${CONTRACT_STATUS_COLOR[contract.status]}18`,
                color: CONTRACT_STATUS_COLOR[contract.status],
              }}
            >
              {CONTRACT_STATUS_LABEL[contract.status]}
            </span>
          </div>
          <div className={styles.category}>{contract.vendorCategory}</div>
          {(contract.contractDate || contract.amount) && (
            <div className={styles.meta}>
              {contract.contractDate && (
                <span>계약일 {formatContractDate(contract.contractDate)}</span>
              )}
              {contract.contractDate && contract.amount && (
                <span className={styles.separator}>·</span>
              )}
              {contract.amount && (
                <span>계약금 {formatAmount(contract.amount)}</span>
              )}
            </div>
          )}
          {contract.memo && (
            <div className={styles.memo}>{contract.memo}</div>
          )}
        </div>
      </div>

      {/* 오른쪽: 액션 버튼 */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onEdit(contract)}
          aria-label="수정"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={() => onDelete(contract.id)}
          aria-label="삭제"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
