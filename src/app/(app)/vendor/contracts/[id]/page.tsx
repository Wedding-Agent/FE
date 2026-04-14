'use client';

import { useParams, useRouter } from 'next/navigation';
import { CATEGORY_LABEL, STATUS_LABEL } from '@/types/document';
import { useDeleteDocument, useDocument, useDocumentPolling } from '@/features/documents/hooks';
import styles from '@/app/(app)/couple/documents/[id]/page.module.css';

const FIELD_LABEL: Record<string, string> = {
  contractDate: '계약일',
  totalAmount:  '총금액',
  vendorName:   '업체명',
};

export default function VendorContractDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const router = useRouter();

  const { data: doc, isError } = useDocument(id);
  const isProcessing = doc?.status === 'PROCESSING' || doc?.status === 'UPLOADING';

  useDocumentPolling(id, !!isProcessing);

  const deleteMutation = useDeleteDocument();

  const handleDelete = async () => {
    if (!confirm('문서를 삭제하면 복구할 수 없어요. 삭제할까요?')) return;
    await deleteMutation.mutateAsync(id);
    router.replace('/vendor/contracts');
  };

  if (isError) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.errorWrap}>
            <p className={styles.errorText}>문서를 불러올 수 없어요.</p>
            <button type="button" className={styles.backLink} onClick={() => router.back()}>
              돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.processingWrap}>
            <div className={styles.spinner} />
          </div>
        </main>
      </div>
    );
  }

  const dateStr = new Date(doc.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const extractedFieldEntries = doc.extractedFields
    ? Object.entries(doc.extractedFields).filter(([, v]) => v)
    : [];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.card}>
          <div className={styles.header}>
            <button type="button" className={styles.backBtn} onClick={() => router.back()}>
              ← 뒤로
            </button>
            <span className={`${styles.badge} ${styles[`badge-${doc.category}`]}`}>
              {CATEGORY_LABEL[doc.category]}
            </span>
            <h1 className={styles.fileName}>{doc.fileName}</h1>
            <p className={styles.meta}>
              {dateStr} · {STATUS_LABEL[doc.status]}
            </p>
          </div>

          <div className={styles.imageWrap}>
            {doc.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.image} src={doc.imageUrl} alt={doc.fileName} />
            ) : (
              <span className={styles.imagePlaceholder} aria-hidden="true">
                {doc.category === 'CONTRACT' ? '📄' : doc.category === 'RECEIPT' ? '🧾' : '📁'}
              </span>
            )}
          </div>

          {isProcessing && (
            <div className={styles.processingWrap}>
              <div className={styles.spinner} aria-hidden="true" />
              <p className={styles.processingText}>AI가 문서를 분석하고 있어요...</p>
            </div>
          )}

          {doc.status === 'COMPLETED' && extractedFieldEntries.length > 0 && (
            <div className={styles.fieldsSection}>
              <p className={styles.sectionTitle}>추출된 정보</p>
              <div className={styles.fieldGrid}>
                {extractedFieldEntries.map(([key, val]) => (
                  <div key={key} className={styles.fieldItem}>
                    <p className={styles.fieldKey}>{FIELD_LABEL[key] ?? key}</p>
                    <p className={styles.fieldVal}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {doc.status === 'COMPLETED' && doc.extractedText && (
            <div className={styles.textSection}>
              <p className={styles.sectionTitle}>추출된 텍스트</p>
              <pre className={styles.extractedText}>{doc.extractedText}</pre>
            </div>
          )}

          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? '삭제 중...' : '문서 삭제'}
          </button>
        </section>
      </main>
    </div>
  );
}
