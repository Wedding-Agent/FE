'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useVendors, useWishlist } from '@/features/vendors/hooks';
import type { VendorFilter, VendorSort, VendorType } from '@/types/vendor';
import { VendorTypeFilter } from '@/components/vendors/VendorTypeFilter';
import { VendorFilterBar } from '@/components/vendors/VendorFilterBar';
import { VendorSortBar } from '@/components/vendors/VendorSortBar';
import { VendorCard } from '@/components/vendors/VendorCard';
import styles from './page.module.css';

// ── URL QueryString ↔ 필터/정렬 변환 ─────────────────────────────────────────
function parseFilter(sp: ReturnType<typeof useSearchParams>): VendorFilter {
  if (!sp) return {};
  return {
    category:    (sp.get('category') as VendorType) || undefined,
    region:      sp.get('region')    || undefined,
    maxPrice:    sp.get('maxPrice')  ? Number(sp.get('maxPrice'))  : undefined,
    style:       (sp.get('style') as VendorFilter['style']) || undefined,
    minCapacity: sp.get('minCapacity') ? Number(sp.get('minCapacity')) : undefined,
    hasRainyPlan: sp.get('hasRainyPlan') === 'true' ? true : undefined,
  };
}

function parseSort(sp: ReturnType<typeof useSearchParams>): VendorSort {
  return ((sp?.get('sort') as VendorSort) || 'recommended');
}

export default function VendorsPage() {
  const router      = useRouter();
  const sp     = useSearchParams();
  const filter = useMemo(() => parseFilter(sp), [sp]);
  const sort   = useMemo(() => parseSort(sp),   [sp]);

  // 검색 (클라이언트사이드)
  const [searchText, setSearchText]   = useState('');
  const [showSearch, setShowSearch]   = useState(false);

  const { data, isLoading, isError, refetch } = useVendors(filter, sort);
  const { isWished, toggle } = useWishlist();

  // 검색 필터링
  const vendors = useMemo(() => {
    const list = data?.vendors ?? [];
    if (!searchText.trim()) return list;
    const kw = searchText.trim().toLowerCase();
    return list.filter(
      (v) => v.name.toLowerCase().includes(kw) || v.region.toLowerCase().includes(kw) ||
             v.tags.some((t) => t.toLowerCase().includes(kw)),
    );
  }, [data?.vendors, searchText]);

  // URL 업데이트 헬퍼
  const pushParams = (newFilter: VendorFilter, newSort: VendorSort) => {
    const params = new URLSearchParams();
    if (newFilter.category)     params.set('category',    newFilter.category);
    if (newFilter.region)       params.set('region',      newFilter.region);
    if (newFilter.maxPrice)     params.set('maxPrice',    String(newFilter.maxPrice));
    if (newFilter.style)        params.set('style',       newFilter.style);
    if (newFilter.minCapacity)  params.set('minCapacity', String(newFilter.minCapacity));
    if (newFilter.hasRainyPlan) params.set('hasRainyPlan', 'true');
    if (newSort !== 'recommended') params.set('sort', newSort);
    router.replace(`/couple/vendors${params.size ? `?${params}` : ''}`, { scroll: false });
  };

  const handleTypeChange = (type: VendorType | null) =>
    pushParams({ ...filter, category: type ?? undefined }, sort);

  const handleFilterChange = (f: VendorFilter) =>
    pushParams({ ...f, category: filter.category }, sort);

  const handleSortChange = (s: VendorSort) =>
    pushParams(filter, s);

  const handleVendorClick = (id: number) =>
    router.push(`/couple/vendors/${id}`);

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <div className={styles.header}>
        {showSearch ? (
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="업체 이름, 지역, 태그 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className={styles.searchCloseBtn}
              onClick={() => { setShowSearch(false); setSearchText(''); }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div>
              <h1 className={styles.title}>업체 찾기</h1>
              <p className={styles.subtitle}>웨딩 준비에 필요한 업체를 찾아보세요</p>
            </div>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => setShowSearch(true)}
              aria-label="검색"
            >
              <Search size={18} />
            </button>
          </>
        )}
      </div>

      {/* 카테고리 탭 */}
      <VendorTypeFilter
        selected={filter.category ?? null}
        onChange={handleTypeChange}
      />

      {/* 필터 바 */}
      <div className={styles.filterWrap}>
        <VendorFilterBar
          filter={filter}
          onChange={handleFilterChange}
        />
      </div>

      {/* 정렬 + 결과 수 */}
      <div className={styles.sortWrap}>
        <VendorSortBar value={sort} onChange={handleSortChange} />
        {!isLoading && !isError && (
          <p className={styles.resultCount}>
            총 <strong>{vendors.length}</strong>개 업체
          </p>
        )}
      </div>

      {/* 업체 목록 */}
      <div className={styles.listWrap}>
        {isError ? (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>업체 정보를 불러오는 데 실패했습니다.</p>
            <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        ) : isLoading ? (
          // 스켈레톤
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeleton} aria-hidden="true" />
          ))
        ) : vendors.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🔍</span>
            <p className={styles.emptyTitle}>
              {searchText ? `"${searchText}" 검색 결과가 없어요` : '조건에 맞는 업체가 없어요'}
            </p>
            <p className={styles.emptyDesc}>필터를 변경해보세요</p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => { setSearchText(''); pushParams({}, 'recommended'); }}
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {vendors.map((vendor) => (
              <VendorCard
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
    </div>
  );
}
