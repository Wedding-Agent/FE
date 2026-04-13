'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useVendors, useWishlist } from '@/features/vendors/hooks';
import type { VendorFilter, VendorSort, VendorStyle } from '@/types/vendor';
import { VendorFilterBar } from '@/components/vendors/VendorFilterBar';
import { VendorSortBar } from '@/components/vendors/VendorSortBar';
import { StudioStyleFilter } from '@/components/studio/StudioStyleFilter';
import { StudioCard } from '@/components/studio/StudioCard';
import styles from './page.module.css';

function parseFilter(sp: ReadonlyURLSearchParams | null): VendorFilter {
  return {
    category: 'studio',
    region:      sp?.get('region')   || undefined,
    maxPrice:    sp?.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined,
    style:       (sp?.get('style') as VendorStyle) || undefined,
    hasRainyPlan: sp?.get('rainy') === 'true' ? true : undefined,
  };
}

function parseSort(sp: ReadonlyURLSearchParams | null): VendorSort {
  return (sp?.get('sort') as VendorSort) || 'recommended';
}

export default function StudioPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const filter = useMemo(() => parseFilter(sp), [sp]);
  const sort   = useMemo(() => parseSort(sp),   [sp]);

  const { data, isLoading, isError } = useVendors(filter, sort);
  const { toggle, isWished } = useWishlist();

  const vendors = data?.vendors ?? [];

  const pushParams = (newFilter: VendorFilter, newSort: VendorSort) => {
    const params = new URLSearchParams();
    if (newFilter.region)          params.set('region',   newFilter.region);
    if (newFilter.maxPrice)        params.set('maxPrice', String(newFilter.maxPrice));
    if (newFilter.style)           params.set('style',    newFilter.style);
    if (newFilter.hasRainyPlan)    params.set('rainy',    'true');
    if (newSort !== 'recommended') params.set('sort',     newSort);
    router.replace(`/couple/studio${params.size ? `?${params}` : ''}`, { scroll: false });
  };

  const handleStyleChange   = (s: VendorStyle | null) =>
    pushParams({ ...filter, style: s ?? undefined }, sort);

  const handleFilterChange  = (f: VendorFilter) =>
    pushParams({ ...f, category: 'studio' }, sort);

  const handleSortChange    = (s: VendorSort) => pushParams(filter, s);

  const handleVendorClick   = (id: number) => router.push(`/couple/vendors/${id}`);

  const handleResetFilters  = () => router.replace('/couple/studio', { scroll: false });

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
        <span className={styles.headerTitle}>포토 스튜디오</span>
        <div style={{ width: 36 }} aria-hidden="true" />
      </div>

      {/* ── 히어로 배너 ── */}
      <div className={styles.hero}>
        <p className={styles.heroLabel}>📷 Wedding Snap</p>
        <h1 className={styles.heroTitle}>순간을 영원으로</h1>
        <p className={styles.heroSub}>웨딩 스냅의 순간을 기억하세요</p>
      </div>

      {/* ── 스타일 필터 (1순위) ── */}
      <StudioStyleFilter selected={filter.style ?? null} onChange={handleStyleChange} />

      {/* ── 보조 필터 (지역/가격/우천플랜) ── */}
      <div className={styles.filterWrap}>
        <VendorFilterBar filter={filter} onChange={handleFilterChange} />
      </div>

      {/* ── 정렬 + 결과 수 ── */}
      <div className={styles.sortRow}>
        <VendorSortBar value={sort} onChange={handleSortChange} />
        {!isLoading && !isError && (
          <p className={styles.resultCount}>
            <strong>{vendors.length}</strong>개 스튜디오
          </p>
        )}
      </div>

      {/* ── 카드 그리드 ── */}
      <div className={styles.gridWrap}>
        {isError ? (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>스튜디오 정보를 불러오는 데 실패했습니다.</p>
            <button type="button" className={styles.retryBtn} onClick={handleResetFilters}>
              다시 시도
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>📷</span>
            <p className={styles.emptyTitle}>조건에 맞는 스튜디오가 없어요</p>
            <p className={styles.emptyDesc}>필터를 조정하거나 초기화해 보세요</p>
            <button type="button" className={styles.resetBtn} onClick={handleResetFilters}>
              필터 초기화
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {vendors.map((vendor) => (
              <StudioCard
                key={vendor.vendor_id}
                vendor={vendor}
                wished={isWished(vendor.vendor_id)}
                onWish={toggle}
                onClick={handleVendorClick}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 80 }} />

      {/* ── Sticky 하단 ── */}
      <div className={styles.stickyBottom}>
        <button
          type="button"
          className={styles.moreBtn}
          onClick={() => router.push('/couple/vendors?category=studio')}
        >
          업체 찾기에서 더 보기
        </button>
      </div>
    </div>
  );
}
