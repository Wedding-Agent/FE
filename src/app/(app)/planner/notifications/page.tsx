'use client';

import { useEffect } from 'react';
import { useNotifications, useMarkAllRead } from '@/features/notifications/hooks';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import styles from './page.module.css';

export default function PlannerNotificationsPage() {
  const { data, isError, refetch } = useNotifications('planner');
  const markAll = useMarkAllRead('planner');
  const notifications = data?.notifications ?? [];
  const hasUnread = notifications.some((n) => !n.isRead);

  // 마운트 시 미읽음 뱃지 즉시 갱신
  useEffect(() => { refetch(); }, [refetch]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>알림</h1>
            <p className={styles.subTitle}>최근 활동 알림</p>
          </div>
          {hasUnread && (
            <button
              type="button"
              className={styles.markAllBtn}
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
            >
              모두 읽음
            </button>
          )}
        </header>

        {isError ? (
          <div className={styles.errorWrap}>
            <p className={styles.errorText}>알림을 불러오지 못했어요.</p>
            <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔔</div>
            <p className={styles.emptyTitle}>아직 알림이 없어요</p>
            <p className={styles.emptyDesc}>새로운 소식이 생기면 알려드릴게요</p>
          </div>
        ) : (
          <div className={styles.list}>
            {notifications.map((n) => (
              <NotificationItem key={n.notificationId} notification={n} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
