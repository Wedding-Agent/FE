'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Plus } from 'lucide-react';
import type { CreateTaskInput, SharedTask } from '@/types/couple-space';
import {
  useCreateTask,
  useDeleteTask,
  useSharedTasks,
  useToggleTask,
  useUpdateTask,
} from '@/features/couple-space/hooks';
import { useWeddingInfo } from '@/features/calendar/hooks';
import { CoupleProfileCard }    from '@/components/couple-space/CoupleProfileCard';
import { SharedChecklistItem }  from '@/components/couple-space/SharedChecklistItem';
import { TaskModal }            from '@/components/couple-space/TaskModal';
import styles from './page.module.css';

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; task: SharedTask }
  | null;

const QUICK_LINKS = [
  { emoji: '📅', label: '웨딩 캘린더',  href: '/couple/calendar'  },
  { emoji: '💰', label: '예산 관리',    href: '/couple/budget'    },
  { emoji: '🔍', label: '업체 찾기',    href: '/couple/vendors'   },
  { emoji: '📖', label: '웨딩 스토리',  href: '/couple/story'     },
] as const;

export default function CoupleSpacePage() {
  const router = useRouter();
  const [showDone, setShowDone] = useState(false);
  const [modal,    setModal]    = useState<ModalState>(null);

  // ── 데이터 ────────────────────────────────────────────────────────────────
  const { data: weddingInfo }                      = useWeddingInfo();
  const { data, isLoading, isError, refetch }      = useSharedTasks();
  const tasks = data ?? [];

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const toggleMutation = useToggleTask();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const pendingTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);
  const doneTasks    = useMemo(() => tasks.filter((t) =>  t.done), [tasks]);

  // ── 핸들러 ────────────────────────────────────────────────────────────────
  const handleSubmit = (input: CreateTaskInput) => {
    if (modal?.mode === 'edit') {
      updateMutation.mutate(
        { ...input, id: modal.task.id },
        { onSuccess: () => setModal(null) },
      );
    } else {
      createMutation.mutate(input, { onSuccess: () => setModal(null) });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('이 할 일을 삭제할까요?')) return;
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
        <span className={styles.headerTitle}>커플 스페이스</span>
        <div style={{ width: 36 }} aria-hidden="true" />
      </div>

      {/* ── 커플 프로필 카드 ── */}
      {weddingInfo ? (
        <CoupleProfileCard
          weddingInfo={weddingInfo}
          doneCount={doneTasks.length}
          totalCount={tasks.length}
        />
      ) : (
        <div className={styles.profileSkeleton} aria-hidden="true" />
      )}

      {/* ── 체크리스트 섹션 ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📋 우리의 체크리스트</h2>
          {!isLoading && !isError && (
            <p className={styles.taskCount}>
              <strong>{pendingTasks.length}</strong>개 남음 / 전체 {tasks.length}개
            </p>
          )}
        </div>

        {isError ? (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>할 일을 불러오는 데 실패했습니다.</p>
            <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.list}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeleton} aria-hidden="true" />
            ))}
          </div>
        ) : (
          <>
            {/* 미완료 목록 */}
            {pendingTasks.length === 0 && doneTasks.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyEmoji}>✅</span>
                <p className={styles.emptyTitle}>아직 할 일이 없어요</p>
                <p className={styles.emptyDesc}>웨딩 준비 할 일을 추가해보세요</p>
                <button
                  type="button"
                  className={styles.addEmptyBtn}
                  onClick={() => setModal({ mode: 'create' })}
                >
                  할 일 추가
                </button>
              </div>
            ) : (
              <div className={styles.list}>
                {pendingTasks.map((task) => (
                  <SharedChecklistItem
                    key={task.id}
                    task={task}
                    onToggle={(id) => toggleMutation.mutate(id)}
                    onEdit={(t)   => setModal({ mode: 'edit', task: t })}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {/* 완료 항목 토글 */}
            {doneTasks.length > 0 && (
              <>
                <button
                  type="button"
                  className={styles.doneToggleBtn}
                  onClick={() => setShowDone((v) => !v)}
                >
                  {showDone
                    ? `완료된 항목 숨기기`
                    : `완료된 항목 ${doneTasks.length}개 보기`}
                </button>
                {showDone && (
                  <div className={styles.list}>
                    {doneTasks.map((task) => (
                      <SharedChecklistItem
                        key={task.id}
                        task={task}
                        onToggle={(id) => toggleMutation.mutate(id)}
                        onEdit={(t)   => setModal({ mode: 'edit', task: t })}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ── 빠른 링크 ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ 빠른 링크</h2>
        <div className={styles.quickGrid}>
          {QUICK_LINKS.map(({ emoji, label, href }) => (
            <Link key={href} href={href} className={styles.quickLink}>
              <span className={styles.quickLinkEmoji}>{emoji}</span>
              <span className={styles.quickLinkLabel}>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ height: 80 }} />

      {/* ── FAB ── */}
      <button
        type="button"
        className={styles.fab}
        onClick={() => setModal({ mode: 'create' })}
        aria-label="할 일 추가"
      >
        <Plus size={22} />
      </button>

      {/* ── 모달 ── */}
      {modal !== null && (
        <TaskModal
          mode={modal.mode}
          task={modal.mode === 'edit' ? modal.task : undefined}
          isSaving={isSaving}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
