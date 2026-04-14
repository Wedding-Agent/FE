'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
type StatusFilter = ReservationStatus | 'ALL';

interface Reservation {
  id: string;
  customerName: string;
  weddingDate: string;       // 'YYYY-MM-DD'
  serviceName: string;
  status: ReservationStatus;
  amount: number;
  note?: string;
}

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING:   '대기 중',
  CONFIRMED: '확정',
  COMPLETED: '완료',
  CANCELLED: '취소됨',
};

const STATUS_COLOR: Record<ReservationStatus, string> = {
  PENDING:   '#f59e0b',
  CONFIRMED: '#2E7BFF',
  COMPLETED: '#22c55e',
  CANCELLED: '#94a3b8',
};

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'r-1',
    customerName: '김민지·이준호',
    weddingDate: '2026-06-14',
    serviceName: '스튜디오 촬영 패키지 A',
    status: 'CONFIRMED',
    amount: 1_500_000,
    note: '야외 촬영 포함, 드레스 3벌',
  },
  {
    id: 'r-2',
    customerName: '박소연·최현우',
    weddingDate: '2026-07-05',
    serviceName: '스튜디오 촬영 패키지 B',
    status: 'PENDING',
    amount: 980_000,
    note: '실내 촬영만',
  },
  {
    id: 'r-3',
    customerName: '정하은·강민준',
    weddingDate: '2026-05-10',
    serviceName: '영상 촬영 풀 패키지',
    status: 'COMPLETED',
    amount: 2_200_000,
  },
  {
    id: 'r-4',
    customerName: '이수빈·한도윤',
    weddingDate: '2026-08-23',
    serviceName: '스튜디오 촬영 패키지 A',
    status: 'PENDING',
    amount: 1_500_000,
    note: '부모님 가족 촬영 추가 요청',
  },
  {
    id: 'r-5',
    customerName: '윤채원·오재원',
    weddingDate: '2026-04-19',
    serviceName: '드론 야외 촬영',
    status: 'CANCELLED',
    amount: 800_000,
    note: '일정 변경으로 취소',
  },
];

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL',       label: '전체' },
  { value: 'PENDING',   label: '대기 중' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'COMPLETED', label: '완료' },
];

export default function VendorReservationsPage() {
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  const filtered = useMemo(
    () =>
      filter === 'ALL'
        ? MOCK_RESERVATIONS
        : MOCK_RESERVATIONS.filter((r) => r.status === filter),
    [filter],
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>예약 관리</h1>
            <p className={styles.subTitle}>고객 예약 현황을 한눈에 확인해요</p>
          </header>

          {/* 상태 탭 */}
          <div className={styles.tabs}>
            {STATUS_TABS.map(({ value, label }) => {
              const count =
                value === 'ALL'
                  ? MOCK_RESERVATIONS.length
                  : MOCK_RESERVATIONS.filter((r) => r.status === value).length;
              return (
                <button
                  key={value}
                  type="button"
                  className={[styles.tab, filter === value && styles.tabActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setFilter(value)}
                >
                  {label}
                  <span className={styles.tabCount}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* 예약 목록 */}
          {filtered.length === 0 ? (
            <div className={styles.emptyWrap}>
              <span className={styles.emptyIcon} aria-hidden="true">📅</span>
              <p className={styles.emptyText}>해당 상태의 예약이 없어요.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {filtered.map((r) => (
                <div key={r.id} className={styles.reservationCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.customerInfo}>
                      <p className={styles.customerName}>{r.customerName}</p>
                      <p className={styles.serviceName}>{r.serviceName}</p>
                    </div>
                    <span
                      className={styles.statusBadge}
                      style={{ background: `${STATUS_COLOR[r.status]}1a`, color: STATUS_COLOR[r.status] }}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon} aria-hidden="true">📅</span>
                      {new Date(r.weddingDate).toLocaleDateString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon} aria-hidden="true">💰</span>
                      {r.amount.toLocaleString('ko-KR')}원
                    </span>
                  </div>

                  {r.note && (
                    <p className={styles.note}>💬 {r.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
