// ── 열거형 ────────────────────────────────────────────────────────────────────
export type VendorType    = 'venue' | 'studio' | 'dress' | 'makeup' | 'mc';
export type VendorStyle   = '모던' | '클래식' | '자연' | '럭셔리';
export type VendorSort    = 'recommended' | 'rating' | 'price_asc' | 'price_desc';
export type SentimentLabel = 'pos' | 'neu' | 'neg';

// ── Record 상수 ───────────────────────────────────────────────────────────────
export const ALL_VENDOR_TYPES: VendorType[] = ['venue', 'studio', 'dress', 'makeup', 'mc'];
export const ALL_REGIONS = ['강남', '서초', '마포', '홍대', '압구정', '청담', '신촌'];
export const ALL_STYLES: VendorStyle[] = ['모던', '클래식', '자연', '럭셔리'];

export const VENDOR_TYPE_LABEL: Record<VendorType, string> = {
  venue:  '웨딩홀',
  studio: '스튜디오',
  dress:  '드레스',
  makeup: '헤어·메이크업',
  mc:     'MC',
};

export const VENDOR_TYPE_EMOJI: Record<VendorType, string> = {
  venue:  '🏛️',
  studio: '📷',
  dress:  '👗',
  makeup: '💄',
  mc:     '🎙️',
};

export const VENDOR_SORT_LABEL: Record<VendorSort, string> = {
  recommended: '추천순',
  rating:      '평점순',
  price_asc:   '가격 낮은순',
  price_desc:  '가격 높은순',
};

export const SENTIMENT_EMOJI: Record<SentimentLabel, string> = {
  pos: '😊',
  neu: '😐',
  neg: '😔',
};

export const SENTIMENT_COLOR: Record<SentimentLabel, string> = {
  pos: '#22c55e',
  neu: '#94a3b8',
  neg: '#ef4444',
};

/** category별 썸네일 폴백 그라디언트 */
export const VENDOR_THUMBNAIL_GRADIENT: Record<VendorType, string> = {
  venue:  'linear-gradient(135deg, #fda4af, #fb7185)',
  studio: 'linear-gradient(135deg, #c4b5fd, #a78bfa)',
  dress:  'linear-gradient(135deg, #f9a8d4, #f472b6)',
  makeup: 'linear-gradient(135deg, #fed7aa, #fb923c)',
  mc:     'linear-gradient(135deg, #93c5fd, #60a5fa)',
};

// ── 도메인 모델 ───────────────────────────────────────────────────────────────
export interface VendorSummary {
  pros:    string; // ✅ 좋았던 점 (jerry + jean)
  cons:    string; // ⚠️ 아쉬운 점
  caution: string; // 📌 주의사항
}

export interface VendorRecommendation {
  rank:   number; // 1-based 추천 순위 (veyla)
  score:  number; // 0~1 신뢰도 점수 (veyla)
  reason: string; // 추천 이유 텍스트 (jean LLM 생성)
}

export interface Vendor {
  vendor_id:      number;
  name:           string;
  category:       VendorType;
  region:         string;
  style:          VendorStyle;
  capacity:       number;       // 수용 인원 (venue만 유의미)
  price_range:    string;       // "50M-70M"
  price_min:      number;       // 정렬·필터용 (원)
  rating:         number;       // 0~5
  reviews_count:  number;
  tags:           string[];     // jerry 자동 태그
  trustScore:     number;       // 0~1, veyla 신뢰도
  hasRainyPlan:   boolean;      // 우천 플랜 보유
  recommendation: VendorRecommendation;
  summary:        VendorSummary;
}

export interface VendorReview {
  review_id:  string;
  vendor_id:  number;
  author:     string;
  rating:     number;
  content:    string;
  sentiment:  SentimentLabel; // jerry 감성분석
  tags:       string[];       // jerry 자동 태그
  createdAt:  string;         // ISO
}

// ── 필터 / 응답 ───────────────────────────────────────────────────────────────
export interface VendorFilter {
  category?:     VendorType;
  region?:       string;
  maxPrice?:     number;
  style?:        VendorStyle;
  minCapacity?:  number;
  hasRainyPlan?: boolean;
}

export interface VendorListResponse {
  vendors: Vendor[];
  total:   number;
}

export interface VendorDetailResponse {
  vendor:  Vendor;
  reviews: VendorReview[];
  similar: Vendor[]; // 동일 category 유사 업체 (veyla)
}

// ── 헬퍼 함수 ─────────────────────────────────────────────────────────────────

/** "50M-70M" → "5,000~7,000만원" */
export function formatPriceRange(price_range: string): string {
  const parts = price_range.split('-');
  return parts
    .map((p) => p.replace('M', ''))
    .map((n) => `${parseInt(n).toLocaleString('ko-KR')}만원`)
    .join(' ~ ');
}

/** trustScore → 뱃지 레이블 + 색상 */
export function getTrustBadge(score: number): { label: string; color: string } {
  if (score >= 0.9)  return { label: '최고 신뢰', color: '#22c55e' };
  if (score >= 0.75) return { label: '높은 신뢰', color: '#3b82f6' };
  if (score >= 0.6)  return { label: '보통 신뢰', color: '#f59e0b' };
  return                    { label: '참고',      color: '#94a3b8' };
}

/** 별점 → 별 문자열 "★★★★☆" */
export function renderStars(rating: number): string {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ── 찜하기 (localStorage) ─────────────────────────────────────────────────────
const WISHLIST_KEY = 'wishlist_vendors';

export function getWishlist(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]') as number[];
  } catch {
    return [];
  }
}

/** 토글 후 갱신된 배열 반환 */
export function toggleWishlist(vendorId: number): number[] {
  const list = getWishlist();
  const idx  = list.indexOf(vendorId);
  const next = idx === -1 ? [...list, vendorId] : list.filter((id) => id !== vendorId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  return next;
}
