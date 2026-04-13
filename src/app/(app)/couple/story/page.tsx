'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus } from 'lucide-react';
import type { CreateStoryInput, StoryEntry, StoryMilestone } from '@/types/story';
import {
  useCreateStory,
  useDeleteStory,
  useStories,
  useToggleLike,
  useUpdateStory,
} from '@/features/story/hooks';
import { MilestoneFilter } from '@/components/story/MilestoneFilter';
import { StoryCard }       from '@/components/story/StoryCard';
import { StoryModal }      from '@/components/story/StoryModal';
import styles from './page.module.css';

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; entry: StoryEntry }
  | null;

export default function StoryPage() {
  const router = useRouter();
  const [milestone, setMilestone] = useState<StoryMilestone | null>(null);
  const [modal,     setModal]     = useState<ModalState>(null);

  // ── 데이터 ────────────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useStories(milestone);
  const stories = data ?? [];

  const createMutation = useCreateStory(milestone);
  const updateMutation = useUpdateStory(milestone);
  const deleteMutation = useDeleteStory(milestone);
  const likeMutation   = useToggleLike(milestone);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ── 핸들러 ────────────────────────────────────────────────────────────────
  const handleSubmit = (input: CreateStoryInput) => {
    if (modal?.mode === 'edit') {
      updateMutation.mutate(
        { ...input, id: modal.entry.id },
        { onSuccess: () => setModal(null) },
      );
    } else {
      createMutation.mutate(input, { onSuccess: () => setModal(null) });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('이 스토리를 삭제할까요?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className={styles.page}>
      {/* ── 헤더 ── */}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={22} />
        </button>
        <span className={styles.headerTitle}>웨딩 스토리</span>
        <div style={{ width: 36 }} aria-hidden="true" />
      </div>

      {/* ── 히어로 배너 ── */}
      <div className={styles.hero}>
        <p className={styles.heroLabel}>📖 Our Wedding Journey</p>
        <h1 className={styles.heroTitle}>우리만의 웨딩 스토리</h1>
        <p className={styles.heroSub}>소중한 순간을 기록하세요</p>
      </div>

      {/* ── 마일스톤 필터 ── */}
      <MilestoneFilter selected={milestone} onChange={setMilestone} />

      {/* ── 결과 수 ── */}
      {!isLoading && !isError && (
        <p className={styles.resultCount}>
          <strong>{stories.length}</strong>개의 스토리
        </p>
      )}

      {/* ── 카드 목록 ── */}
      <div className={styles.listWrap}>
        {isError ? (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>스토리를 불러오는 데 실패했습니다.</p>
            <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.list}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.skeleton} aria-hidden="true" />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>📖</span>
            <p className={styles.emptyTitle}>
              {milestone ? '해당 마일스톤의 스토리가 없어요' : '첫 번째 스토리를 기록해보세요'}
            </p>
            <p className={styles.emptyDesc}>
              {milestone ? '다른 마일스톤을 선택해보세요' : '소중한 웨딩 여정을 일지로 남겨보세요'}
            </p>
            <button
              type="button"
              className={styles.addEmptyBtn}
              onClick={() => setModal({ mode: 'create' })}
            >
              스토리 추가
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {stories.map((entry) => (
              <StoryCard
                key={entry.id}
                entry={entry}
                onLike={(id) => likeMutation.mutate(id)}
                onEdit={(e) => setModal({ mode: 'edit', entry: e })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 80 }} />

      {/* ── FAB ── */}
      <button
        type="button"
        className={styles.fab}
        onClick={() => setModal({ mode: 'create' })}
        aria-label="스토리 추가"
      >
        <Plus size={22} />
      </button>

      {/* ── 모달 ── */}
      {modal !== null && (
        <StoryModal
          mode={modal.mode}
          entry={modal.mode === 'edit' ? modal.entry : undefined}
          isSaving={isSaving}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
