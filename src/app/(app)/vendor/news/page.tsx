'use client';

import { useState } from 'react';
import styles from './page.module.css';

type NewsCategory = 'TREND' | 'POLICY' | 'MARKET' | 'TIPS';

interface NewsItem {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  isBookmarked: boolean;
}

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  TREND:  '트렌드',
  POLICY: '정책·법규',
  MARKET: '시장 동향',
  TIPS:   '업무 팁',
};

const CATEGORY_EMOJI: Record<NewsCategory, string> = {
  TREND:  '✨',
  POLICY: '📋',
  MARKET: '📊',
  TIPS:   '💡',
};

const CATEGORY_COLOR: Record<NewsCategory, string> = {
  TREND:  '#8b5cf6',
  POLICY: '#0ea5e9',
  MARKET: '#22c55e',
  TIPS:   '#f59e0b',
};

const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n-1',
    category: 'TREND',
    title: '2026 웨딩 트렌드: 미니멀 & 내추럴 콘셉트 급부상',
    summary: '올해 결혼식 트렌드는 화려함보다 자연스러움을 강조한 미니멀 스타일이 주목받고 있습니다. 야외 예식과 소규모 가족 중심 예식도 증가세입니다.',
    source: '웨딩산업연구소',
    publishedAt: '2026-04-10',
    isBookmarked: true,
  },
  {
    id: 'n-2',
    category: 'MARKET',
    title: '국내 웨딩 시장 규모 5조 돌파 전망',
    summary: '웨딩 산업 조사 기관에 따르면 2026년 국내 웨딩 시장이 처음으로 5조 원을 넘어설 것으로 예측됩니다. 스몰 웨딩 비중이 전년 대비 18% 증가했습니다.',
    source: '한국웨딩산업협회',
    publishedAt: '2026-04-08',
    isBookmarked: false,
  },
  {
    id: 'n-3',
    category: 'POLICY',
    title: '웨딩 업체 소비자 피해 보상 가이드라인 개정',
    summary: '공정거래위원회가 웨딩 서비스 관련 소비자 분쟁 해결 기준을 개정했습니다. 계약 취소 시 환불 기준이 더욱 명확해졌으며 6월부터 시행됩니다.',
    source: '공정거래위원회',
    publishedAt: '2026-04-05',
    isBookmarked: false,
  },
  {
    id: 'n-4',
    category: 'TIPS',
    title: 'SNS 마케팅으로 예약률 30% 높이는 법',
    summary: '인스타그램 릴스와 쇼츠를 활용한 웨딩 업체 마케팅 전략이 주목받고 있습니다. 비포&애프터 컨텐츠, 비하인드 영상이 특히 높은 전환율을 보입니다.',
    source: '웨딩마케팅연구소',
    publishedAt: '2026-04-03',
    isBookmarked: true,
  },
  {
    id: 'n-5',
    category: 'TREND',
    title: '드론 촬영·AI 편집 서비스 수요 폭발적 증가',
    summary: '웨딩 사진·영상 분야에서 드론 촬영과 AI 자동 편집 서비스 수요가 전년 대비 45% 증가했습니다. 차별화된 영상미를 원하는 커플이 늘고 있습니다.',
    source: '웨딩포토협회',
    publishedAt: '2026-03-28',
    isBookmarked: false,
  },
  {
    id: 'n-6',
    category: 'MARKET',
    title: '수도권 웨딩홀 공실률 감소, 예약 경쟁 심화',
    summary: '2026년 상반기 수도권 웨딩홀 예약률이 85%를 기록하며 코로나 이전 수준을 완전히 회복했습니다. 인기 날짜는 1년 이상 전에 예약이 마감됩니다.',
    source: '결혼준비연구소',
    publishedAt: '2026-03-25',
    isBookmarked: false,
  },
];

type FilterCategory = NewsCategory | 'ALL';

export default function VendorNewsPage() {
  const [filter, setFilter] = useState<FilterCategory>('ALL');
  const [bookmarks, setBookmarks] = useState<Set<string>>(
    () => new Set(MOCK_NEWS.filter((n) => n.isBookmarked).map((n) => n.id)),
  );

  const filtered =
    filter === 'ALL' ? MOCK_NEWS : MOCK_NEWS.filter((n) => n.category === filter);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories: FilterCategory[] = ['ALL', 'TREND', 'MARKET', 'POLICY', 'TIPS'];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>업계 소식</h1>
            <p className={styles.subTitle}>웨딩 업계 트렌드와 최신 뉴스를 확인하세요</p>
          </header>

          {/* 카테고리 탭 */}
          <div className={styles.tabs}>
            {categories.map((cat) => {
              const count = cat === 'ALL' ? MOCK_NEWS.length : MOCK_NEWS.filter((n) => n.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  className={[styles.tab, filter === cat && styles.tabActive].filter(Boolean).join(' ')}
                  onClick={() => setFilter(cat)}
                >
                  {cat !== 'ALL' && `${CATEGORY_EMOJI[cat as NewsCategory]} `}
                  {cat === 'ALL' ? '전체' : CATEGORY_LABEL[cat as NewsCategory]}
                  <span className={styles.tabCount}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* 뉴스 목록 */}
          <div className={styles.list}>
            {filtered.map((news) => (
              <article key={news.id} className={styles.newsCard}>
                <div className={styles.cardTop}>
                  <span
                    className={styles.categoryChip}
                    style={{
                      background: `${CATEGORY_COLOR[news.category]}1a`,
                      color: CATEGORY_COLOR[news.category],
                    }}
                  >
                    {CATEGORY_EMOJI[news.category]} {CATEGORY_LABEL[news.category]}
                  </span>
                  <button
                    type="button"
                    className={styles.bookmarkBtn}
                    onClick={() => toggleBookmark(news.id)}
                    aria-label={bookmarks.has(news.id) ? '북마크 해제' : '북마크'}
                  >
                    {bookmarks.has(news.id) ? '🔖' : '🔗'}
                  </button>
                </div>

                <h2 className={styles.newsTitle}>{news.title}</h2>
                <p className={styles.newsSummary}>{news.summary}</p>

                <div className={styles.newsMeta}>
                  <span className={styles.metaSource}>{news.source}</span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaDate}>
                    {new Date(news.publishedAt).toLocaleDateString('ko-KR', {
                      month: 'long', day: 'numeric',
                    })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
