// ── 계약 상태 ────────────────────────────────────────────────────────────────
export type ContractStatus = 'pending' | 'confirmed' | 'cancelled';

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  pending:   '미정',
  confirmed: '확정',
  cancelled: '취소',
};

export const CONTRACT_STATUS_COLOR: Record<ContractStatus, string> = {
  pending:   '#94a3b8',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
};

export const ALL_CONTRACT_STATUSES: ContractStatus[] = ['pending', 'confirmed', 'cancelled'];

// ── 업체 계약 ─────────────────────────────────────────────────────────────────
export interface VendorContract {
  id: string;
  vendorId: string;       // PlannerVendorContact.id
  vendorName: string;     // denormalized for display
  vendorCategory: string; // e.g. "웨딩홀", "스냅 스튜디오"
  status: ContractStatus;
  contractDate?: string;  // YYYY-MM-DD
  amount?: number;        // 계약금 KRW
  memo?: string;
}

// ── 고객 상세 (PlannerCustomer 확장) ─────────────────────────────────────────
export interface PlannerCustomerDetail {
  id: string;
  name: string;         // "김민수 · 이수진"
  weddingDate: string;  // YYYY-MM-DD
  color: string;        // hex
  phone?: string;
  totalBudget?: number; // 총 예산 KRW
  guestCount?: number;  // 예상 하객 수
  memo?: string;
  vendors: VendorContract[];
}

// ── 고객 필터 ─────────────────────────────────────────────────────────────────
export type CustomerFilter = 'all' | 'active' | 'done';

export const CUSTOMER_FILTER_LABEL: Record<CustomerFilter, string> = {
  all:    '전체',
  active: '진행중',
  done:   '완료',
};

// ── 계약 입력 ─────────────────────────────────────────────────────────────────
export interface CreateContractInput {
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  status: ContractStatus;
  contractDate?: string;
  amount?: number;
  memo?: string;
}

export type UpdateContractInput = Partial<CreateContractInput>;
