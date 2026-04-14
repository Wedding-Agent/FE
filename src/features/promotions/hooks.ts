import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from './api';
import type { Promotion, CreatePromotionInput, UpdatePromotionInput } from '@/types/promotions';

// ── Query Keys ───────────────────────────────────────────────────────────────
export const promotionKeys = {
  all:  () => ['promotions'] as const,
  list: () => ['promotions', 'list'] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export function usePromotions() {
  return useQuery({
    queryKey: promotionKeys.list(),
    queryFn:  fetchPromotions,
    staleTime: 60_000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromotionInput) => createPromotion(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: promotionKeys.list() });
      const prev = qc.getQueryData<Promotion[]>(promotionKeys.list());
      const now = new Date().toISOString();
      const optimistic: Promotion = {
        id: `optimistic-${Date.now()}`,
        ...payload,
        createdAt: now,
        updatedAt: now,
      };
      qc.setQueryData<Promotion[]>(promotionKeys.list(), (old) =>
        old ? [optimistic, ...old] : [optimistic],
      );
      return { prev };
    },
    onError: (_err: unknown, _vars: CreatePromotionInput, ctx: { prev: Promotion[] | undefined } | undefined) => {
      if (ctx?.prev !== undefined) qc.setQueryData(promotionKeys.list(), ctx.prev);
      toast.error('홍보 멘트 저장에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: promotionKeys.list() });
      toast.success('홍보 멘트가 저장되었습니다.');
    },
  });
}

export function useUpdatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePromotionInput }) =>
      updatePromotion(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: promotionKeys.list() });
      const prev = qc.getQueryData<Promotion[]>(promotionKeys.list());
      qc.setQueryData<Promotion[]>(promotionKeys.list(), (old) =>
        old?.map((p) =>
          p.id === id ? { ...p, ...payload, updatedAt: new Date().toISOString() } : p,
        ),
      );
      return { prev };
    },
    onError: (
      _err: unknown,
      _vars: { id: string; payload: UpdatePromotionInput },
      ctx: { prev: Promotion[] | undefined } | undefined,
    ) => {
      if (ctx?.prev !== undefined) qc.setQueryData(promotionKeys.list(), ctx.prev);
      toast.error('수정에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: promotionKeys.list() });
      toast.success('홍보 멘트가 수정되었습니다.');
    },
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: promotionKeys.list() });
      const snapshot = qc.getQueriesData<Promotion[]>({ queryKey: promotionKeys.all() });
      qc.setQueriesData<Promotion[]>({ queryKey: promotionKeys.all() }, (old) =>
        old ? old.filter((p) => p.id !== id) : old,
      );
      return { snapshot };
    },
    onError: (
      _err: unknown,
      _id: string,
      ctx: { snapshot: [unknown, Promotion[] | undefined][] } | undefined,
    ) => {
      if (ctx?.snapshot) {
        ctx.snapshot.forEach(([key, val]) =>
          qc.setQueryData(key as Parameters<typeof qc.setQueryData>[0], val),
        );
      }
      toast.error('삭제에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: promotionKeys.list() });
      toast.success('삭제되었습니다.');
    },
  });
}
