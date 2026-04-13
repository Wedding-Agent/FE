import { apiClient } from '@/lib/api-client';
import { ALL_BUDGET_CATEGORIES as CATS } from '@/types/budget';
import type {
  BudgetItem,
  BudgetCategory,
  BudgetPlan,
  BudgetSummary,
  SpentByCategory,
} from '@/types/budget';

// TODO: BE 연동 시 mock 데이터 제거

function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ────────────────────────────────────────────────────────────────
// Mock state (mutable for CRUD simulation)
// ────────────────────────────────────────────────────────────────

let MOCK_PLAN: BudgetPlan = {
  totalBudget: 30_000_000,
  categoryBudgets: [
    { category: 'VENUE',     planned: 12_000_000 },
    { category: 'PHOTO',     planned:  3_000_000 },
    { category: 'DRESS',     planned:  2_500_000 },
    { category: 'MAKEUP',    planned:  1_200_000 },
    { category: 'HONEYMOON', planned:  4_000_000 },
    { category: 'CATERING',  planned:  4_000_000 },
    { category: 'FLOWER',    planned:  1_000_000 },
    { category: 'GIFT',      planned:  1_500_000 },
    { category: 'OTHER',     planned:    800_000 },
  ],
};

let MOCK_ITEMS: BudgetItem[] = [
  {
    id: 'bi-1',
    category: 'VENUE',
    label: '그랜드웨딩홀 계약금',
    amount: 5_500_000,
    isUnexpected: false,
    documentId: 'mock-1',
    date: '2026-04-10',
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'bi-2',
    category: 'PHOTO',
    label: '포토스튜디오A 스냅촬영',
    amount: 800_000,
    isUnexpected: false,
    documentId: 'mock-2',
    date: '2026-04-08',
    createdAt: '2026-04-08T14:30:00Z',
  },
  {
    id: 'bi-3',
    category: 'DRESS',
    label: '웨딩드레스 대여',
    amount: 1_200_000,
    isUnexpected: false,
    date: '2026-04-05',
    createdAt: '2026-04-05T11:00:00Z',
  },
  {
    id: 'bi-4',
    category: 'MAKEUP',
    label: '헤어·메이크업 리허설',
    amount: 200_000,
    isUnexpected: true,
    note: '추가 리허설 비용 (예상 외 발생)',
    date: '2026-04-09',
    createdAt: '2026-04-09T09:00:00Z',
  },
  {
    id: 'bi-5',
    category: 'HONEYMOON',
    label: '몰디브 항공권',
    amount: 2_400_000,
    isUnexpected: false,
    date: '2026-04-01',
    createdAt: '2026-04-01T16:00:00Z',
  },
  {
    id: 'bi-6',
    category: 'OTHER',
    label: '청첩장 인쇄',
    amount: 150_000,
    isUnexpected: false,
    date: '2026-04-03',
    createdAt: '2026-04-03T13:00:00Z',
  },
];

function computeSummary(): BudgetSummary {
  const spentMap: Record<string, number> = {};
  for (const item of MOCK_ITEMS) {
    spentMap[item.category] = (spentMap[item.category] ?? 0) + item.amount;
  }
  const spentByCategory: SpentByCategory[] = CATS.map((cat) => ({
    category: cat,
    spent: spentMap[cat] ?? 0,
  }));
  const totalSpent = MOCK_ITEMS.reduce((sum, i) => sum + i.amount, 0);

  return {
    plan: { ...MOCK_PLAN, categoryBudgets: [...MOCK_PLAN.categoryBudgets] },
    items: [...MOCK_ITEMS],
    totalSpent,
    spentByCategory,
  };
}

// ────────────────────────────────────────────────────────────────
// API functions
// ────────────────────────────────────────────────────────────────

export async function fetchBudgetSummary(): Promise<BudgetSummary> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return computeSummary();
  }
  return apiClient.get('budget/summary').json<BudgetSummary>();
}

export async function updateBudgetPlan(plan: BudgetPlan): Promise<BudgetPlan> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    MOCK_PLAN = { ...plan, categoryBudgets: [...plan.categoryBudgets] };
    return MOCK_PLAN;
  }
  return apiClient.put('budget/plan', { json: plan }).json<BudgetPlan>();
}

export async function addBudgetItem(
  payload: Omit<BudgetItem, 'id' | 'createdAt'>,
): Promise<BudgetItem> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const newItem: BudgetItem = {
      ...payload,
      id: `bi-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    MOCK_ITEMS.unshift(newItem);
    return newItem;
  }
  return apiClient.post('budget/items', { json: payload }).json<BudgetItem>();
}

export async function updateBudgetItem(
  id: string,
  payload: Partial<Omit<BudgetItem, 'id' | 'createdAt'>>,
): Promise<BudgetItem> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const idx = MOCK_ITEMS.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('항목을 찾을 수 없습니다.');
    MOCK_ITEMS[idx] = { ...MOCK_ITEMS[idx], ...payload };
    return MOCK_ITEMS[idx];
  }
  return apiClient.patch(`budget/items/${id}`, { json: payload }).json<BudgetItem>();
}

export async function deleteBudgetItem(id: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const idx = MOCK_ITEMS.findIndex((i) => i.id === id);
    if (idx !== -1) MOCK_ITEMS.splice(idx, 1);
    return;
  }
  await apiClient.delete(`budget/items/${id}`);
}

export async function importFromDocuments(
  imports: { documentId: string; category: BudgetCategory; label: string; amount: number }[],
): Promise<BudgetItem[]> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 500));
    const newItems: BudgetItem[] = imports.map((imp) => ({
      id: `bi-${Date.now()}-${imp.documentId}`,
      category: imp.category,
      label: imp.label,
      amount: imp.amount,
      isUnexpected: false,
      documentId: imp.documentId,
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    }));
    MOCK_ITEMS.unshift(...newItems);
    return newItems;
  }
  return apiClient
    .post('budget/items/import-from-documents', { json: { imports } })
    .json<BudgetItem[]>();
}
