'use client';

import { useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryTabs } from '@/components/documents/CategoryTabs';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { EmptyState } from '@/components/documents/EmptyState';
import { ProcessingBanner } from '@/components/documents/ProcessingBanner';
import LoadingModal from '@/components/invitation/LoadingModal';
import { useDocuments, useDocumentsPolling, useUploadDocument } from '@/features/documents/hooks';
import type { DocumentCategory } from '@/types/document';
import styles from './page.module.css';

type CategoryFilter = DocumentCategory | 'ALL';

export default function PlannerContractsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rawCat = searchParams?.get('category') as CategoryFilter | null;
  // 플래너는 계약서(CONTRACT)를 기본 탭으로
  const category: CategoryFilter = rawCat ?? 'CONTRACT';

  const { data, isError, refetch } = useDocuments(category);
  const uploadMutation = useUploadDocument();

  const allDocs = data?.content ?? [];
  const processingCount = useMemo(
    () => allDocs.filter((d) => d.status === 'PROCESSING' || d.status === 'UPLOADING').length,
    [allDocs],
  );

  useDocumentsPolling(processingCount > 0);

  const handleCategoryChange = (cat: CategoryFilter) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (cat === 'ALL') params.delete('category');
    else params.set('category', cat);
    router.replace(`/planner/contracts?${params.toString()}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    uploadMutation.mutate({ file });
  };

  return (
    <div className={styles.page}>
      <LoadingModal open={uploadMutation.isPending} message="계약서를 업로드하고 있어요..." />

      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>계약서 관리</h1>
            <p className={styles.subTitle}>고객·업체 계약서와 영수증을 AI가 자동 분류해요</p>
          </header>

          <CategoryTabs value={category} onChange={handleCategoryChange} />

          {isError ? (
            <div className={styles.errorWrap}>
              <p className={styles.errorText}>문서를 불러오는 데 실패했습니다.</p>
              <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
                다시 시도
              </button>
            </div>
          ) : allDocs.length === 0 ? (
            <EmptyState category={category} />
          ) : (
            <div className={styles.grid}>
              {allDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  basePath="/planner/contracts"
                />
              ))}
            </div>
          )}
        </section>

        {processingCount > 0 && <ProcessingBanner count={processingCount} />}
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        hidden
        onChange={handleFileChange}
      />
      <button
        type="button"
        className={styles.fab}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadMutation.isPending}
        aria-label="계약서 업로드"
        title="계약서 업로드"
      >
        +
      </button>
    </div>
  );
}
