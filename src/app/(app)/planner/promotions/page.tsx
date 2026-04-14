'use client';

import { useMemo, useState } from 'react';
import { PromotionCard } from '@/components/promotions/PromotionCard';
import { PromotionComposerModal } from '@/components/promotions/PromotionComposerModal';
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from '@/features/promotions/hooks';
import type { Promotion, PromotionChannel, CreatePromotionInput } from '@/types/promotions';
import { ALL_PROMOTION_CHANNELS, PROMOTION_CHANNEL_LABEL, PROMOTION_CHANNEL_EMOJI } from '@/types/promotions';
import styles from './page.module.css';

type FilterChannel = PromotionChannel | 'ALL';

type ModalState = { mode: 'create' } | { mode: 'edit'; promotion: Promotion } | null;

export default function PlannerPromotionsPage() {
  const [filter, setFilter]   = useState<FilterChannel>('ALL');
  const [modal, setModal]     = useState<ModalState>(null);

  const { data: promotions = [], isLoading, isError, refetch } = usePromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();

  const filtered = useMemo(
    () =>
      filter === 'ALL'
        ? promotions
        : promotions.filter((p) => p.channel === filter),
    [promotions, filter],
  );

  const handleSave = (data: CreatePromotionInput) => {
    if (modal?.mode === 'edit') {
      updatePromotion.mutate(
        { id: modal.promotion.id, payload: data },
        { onSuccess: () => setModal(null) },
      );
    } else {
      createPromotion.mutate(data, { onSuccess: () => setModal(null) });
    }
  };

  const isSaving = createPromotion.isPending || updatePromotion.isPending;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.card}>
          {/* 헤더 */}
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>홍보 멘트 작성</h1>
            <p className={styles.subTitle}>채널별 홍보 문구를 작성하고 바로 복사해요</p>
          </header>

          {/* 채널 필터 탭 */}
          <div className={styles.tabs}>
            <button
              type="button"
              className={[styles.tab, filter === 'ALL' && styles.tabActive].filter(Boolean).join(' ')}
              onClick={() => setFilter('ALL')}
            >
              전체
              <span className={styles.tabCount}>{promotions.length}</span>
            </button>
            {ALL_PROMOTION_CHANNELS.map((ch) => {
              const count = promotions.filter((p) => p.channel === ch).length;
              if (count === 0) return null;
              return (
                <button
                  key={ch}
                  type="button"
                  className={[styles.tab, filter === ch && styles.tabActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setFilter(ch)}
                >
                  {PROMOTION_CHANNEL_EMOJI[ch]} {PROMOTION_CHANNEL_LABEL[ch]}
                </button>
              );
            })}
          </div>

          {/* 목록 */}
          {isError ? (
            <div className={styles.errorWrap}>
              <p className={styles.errorText}>홍보 멘트를 불러오는 데 실패했습니다.</p>
              <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
                다시 시도
              </button>
            </div>
          ) : isLoading ? (
            <div className={styles.skeletonList}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.emptyWrap}>
              <span className={styles.emptyIcon} aria-hidden="true">📢</span>
              <p className={styles.emptyText}>
                {filter === 'ALL'
                  ? '아직 작성된 홍보 멘트가 없어요.'
                  : `${PROMOTION_CHANNEL_LABEL[filter]} 채널 홍보 멘트가 없어요.`}
              </p>
              <button
                type="button"
                className={styles.emptyAddBtn}
                onClick={() => setModal({ mode: 'create' })}
              >
                + 첫 번째 홍보 멘트 작성하기
              </button>
            </div>
          ) : (
            <div className={styles.list}>
              {filtered.map((promo) => (
                <PromotionCard
                  key={promo.id}
                  promotion={promo}
                  onEdit={(p) => setModal({ mode: 'edit', promotion: p })}
                  onDelete={(id) => deletePromotion.mutate(id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FAB */}
      <button
        type="button"
        className={styles.fab}
        onClick={() => setModal({ mode: 'create' })}
        aria-label="홍보 멘트 작성"
        title="홍보 멘트 작성"
      >
        +
      </button>

      {/* 작성/수정 모달 */}
      <PromotionComposerModal
        open={!!modal}
        editTarget={modal?.mode === 'edit' ? modal.promotion : undefined}
        isSaving={isSaving}
        onSave={handleSave}
        onClose={() => setModal(null)}
      />
    </div>
  );
}
