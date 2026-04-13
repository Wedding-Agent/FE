'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CloudRain, Heart, MessageCircle } from 'lucide-react';
import { useVendorDetail, useWishlist } from '@/features/vendors/hooks';
import {
  formatPriceRange,
  getTrustBadge,
  VENDOR_THUMBNAIL_GRADIENT,
  VENDOR_TYPE_EMOJI,
  VENDOR_TYPE_LABEL,
} from '@/types/vendor';
import { ReviewCard } from '@/components/vendors/ReviewCard';
import { SentimentSummary } from '@/components/vendors/SentimentSummary';
import { SimilarVendorRow } from '@/components/vendors/SimilarVendorRow';
import { cn } from '@/lib/cn';
import styles from './page.module.css';

export default function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const vendorId = Number(id);
  const router = useRouter();

  const { data, isLoading, isError } = useVendorDetail(vendorId);
  const { isWished, toggle } = useWishlist();

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button type="button" className={styles.backBtn} onClick={() => router.back()}>
            <ChevronLeft size={22} />
          </button>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeleton} style={{ height: i === 0 ? 200 : 80 }} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button type="button" className={styles.backBtn} onClick={() => router.back()}>
            <ChevronLeft size={22} />
          </button>
        </div>
        <div className={styles.errorBox}>
          <p className={styles.errorText}>업체 정보를 불러오는 데 실패했습니다.</p>
          <button type="button" className={styles.retryBtn} onClick={() => router.back()}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const { vendor, reviews, similar } = data;
  const trust = getTrustBadge(vendor.trustScore);
  const wished = isWished(vendor.vendor_id);

  return (
    <div className={styles.page}>
      {/* ── 헤더 ── */}
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={() => router.back()} aria-label="뒤로가기">
          <ChevronLeft size={22} />
        </button>
        <span className={styles.headerTitle}>{vendor.name}</span>
        <button
          type="button"
          className={cn(styles.wishBtn, wished && styles.wishBtnActive)}
          onClick={() => toggle(vendor.vendor_id)}
          aria-label={wished ? '찜 취소' : '찜하기'}
          aria-pressed={wished}
        >
          <Heart size={20} fill={wished ? '#fb7185' : 'none'} />
        </button>
      </div>

      {/* ── 썸네일 ── */}
      <div
        className={styles.thumbnail}
        style={{ background: VENDOR_THUMBNAIL_GRADIENT[vendor.category] }}
        aria-hidden="true"
      >
        <span className={styles.thumbnailEmoji}>{VENDOR_TYPE_EMOJI[vendor.category]}</span>
      </div>

      {/* ── 콘텐츠 스크롤 영역 ── */}
      <div className={styles.content}>

        {/* ── 기본 정보 ── */}
        <section className={styles.section}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryChip}>
              {VENDOR_TYPE_EMOJI[vendor.category]} {VENDOR_TYPE_LABEL[vendor.category]}
            </span>
            <span
              className={styles.trustChip}
              style={{ background: `${trust.color}18`, color: trust.color }}
            >
              {trust.label}
            </span>
            {vendor.hasRainyPlan && (
              <span className={styles.rainyChip}>
                <CloudRain size={11} /> 우천 플랜
              </span>
            )}
          </div>

          <h1 className={styles.vendorName}>{vendor.name}</h1>

          <div className={styles.metaGrid}>
            <span>📍 {vendor.region}</span>
            <span>💰 {formatPriceRange(vendor.price_range)}</span>
            {vendor.category === 'venue' && vendor.capacity > 0 && (
              <span>👥 최대 {vendor.capacity.toLocaleString()}명</span>
            )}
            <span>✨ {vendor.style}</span>
          </div>

          <div className={styles.ratingRow}>
            <span className={styles.starIcon}>★</span>
            <span className={styles.ratingNum}>{vendor.rating.toFixed(1)}</span>
            <span className={styles.reviewCount}>({vendor.reviews_count}개 리뷰)</span>
            <span className={styles.trustScore}>
              신뢰도 {Math.round(vendor.trustScore * 100)}%
            </span>
          </div>

          {vendor.tags.length > 0 && (
            <div className={styles.tags}>
              {vendor.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </section>

        {/* ── AI 추천 이유 ── */}
        <section className={styles.section}>
          <div className={styles.aiCard}>
            <p className={styles.aiTitle}>🤖 AI 추천 이유</p>
            <p className={styles.aiReason}>{vendor.recommendation.reason}</p>
          </div>
        </section>

        {/* ── 감성분석 요약 ── */}
        <section className={styles.section}>
          <SentimentSummary summary={vendor.summary} />
        </section>

        {/* ── 리뷰 ── */}
        {reviews.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              리뷰 <span className={styles.sectionCount}>{reviews.length}</span>
            </h2>
            <div className={styles.reviewList}>
              {reviews.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))}
            </div>
          </section>
        )}

        {/* ── 유사 업체 ── */}
        {similar.length > 0 && (
          <section className={styles.section}>
            <SimilarVendorRow
              vendors={similar}
              onSelect={(id) => router.push(`/couple/vendors/${id}`)}
            />
          </section>
        )}

        {/* 하단 여백 (sticky 버튼 공간) */}
        <div style={{ height: 80 }} />
      </div>

      {/* ── Sticky 하단 문의 버튼 ── */}
      <div className={styles.stickyBottom}>
        <button
          type="button"
          className={styles.contactBtn}
          onClick={() => router.push('/couple/chat')}
        >
          <MessageCircle size={18} />
          채팅으로 문의하기
        </button>
      </div>
    </div>
  );
}
