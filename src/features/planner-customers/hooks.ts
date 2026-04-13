import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCustomerList,
  fetchCustomerDetail,
  createContract,
  updateContract,
  deleteContract,
} from './api';
import type {
  PlannerCustomerDetail,
  VendorContract,
  CreateContractInput,
  UpdateContractInput,
} from '@/types/planner-customers';

// ── Query Keys ───────────────────────────────────────────────────────────────
export const plannerCustomerKeys = {
  all:    () => ['planner-customers'] as const,
  list:   () => ['planner-customers', 'list'] as const,
  detail: (id: string) => ['planner-customers', 'detail', id] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export function useCustomerList() {
  return useQuery({
    queryKey: plannerCustomerKeys.list(),
    queryFn:  fetchCustomerList,
    staleTime: 300_000,
  });
}

export function useCustomerDetail(customerId: string) {
  return useQuery({
    queryKey: plannerCustomerKeys.detail(customerId),
    queryFn:  () => fetchCustomerDetail(customerId),
    staleTime: 180_000,
    enabled:  !!customerId,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateContract(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateContractInput) => createContract(customerId, payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: plannerCustomerKeys.detail(customerId) });
      const prev = qc.getQueryData(plannerCustomerKeys.detail(customerId));
      const optimistic: VendorContract = {
        ...payload,
        id: `optimistic-${Date.now()}`,
      };
      qc.setQueryData(plannerCustomerKeys.detail(customerId), (old: PlannerCustomerDetail | undefined) =>
        old ? { ...old, vendors: [...old.vendors, optimistic] } : old,
      );
      // 목록도 낙관적 업데이트
      qc.setQueryData(plannerCustomerKeys.list(), (old: PlannerCustomerDetail[] | undefined) =>
        old?.map((c) =>
          c.id === customerId ? { ...c, vendors: [...c.vendors, optimistic] } : c,
        ),
      );
      return { prev };
    },
    onError: (_err: unknown, _vars: CreateContractInput, ctx: { prev: unknown } | undefined) => {
      if (ctx?.prev) qc.setQueryData(plannerCustomerKeys.detail(customerId), ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: plannerCustomerKeys.detail(customerId) });
      qc.invalidateQueries({ queryKey: plannerCustomerKeys.list() });
    },
  });
}

export function useUpdateContract(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, payload }: { contractId: string; payload: UpdateContractInput }) =>
      updateContract(customerId, contractId, payload),
    onMutate: async ({ contractId, payload }) => {
      await qc.cancelQueries({ queryKey: plannerCustomerKeys.detail(customerId) });
      const prev = qc.getQueryData(plannerCustomerKeys.detail(customerId));
      const patchVendors = (vendors: VendorContract[]) =>
        vendors.map((v) => (v.id === contractId ? { ...v, ...payload } : v));
      qc.setQueryData(plannerCustomerKeys.detail(customerId), (old: PlannerCustomerDetail | undefined) =>
        old ? { ...old, vendors: patchVendors(old.vendors) } : old,
      );
      qc.setQueryData(plannerCustomerKeys.list(), (old: PlannerCustomerDetail[] | undefined) =>
        old?.map((c) =>
          c.id === customerId ? { ...c, vendors: patchVendors(c.vendors) } : c,
        ),
      );
      return { prev };
    },
    onError: (
      _err: unknown,
      _vars: { contractId: string; payload: UpdateContractInput },
      ctx: { prev: unknown } | undefined,
    ) => {
      if (ctx?.prev) qc.setQueryData(plannerCustomerKeys.detail(customerId), ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: plannerCustomerKeys.detail(customerId) });
      qc.invalidateQueries({ queryKey: plannerCustomerKeys.list() });
    },
  });
}

export function useDeleteContract(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) => deleteContract(customerId, contractId),
    onMutate: async (contractId) => {
      await qc.cancelQueries({ queryKey: plannerCustomerKeys.detail(customerId) });
      const prev = qc.getQueryData(plannerCustomerKeys.detail(customerId));
      const filterVendors = (vendors: VendorContract[]) =>
        vendors.filter((v) => v.id !== contractId);
      qc.setQueryData(plannerCustomerKeys.detail(customerId), (old: PlannerCustomerDetail | undefined) =>
        old ? { ...old, vendors: filterVendors(old.vendors) } : old,
      );
      qc.setQueryData(plannerCustomerKeys.list(), (old: PlannerCustomerDetail[] | undefined) =>
        old?.map((c) =>
          c.id === customerId ? { ...c, vendors: filterVendors(c.vendors) } : c,
        ),
      );
      return { prev };
    },
    onError: (_err: unknown, _vars: string, ctx: { prev: unknown } | undefined) => {
      if (ctx?.prev) qc.setQueryData(plannerCustomerKeys.detail(customerId), ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: plannerCustomerKeys.detail(customerId) });
      qc.invalidateQueries({ queryKey: plannerCustomerKeys.list() });
    },
  });
}
