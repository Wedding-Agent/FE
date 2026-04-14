'use client';

import { useState } from 'react';
import styles from './page.module.css';

type RevenueStatus = 'PAID' | 'PENDING' | 'PARTIAL';

interface RevenueItem {
  id: string;
  customerName: string;
  serviceName: string;
  weddingDate: string;
  totalAmount: number;
  paidAmount: number;
  status: RevenueStatus;
}

interface MonthlySummary {
  month: string;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  count: number;
}

const STATUS_LABEL: Record<RevenueStatus, string> = {
  PAID:    '완납',
  PENDING: '미납',
  PARTIAL: '부분납',
};

const STATUS_COLOR: Record<RevenueStatus, string> = {
  PAID:    '#22c55e',
  PENDING: '#e11d48',
  PARTIAL: '#f59e0b',
};

const MOCK_ITEMS: RevenueItem[] = [
  { id: 'rv-1', customerName: '정하은·강민준', serviceName: '영상 촬영 풀 패키지', weddingDate: '2026-05-10', totalAmount: 2_200_000, paidAmount: 2_200_000, status: 'PAID' },
  { id: 'rv-2', customerName: '김민지·이준호',  serviceName: '스튜디오 촬영 패키지 A', weddingDate: '2026-06-14', totalAmount: 1_500_000, paidAmount: 750_000,   status: 'PARTIAL' },
  { id: 'rv-3', customerName: '박소연·최현우',  serviceName: '스튜디오 촬영 패키지 B', weddingDate: '2026-07-05', totalAmount: 980_000,   paidAmount: 0,          status: 'PENDING' },
  { id: 'rv-4', customerName: '이수빈·한도윤',  serviceName: '스튜디오 촬영 패키지 A', weddingDate: '2026-08-23', totalAmount: 1_500_000, paidAmount: 500_000,    status: 'PARTIAL' },
  { id: 'rv-5', customerName: '한지수·임성준',  serviceName: '드론 야외 촬영',         weddingDate: '2026-04-26', totalAmount: 800_000,   paidAmount: 800_000,    status: 'PAID' },
];

const MOCK_MONTHLY: MonthlySummary[] = [
  { month: '2026-01', totalRevenue: 5_200_000, paidRevenue: 4_800_000, pendingRevenue: 400_000,   count: 4 },
  { month: '2026-02', totalRevenue: 3_800_000, paidRevenue: 3_800_000, pendingRevenue: 0,           count: 3 },
  { month: '2026-03', totalRevenue: 6_500_000, paidRevenue: 5_200_000, pendingRevenue: 1_300_000, count: 5 },
  { month: '2026-04', totalRevenue: 3_000_000, paidRevenue: 3_000_000, pendingRevenue: 0,           count: 2 },
];

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

type ViewTab = 'DETAIL' | 'MONTHLY';

export default function VendorRevenuePage() {
  const [tab, setTab] = useState<ViewTab>('DETAIL');

  const totalRevenue  = MOCK_ITEMS.reduce((s, i) => s + i.totalAmount,  0);
  const paidRevenue   = MOCK_ITEMS.reduce((s, i) => s + i.paidAmount,   0);
  const pendingRevenue = totalRevenue - paidRevenue;

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* 요약 카드 */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>총 매출</p>
            <p className={styles.summaryValue}>{fmt(totalRevenue)}</p>
          </div>
          <div className={[styles.summaryCard, styles.summaryPaid].join(' ')}>
            <p className={styles.summaryLabel}>수금 완료</p>
            <p className={styles.summaryValue}>{fmt(paidRevenue)}</p>
          </div>
          <div className={[styles.summaryCard, styles.summaryPending].join(' ')}>
            <p className={styles.summaryLabel}>미수금</p>
            <p className={styles.summaryValue}>{fmt(pendingRevenue)}</p>
          </div>
        </div>

        {/* 상세 / 월별 탭 */}
        <section className={styles.card}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={[styles.tab, tab === 'DETAIL' && styles.tabActive].filter(Boolean).join(' ')}
              onClick={() => setTab('DETAIL')}
            >
              건별 내역
            </button>
            <button
              type="button"
              className={[styles.tab, tab === 'MONTHLY' && styles.tabActive].filter(Boolean).join(' ')}
              onClick={() => setTab('MONTHLY')}
            >
              월별 요약
            </button>
          </div>

          {tab === 'DETAIL' ? (
            <div className={styles.list}>
              {MOCK_ITEMS.map((item) => {
                const ratio = item.totalAmount > 0
                  ? Math.round((item.paidAmount / item.totalAmount) * 100)
                  : 0;
                return (
                  <div key={item.id} className={styles.revenueCard}>
                    <div className={styles.cardTop}>
                      <div>
                        <p className={styles.customerName}>{item.customerName}</p>
                        <p className={styles.serviceName}>{item.serviceName}</p>
                      </div>
                      <span
                        className={styles.statusBadge}
                        style={{
                          background: `${STATUS_COLOR[item.status]}1a`,
                          color: STATUS_COLOR[item.status],
                        }}
                      >
                        {STATUS_LABEL[item.status]}
                      </span>
                    </div>

                    <div className={styles.amountRow}>
                      <span className={styles.amountLabel}>계약금</span>
                      <span className={styles.amountTotal}>{fmt(item.totalAmount)}</span>
                    </div>
                    <div className={styles.amountRow}>
                      <span className={styles.amountLabel}>수금액</span>
                      <span
                        className={styles.amountPaid}
                        style={{ color: STATUS_COLOR[item.status] }}
                      >
                        {fmt(item.paidAmount)}
                      </span>
                    </div>

                    {/* 진행 바 */}
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${ratio}%`,
                          background: STATUS_COLOR[item.status],
                        }}
                      />
                    </div>
                    <p className={styles.progressLabel}>{ratio}% 수금</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.list}>
              {MOCK_MONTHLY.map((m) => {
                const ratio = m.totalRevenue > 0
                  ? Math.round((m.paidRevenue / m.totalRevenue) * 100)
                  : 0;
                const [year, month] = m.month.split('-');
                return (
                  <div key={m.month} className={styles.revenueCard}>
                    <div className={styles.cardTop}>
                      <p className={styles.customerName}>{year}년 {parseInt(month)}월</p>
                      <span className={styles.countBadge}>{m.count}건</span>
                    </div>

                    <div className={styles.amountRow}>
                      <span className={styles.amountLabel}>총 매출</span>
                      <span className={styles.amountTotal}>{fmt(m.totalRevenue)}</span>
                    </div>
                    <div className={styles.amountRow}>
                      <span className={styles.amountLabel}>수금</span>
                      <span className={styles.amountPaid} style={{ color: '#22c55e' }}>
                        {fmt(m.paidRevenue)}
                      </span>
                    </div>
                    {m.pendingRevenue > 0 && (
                      <div className={styles.amountRow}>
                        <span className={styles.amountLabel}>미수금</span>
                        <span className={styles.amountPaid} style={{ color: '#e11d48' }}>
                          {fmt(m.pendingRevenue)}
                        </span>
                      </div>
                    )}

                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${ratio}%`, background: '#22c55e' }}
                      />
                    </div>
                    <p className={styles.progressLabel}>{ratio}% 수금</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
