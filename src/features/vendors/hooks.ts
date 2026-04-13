import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVendorDetail, fetchVendors } from './api';
import type { VendorFilter, VendorSort } from '@/types/vendor';
import { getWishlist, toggleWishlist } from '@/types/vendor';

// ── Query Keys ───────────────────────────────────────────────────────────────
export const vendorKeys = {
  all:    ()                                    => ['vendors'] as const,
  lists:  ()                                    => ['vendors', 'list'] as const,
  list:   (filter: VendorFilter, sort: VendorSort) =>
            ['vendors', 'list', filter, sort] as const,
  detail: (id: number)                          => ['vendors', 'detail', id] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

/** 업체 목록 (ADR-013: staleTime 5분) */
export function useVendors(filter: VendorFilter, sort: VendorSort) {
  return useQuery({
    queryKey: vendorKeys.list(filter, sort),
    queryFn:  () => fetchVendors(filter, sort),
    staleTime: 300_000,
  });
}

/** 업체 상세 + 리뷰 + 유사 업체 */
export function useVendorDetail(id: number) {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn:  () => fetchVendorDetail(id),
    staleTime: 300_000,
    enabled:  id > 0,
  });
}

// ── 찜하기 (localStorage — TanStack Query 불필요, 동기적 처리) ──────────────

export function useWishlist() {
  const [wishlist, setWishlist] = useState<number[]>(() => getWishlist());

  const toggle = (vendorId: number) => {
    setWishlist(toggleWishlist(vendorId));
  };

  const isWished = (vendorId: number) => wishlist.includes(vendorId);

  return { wishlist, toggle, isWished };
}
