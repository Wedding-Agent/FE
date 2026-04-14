'use client';

import styles from './page.module.css';

interface StatCard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: string;
}

interface Competitor {
  rank: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  avgPrice: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

const MY_STATS: StatCard[] = [
  { label: '평균 평점',   value: '4.8',    delta: '+0.2 전월 대비', positive: true,  icon: '⭐' },
  { label: '리뷰 수',     value: '127',    delta: '+14 전월 대비',  positive: true,  icon: '💬' },
  { label: '조회수',      value: '3,240',  delta: '-180 전월 대비', positive: false, icon: '👁' },
  { label: '문의 전환율', value: '8.2%',   delta: '+1.1% 전월 대비', positive: true, icon: '📩' },
];

const COMPETITORS: Competitor[] = [
  { rank: 1, name: '스튜디오 루나',    category: '스튜디오 촬영', rating: 4.9, reviewCount: 312, avgPrice: '180만원', trend: 'UP' },
  { rank: 2, name: '블리스 포토',      category: '스튜디오 촬영', rating: 4.8, reviewCount: 248, avgPrice: '160만원', trend: 'STABLE' },
  { rank: 3, name: '내 업체',          category: '스튜디오 촬영', rating: 4.8, reviewCount: 127, avgPrice: '150만원', trend: 'UP' },
  { rank: 4, name: '드림 웨딩 스튜디오', category: '스튜디오 촬영', rating: 4.7, reviewCount: 198, avgPrice: '140만원', trend: 'DOWN' },
  { rank: 5, name: '로맨틱 필름',      category: '스튜디오 촬영', rating: 4.6, reviewCount: 89,  avgPrice: '130만원', trend: 'STABLE' },
];

const TREND_ICON: Record<Competitor['trend'], string> = {
  UP:     '▲',
  DOWN:   '▼',
  STABLE: '━',
};

const TREND_COLOR: Record<Competitor['trend'], string> = {
  UP:     '#22c55e',
  DOWN:   '#e11d48',
  STABLE: '#94a3b8',
};

const KEYWORD_RANKINGS = [
  { keyword: '웨딩 스튜디오 추천', rank: 4,  delta: +2 },
  { keyword: '결혼 사진 촬영',     rank: 7,  delta: -1 },
  { keyword: '야외 웨딩 촬영',     rank: 3,  delta: +3 },
  { keyword: '드론 웨딩 촬영',     rank: 2,  delta:  0 },
  { keyword: '부산 웨딩 스튜디오', rank: 11, delta: +5 },
];

export default function VendorAnalyticsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* 내 업체 현황 */}
        <section className={styles.card}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>내 업체 현황</h2>
            <span className={styles.sectionPeriod}>2026년 3월 기준</span>
          </header>
          <div className={styles.statGrid}>
            {MY_STATS.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statIcon}>{s.icon}</span>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
                <p
                  className={styles.statDelta}
                  style={{ color: s.positive ? '#22c55e' : '#e11d48' }}
                >
                  {s.positive ? '▲' : '▼'} {s.delta}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 경쟁사 비교 */}
        <section className={styles.card}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>경쟁사 비교</h2>
            <span className={styles.sectionPeriod}>같은 카테고리 업체</span>
          </header>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>순위</th>
                  <th className={styles.th}>업체명</th>
                  <th className={styles.th}>평점</th>
                  <th className={styles.th}>리뷰</th>
                  <th className={styles.th}>평균가</th>
                  <th className={styles.th}>추세</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c) => (
                  <tr
                    key={c.rank}
                    className={[styles.tr, c.name === '내 업체' && styles.trHighlight]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <td className={styles.tdRank}>#{c.rank}</td>
                    <td className={styles.tdName}>
                      {c.name}
                      {c.name === '내 업체' && (
                        <span className={styles.meBadge}>나</span>
                      )}
                    </td>
                    <td className={styles.td}>⭐ {c.rating}</td>
                    <td className={styles.td}>{c.reviewCount}</td>
                    <td className={styles.td}>{c.avgPrice}</td>
                    <td
                      className={styles.td}
                      style={{ color: TREND_COLOR[c.trend], fontWeight: 700 }}
                    >
                      {TREND_ICON[c.trend]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 키워드 순위 */}
        <section className={styles.card}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>키워드 검색 순위</h2>
            <span className={styles.sectionPeriod}>플랫폼 내 검색 기준</span>
          </header>
          <div className={styles.keywordList}>
            {KEYWORD_RANKINGS.map((k) => (
              <div key={k.keyword} className={styles.keywordRow}>
                <span className={styles.keywordText}>{k.keyword}</span>
                <div className={styles.keywordRight}>
                  <span className={styles.keywordRank}>{k.rank}위</span>
                  <span
                    className={styles.keywordDelta}
                    style={{
                      color:
                        k.delta > 0 ? '#22c55e' : k.delta < 0 ? '#e11d48' : '#94a3b8',
                    }}
                  >
                    {k.delta > 0 ? `▲${k.delta}` : k.delta < 0 ? `▼${Math.abs(k.delta)}` : '━'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
