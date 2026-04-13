'use client';

import { useMemo, useState } from 'react';
import { SmsScheduleCard } from '@/components/sms-automation/SmsScheduleCard';
import { SmsComposerModal } from '@/components/sms-automation/SmsComposerModal';
import { useSmsSchedules, useCreateSms, useDeleteSms, useSendSmsNow } from '@/features/sms-automation/hooks';
import type { CreateSmsInput } from '@/types/sms-automation';
import styles from './page.module.css';

type TabType = 'scheduled' | 'history';

export default function PlannerSmsPage() {
  const [tab, setTab] = useState<TabType>('scheduled');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: schedules = [], isLoading, isError, refetch } = useSmsSchedules();
  const createSms  = useCreateSms();
  const deleteSms  = useDeleteSms();
  const sendNow    = useSendSmsNow();

  const filtered = useMemo(
    () =>
      tab === 'scheduled'
        ? schedules.filter((s) => s.status === 'scheduled')
        : schedules.filter((s) => s.status !== 'scheduled').sort((a, b) => {
            const ta = a.sentAt ?? a.scheduledAt ?? a.createdAt;
            const tb = b.sentAt ?? b.scheduledAt ?? b.createdAt;
            return tb.localeCompare(ta);
          }),
    [schedules, tab],
  );

  const handleSend = (data: CreateSmsInput) => {
    createSms.mutate(data, { onSuccess: () => setModalOpen(false) });
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.card}>
          {/* 헤더 */}
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>SMS 자동화</h1>
            <p className={styles.subTitle}>고객에게 알림 문자를 자동 발송해요</p>
          </header>

          {/* 탭 */}
          <div className={styles.tabs}>
            {(['scheduled', 'history'] as TabType[]).map((t) => (
              <button
                key={t}
                type="button"
                className={[styles.tab, tab === t && styles.tabActive].filter(Boolean).join(' ')}
                onClick={() => setTab(t)}
              >
                {t === 'scheduled' ? '예약 발송' : '발송 이력'}
                {t === 'scheduled' && schedules.filter((s) => s.status === 'scheduled').length > 0 && (
                  <span className={styles.tabBadge}>
                    {schedules.filter((s) => s.status === 'scheduled').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 목록 */}
          {isError ? (
            <div className={styles.errorWrap}>
              <p className={styles.errorText}>SMS 목록을 불러오는 데 실패했습니다.</p>
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
              <span className={styles.emptyIcon} aria-hidden="true">
                {tab === 'scheduled' ? '📨' : '📋'}
              </span>
              <p className={styles.emptyText}>
                {tab === 'scheduled'
                  ? '예약된 SMS가 없어요.'
                  : '발송 이력이 없어요.'}
              </p>
              {tab === 'scheduled' && (
                <button
                  type="button"
                  className={styles.emptyAddBtn}
                  onClick={() => setModalOpen(true)}
                >
                  + SMS 등록하기
                </button>
              )}
            </div>
          ) : (
            <div className={styles.list}>
              {filtered.map((schedule) => (
                <SmsScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onSendNow={(id) => sendNow.mutate(id)}
                  onDelete={(id) => {
                    if (confirm('SMS를 삭제할까요?')) deleteSms.mutate(id);
                  }}
                  isSending={sendNow.isPending}
                  isDeleting={deleteSms.isPending}
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
        onClick={() => setModalOpen(true)}
        aria-label="SMS 등록"
        title="SMS 등록"
      >
        +
      </button>

      {/* 작성 모달 */}
      <SmsComposerModal
        open={modalOpen}
        isSaving={createSms.isPending}
        onSend={handleSend}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
