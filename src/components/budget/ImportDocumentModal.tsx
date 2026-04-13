'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDocuments } from '@/features/documents/hooks';
import {
  ALL_BUDGET_CATEGORIES,
  CATEGORY_LABEL,
  type BudgetCategory,
} from '@/types/budget';
import styles from './modal.module.css';
import localStyles from './ImportDocumentModal.module.css';

interface ImportSelection {
  documentId: string;
  category: BudgetCategory;
  label: string;
  amount: number;
}

interface ImportDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (selections: ImportSelection[]) => void;
  isPending: boolean;
  /** Document IDs already linked to budget items — excluded from list */
  linkedDocumentIds?: Set<string>;
}

function parseAmount(raw: string | undefined): number {
  if (!raw) return 0;
  return parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
}

export function ImportDocumentModal({
  open,
  onClose,
  onImport,
  isPending,
  linkedDocumentIds = new Set(),
}: ImportDocumentModalProps) {
  const { data: docData } = useDocuments('ALL');
  const [selections, setSelections] = useState<Map<string, ImportSelection>>(new Map());

  const importableDocuments = (docData?.content ?? []).filter(
    (d) =>
      d.status === 'COMPLETED' &&
      d.extractedFields?.totalAmount &&
      !linkedDocumentIds.has(d.id),
  );

  useEffect(() => {
    if (open) {
      setSelections(new Map());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const toggle = (docId: string, vendorName: string, amountStr: string, fileName: string) => {
    setSelections((prev) => {
      const next = new Map(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.set(docId, {
          documentId: docId,
          category: 'OTHER',
          label: vendorName || fileName,
          amount: parseAmount(amountStr),
        });
      }
      return next;
    });
  };

  const updateField = <K extends keyof ImportSelection>(
    docId: string,
    key: K,
    value: ImportSelection[K],
  ) => {
    setSelections((prev) => {
      const next = new Map(prev);
      const existing = next.get(docId);
      if (existing) next.set(docId, { ...existing, [key]: value });
      return next;
    });
  };

  const handleSubmit = () => {
    const list = Array.from(selections.values()).filter((s) => s.amount > 0);
    if (list.length === 0) return;
    onImport(list);
  };

  return createPortal(
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="문서에서 가져오기">
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>문서에서 가져오기</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </header>

        {importableDocuments.length === 0 ? (
          <p className={localStyles.empty}>
            가져올 수 있는 문서가 없습니다.
            <br />
            <span className={localStyles.emptySub}>
              문서 보관함에서 영수증·계약서를 업로드하면 금액이 자동 추출됩니다.
            </span>
          </p>
        ) : (
          <>
            <p className={localStyles.hint}>
              가져올 문서를 선택하고 카테고리를 지정하세요.
            </p>
            <div className={localStyles.docList}>
              {importableDocuments.map((doc) => {
                const vendorName = doc.extractedFields?.vendorName ?? '';
                const amountStr = doc.extractedFields?.totalAmount ?? '';
                const amount = parseAmount(amountStr);
                const selected = selections.has(doc.id);
                const sel = selections.get(doc.id);

                return (
                  <div
                    key={doc.id}
                    className={`${localStyles.docRow} ${selected ? localStyles.docRowSelected : ''}`}
                  >
                    <label className={localStyles.docCheck}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selected}
                        onChange={() => toggle(doc.id, vendorName, amountStr, doc.fileName)}
                      />
                      <div className={localStyles.docInfo}>
                        <span className={localStyles.docName}>{doc.fileName}</span>
                        <span className={localStyles.docAmount}>{amountStr}</span>
                      </div>
                    </label>

                    {selected && sel && (
                      <div className={localStyles.selFields}>
                        <div className={styles.field}>
                          <label className={styles.label}>내용</label>
                          <input
                            className={styles.input}
                            type="text"
                            value={sel.label}
                            onChange={(e) => updateField(doc.id, 'label', e.target.value)}
                            maxLength={100}
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>카테고리</label>
                          <select
                            className={styles.select}
                            value={sel.category}
                            onChange={(e) =>
                              updateField(doc.id, 'category', e.target.value as BudgetCategory)
                            }
                          >
                            {ALL_BUDGET_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>{CATEGORY_LABEL[cat]}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isPending || selections.size === 0}
          >
            {isPending ? '가져오는 중…' : `${selections.size}건 가져오기`}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
