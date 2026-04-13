'use client';

import { useRouter } from 'next/navigation';
import type { Document } from '@/types/document';
import { CATEGORY_LABEL } from '@/types/document';
import styles from './DocumentCard.module.css';

const CATEGORY_EMOJI: Record<string, string> = {
  CONTRACT: '📄',
  RECEIPT:  '🧾',
  OTHER:    '📁',
};

interface Props {
  doc: Document;
  basePath?: string; // default: '/couple/documents'
}

export function DocumentCard({ doc, basePath = '/couple/documents' }: Props) {
  const router = useRouter();
  const isProcessing = doc.status === 'PROCESSING' || doc.status === 'UPLOADING';
  const isFailed = doc.status === 'FAILED';
  const dateStr = new Date(doc.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <article
      className={styles.card}
      onClick={() => router.push(`${basePath}/${doc.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`${basePath}/${doc.id}`)}
      aria-label={`${doc.fileName} 문서 보기`}
    >
      <div className={styles.thumb}>
        {doc.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.thumbImg} src={doc.thumbnailUrl} alt={doc.fileName} />
        ) : (
          <span className={styles.thumbPlaceholder} aria-hidden="true">
            {CATEGORY_EMOJI[doc.category] ?? '📁'}
          </span>
        )}
        {isProcessing && (
          <div className={styles.statusOverlay} aria-label="AI 분석 중">
            <div className={styles.spinner} />
            <span className={styles.statusText}>분석 중</span>
          </div>
        )}
        {isFailed && (
          <div className={styles.failedOverlay} aria-label="분석 실패">⚠️</div>
        )}
      </div>

      <div className={styles.info}>
        <span className={`${styles.badge} ${styles[`badge-${doc.category}`]}`}>
          {CATEGORY_LABEL[doc.category]}
        </span>
        <p className={styles.fileName}>{doc.fileName}</p>
        <p className={styles.date}>{dateStr}</p>
      </div>
    </article>
  );
}
