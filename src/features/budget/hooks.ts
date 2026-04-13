'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { BudgetCategory, BudgetItem, BudgetPlan, BudgetSummary } from '@/types/budget';
import {
  addBudgetItem,
  deleteBudgetItem,
  fetchBudgetSummary,
  importFromDocuments,
  updateBudgetItem,
  updateBudgetPlan,
} from './api';

export const budgetKeys = {
  all:     () => ['budget'] as const,
  summary: () => ['budget', 'summary'] as const,
};

// ────────────────────────────────────────────────────────────────
// Queries
// ────────────────────────────────────────────────────────────────

export function useBudgetSummary() {
  return useQuery({
    queryKey: budgetKeys.summary(),
    queryFn:  fetchBudgetSummary,
    staleTime: 30_000,
  });
}

// ────────────────────────────────────────────────────────────────
// Mutations
// ────────────────────────────────────────────────────────────────

export function useUpdateBudgetPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (plan: BudgetPlan) => updateBudgetPlan(plan),
    onMutate: async (plan) => {
      await qc.cancelQueries({ queryKey: budgetKeys.summary() });
      const snapshot = qc.getQueryData<BudgetSummary>(budgetKeys.summary());
      qc.setQueryData<BudgetSummary>(budgetKeys.summary(), (old) =>
        old ? { ...old, plan } : old,
      );
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(budgetKeys.summary(), ctx.snapshot);
      toast.error('예산 설정에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: budgetKeys.summary() });
      toast.success('예산이 저장되었습니다.');
    },
  });
}

export function useAddBudgetItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<BudgetItem, 'id' | 'createdAt'>) => addBudgetItem(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: budgetKeys.summary() });
      const snapshot = qc.getQueryData<BudgetSummary>(budgetKeys.summary());
      const tempItem: BudgetItem = {
        ...payload,
        id: `optimistic-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData<BudgetSummary>(budgetKeys.summary(), (old) => {
        if (!old) return old;
        return {
          ...old,
          items: [tempItem, ...old.items],
          totalSpent: old.totalSpent + payload.amount,
          spentByCategory: old.spentByCategory.map((s) =>
            s.category === payload.category
              ? { ...s, spent: s.spent + payload.amount }
              : s,
          ),
        };
      });
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(budgetKeys.summary(), ctx.snapshot);
      toast.error('지출 추가에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: budgetKeys.summary() });
      toast.success('지출이 추가되었습니다.');
    },
  });
}

export function useDeleteBudgetItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudgetItem(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: budgetKeys.summary() });
      const snapshot = qc.getQueryData<BudgetSummary>(budgetKeys.summary());
      qc.setQueryData<BudgetSummary>(budgetKeys.summary(), (old) => {
        if (!old) return old;
        const removing = old.items.find((i) => i.id === id);
        if (!removing) return old;
        return {
          ...old,
          items: old.items.filter((i) => i.id !== id),
          totalSpent: old.totalSpent - removing.amount,
          spentByCategory: old.spentByCategory.map((s) =>
            s.category === removing.category
              ? { ...s, spent: Math.max(0, s.spent - removing.amount) }
              : s,
          ),
        };
      });
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(budgetKeys.summary(), ctx.snapshot);
      toast.error('삭제에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: budgetKeys.summary() });
      toast.success('지출이 삭제되었습니다.');
    },
  });
}

export function useImportFromDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      imports: { documentId: string; category: BudgetCategory; label: string; amount: number }[],
    ) => importFromDocuments(imports),
    onSuccess: (newItems) => {
      qc.invalidateQueries({ queryKey: budgetKeys.summary() });
      toast.success(`${newItems.length}건의 지출이 가져와졌습니다.`);
    },
    onError: () => {
      toast.error('문서 가져오기에 실패했습니다.');
    },
  });
}
