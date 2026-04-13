import { apiClient } from '@/lib/api-client';
import type {
  PlannerCustomerDetail,
  VendorContract,
  CreateContractInput,
  UpdateContractInput,
} from '@/types/planner-customers';

// ── Mock 감지 ────────────────────────────────────────────────────────────────
function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ── Mock 데이터 ──────────────────────────────────────────────────────────────
let MOCK_CUSTOMERS: PlannerCustomerDetail[] = [
  {
    id: 'c-1',
    name: '김민수 · 이수진',
    weddingDate: '2026-06-14',
    color: '#fb7185',
    phone: '010-1234-5678',
    totalBudget: 30_000_000,
    guestCount: 200,
    memo: '로맨틱 컨셉 선호. 스몰 웨딩 지향.',
    vendors: [
      {
        id: 'vc-1-1',
        vendorId: 'v-3',
        vendorName: '그랜드 웨딩홀',
        vendorCategory: '웨딩홀',
        status: 'confirmed',
        contractDate: '2026-02-10',
        amount: 20_000_000,
        memo: '2층 그랜드홀 예약 완료',
      },
      {
        id: 'vc-1-2',
        vendorId: 'v-2',
        vendorName: '로즈드레스',
        vendorCategory: '드레스샵',
        status: 'confirmed',
        contractDate: '2026-03-05',
        amount: 3_000_000,
        memo: '본드레스 A라인 + 피팅 2회 포함',
      },
      {
        id: 'vc-1-3',
        vendorId: 'v-1',
        vendorName: '블루밍 스냅',
        vendorCategory: '스냅 스튜디오',
        status: 'pending',
        memo: '포트폴리오 검토 중',
      },
    ],
  },
  {
    id: 'c-2',
    name: '박준혁 · 최아름',
    weddingDate: '2026-08-22',
    color: '#60a5fa',
    phone: '010-2345-6789',
    totalBudget: 25_000_000,
    guestCount: 150,
    memo: '모던 미니멀 컨셉',
    vendors: [
      {
        id: 'vc-2-1',
        vendorId: 'v-3',
        vendorName: '그랜드 웨딩홀',
        vendorCategory: '웨딩홀',
        status: 'confirmed',
        contractDate: '2026-03-20',
        amount: 18_000_000,
      },
      {
        id: 'vc-2-2',
        vendorId: 'v-1',
        vendorName: '블루밍 스냅',
        vendorCategory: '스냅 스튜디오',
        status: 'confirmed',
        contractDate: '2026-04-01',
        amount: 2_500_000,
      },
      {
        id: 'vc-2-3',
        vendorId: 'v-2',
        vendorName: '로즈드레스',
        vendorCategory: '드레스샵',
        status: 'pending',
        memo: '1차 피팅 예정',
      },
    ],
  },
  {
    id: 'c-3',
    name: '이현호 · 정유나',
    weddingDate: '2026-10-10',
    color: '#a78bfa',
    phone: '010-3456-7890',
    totalBudget: 20_000_000,
    guestCount: 120,
    vendors: [
      {
        id: 'vc-3-1',
        vendorId: 'v-3',
        vendorName: '그랜드 웨딩홀',
        vendorCategory: '웨딩홀',
        status: 'pending',
        memo: '투어 일정 조율 중',
      },
      {
        id: 'vc-3-2',
        vendorId: 'v-2',
        vendorName: '로즈드레스',
        vendorCategory: '드레스샵',
        status: 'pending',
      },
      {
        id: 'vc-3-3',
        vendorId: 'v-1',
        vendorName: '블루밍 스냅',
        vendorCategory: '스냅 스튜디오',
        status: 'pending',
      },
    ],
  },
];

let contractIdCounter = 100;

// ── API 함수 ─────────────────────────────────────────────────────────────────

export async function fetchCustomerList(): Promise<PlannerCustomerDetail[]> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_CUSTOMERS.map((c) => ({ ...c, vendors: [...c.vendors] }));
  }
  return apiClient.get('api/planner/customers').json();
}

export async function fetchCustomerDetail(id: string): Promise<PlannerCustomerDetail> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 100));
    const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
    if (!customer) throw new Error(`Customer ${id} not found`);
    return { ...customer, vendors: [...customer.vendors] };
  }
  return apiClient.get(`api/planner/customers/${id}`).json();
}

export async function createContract(
  customerId: string,
  payload: CreateContractInput,
): Promise<VendorContract> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const contract: VendorContract = {
      ...payload,
      id: `vc-mock-${++contractIdCounter}`,
    };
    MOCK_CUSTOMERS = MOCK_CUSTOMERS.map((c) =>
      c.id === customerId ? { ...c, vendors: [...c.vendors, contract] } : c,
    );
    return contract;
  }
  return apiClient.post(`api/planner/customers/${customerId}/contracts`, { json: payload }).json();
}

export async function updateContract(
  customerId: string,
  contractId: string,
  payload: UpdateContractInput,
): Promise<VendorContract> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    let updated: VendorContract | undefined;
    MOCK_CUSTOMERS = MOCK_CUSTOMERS.map((c) => {
      if (c.id !== customerId) return c;
      const vendors = c.vendors.map((v) => {
        if (v.id !== contractId) return v;
        updated = { ...v, ...payload };
        return updated;
      });
      return { ...c, vendors };
    });
    if (!updated) throw new Error(`Contract ${contractId} not found`);
    return updated;
  }
  return apiClient
    .patch(`api/planner/customers/${customerId}/contracts/${contractId}`, { json: payload })
    .json();
}

export async function deleteContract(customerId: string, contractId: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    MOCK_CUSTOMERS = MOCK_CUSTOMERS.map((c) =>
      c.id === customerId
        ? { ...c, vendors: c.vendors.filter((v) => v.id !== contractId) }
        : c,
    );
    return;
  }
  await apiClient.delete(`api/planner/customers/${customerId}/contracts/${contractId}`);
}
