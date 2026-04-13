export type BudgetCategory =
  | 'VENUE'
  | 'PHOTO'
  | 'DRESS'
  | 'MAKEUP'
  | 'HONEYMOON'
  | 'CATERING'
  | 'FLOWER'
  | 'GIFT'
  | 'OTHER';

export const ALL_BUDGET_CATEGORIES: BudgetCategory[] = [
  'VENUE', 'PHOTO', 'DRESS', 'MAKEUP',
  'HONEYMOON', 'CATERING', 'FLOWER', 'GIFT', 'OTHER',
];

export const CATEGORY_LABEL: Record<BudgetCategory, string> = {
  VENUE:     '웨딩홀',
  PHOTO:     '사진·영상',
  DRESS:     '드레스·예복',
  MAKEUP:    '헤어·메이크업',
  HONEYMOON: '신혼여행',
  CATERING:  '식대·케이터링',
  FLOWER:    '꽃장식',
  GIFT:      '예물·예단',
  OTHER:     '기타',
};

export const CATEGORY_EMOJI: Record<BudgetCategory, string> = {
  VENUE:     '🏛️',
  PHOTO:     '📷',
  DRESS:     '👗',
  MAKEUP:    '💄',
  HONEYMOON: '✈️',
  CATERING:  '🍽️',
  FLOWER:    '🌸',
  GIFT:      '💍',
  OTHER:     '📦',
};

// ────────────────────────────────────────────────────────────────
// Core domain types
// ────────────────────────────────────────────────────────────────

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  label: string;           // e.g. "그랜드웨딩홀 계약금"
  amount: number;          // KRW integer
  isUnexpected: boolean;
  note?: string;
  documentId?: string;     // linked OCR document id
  receiptImageUrl?: string;
  date: string;            // "YYYY-MM-DD"
  createdAt: string;       // ISO
}

export interface CategoryBudget {
  category: BudgetCategory;
  planned: number;
}

export interface BudgetPlan {
  totalBudget: number;
  categoryBudgets: CategoryBudget[];
}

export interface SpentByCategory {
  category: BudgetCategory;
  spent: number;
}

export interface BudgetSummary {
  plan: BudgetPlan;
  items: BudgetItem[];
  totalSpent: number;
  spentByCategory: SpentByCategory[];
}

// ────────────────────────────────────────────────────────────────
// Color threshold logic
// ────────────────────────────────────────────────────────────────

export type BudgetUsageLevel = 'safe' | 'warn' | 'caution' | 'danger';

export function getUsageLevel(spent: number, planned: number): BudgetUsageLevel {
  if (planned <= 0) return 'safe';
  const ratio = spent / planned;
  if (ratio < 0.5)  return 'safe';
  if (ratio < 0.70) return 'warn';
  if (ratio < 0.90) return 'caution';
  return 'danger';
}

export const USAGE_LEVEL_COLOR: Record<BudgetUsageLevel, string> = {
  safe:    '#22c55e',
  warn:    '#eab308',
  caution: '#f97316',
  danger:  '#ef4444',
};

export const USAGE_LEVEL_BG: Record<BudgetUsageLevel, string> = {
  safe:    'rgba(34,197,94,.12)',
  warn:    'rgba(234,179,8,.12)',
  caution: 'rgba(249,115,22,.12)',
  danger:  'rgba(239,68,68,.12)',
};

export const USAGE_LEVEL_LABEL: Record<BudgetUsageLevel, string> = {
  safe:    '안전',
  warn:    '주의',
  caution: '경고',
  danger:  '위험',
};

// ────────────────────────────────────────────────────────────────
// Formatting helpers
// ────────────────────────────────────────────────────────────────

export function formatKRW(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

export function formatPct(spent: number, planned: number): string {
  if (planned <= 0) return '—';
  return ((spent / planned) * 100).toFixed(1) + '%';
}
