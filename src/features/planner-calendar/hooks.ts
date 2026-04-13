import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchPlannerCustomers,
  fetchPlannerVendorContacts,
  fetchPlannerEvents,
  createPlannerEvent,
  updatePlannerEvent,
  deletePlannerEvent,
} from './api';
import type { PlannerCalendarEvent, CreatePlannerEventInput } from '@/types/planner-calendar';

// ── Query Keys ───────────────────────────────────────────────────────────────
export const plannerCalendarKeys = {
  customers: () => ['planner-calendar', 'customers'] as const,
  vendors:   () => ['planner-calendar', 'vendors'] as const,
  events:    (year: number, month: number) => ['planner-calendar', 'events', year, month] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export function usePlannerCustomers() {
  return useQuery({
    queryKey: plannerCalendarKeys.customers(),
    queryFn:  fetchPlannerCustomers,
    staleTime: 300_000,
  });
}

export function usePlannerVendorContacts() {
  return useQuery({
    queryKey: plannerCalendarKeys.vendors(),
    queryFn:  fetchPlannerVendorContacts,
    staleTime: 300_000,
  });
}

export function usePlannerCalendarEvents(year: number, month: number) {
  return useQuery({
    queryKey: plannerCalendarKeys.events(year, month),
    queryFn:  () => fetchPlannerEvents(year, month),
    staleTime: 120_000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreatePlannerEvent(year: number, month: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPlannerEvent,
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: plannerCalendarKeys.events(year, month) });
      const prev = qc.getQueryData(plannerCalendarKeys.events(year, month));
      qc.setQueryData(plannerCalendarKeys.events(year, month), (old: any) => ({
        events: [
          ...(old?.events ?? []),
          {
            ...payload,
            id: `optimistic-${Date.now()}`,
            createdAt: new Date().toISOString(),
          } as PlannerCalendarEvent,
        ],
      }));
      return { prev };
    },
    onError: (_err: unknown, _vars: CreatePlannerEventInput, ctx: any) => {
      if (ctx?.prev) qc.setQueryData(plannerCalendarKeys.events(year, month), ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planner-calendar', 'events'] });
    },
  });
}

export function useUpdatePlannerEvent(year: number, month: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreatePlannerEventInput> }) =>
      updatePlannerEvent(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: plannerCalendarKeys.events(year, month) });
      const prev = qc.getQueryData(plannerCalendarKeys.events(year, month));
      qc.setQueryData(plannerCalendarKeys.events(year, month), (old: any) => ({
        events: (old?.events ?? []).map((e: PlannerCalendarEvent) =>
          e.id === id ? { ...e, ...payload } : e,
        ),
      }));
      return { prev };
    },
    onError: (_err: unknown, _vars: { id: string; payload: Partial<CreatePlannerEventInput> }, ctx: any) => {
      if (ctx?.prev) qc.setQueryData(plannerCalendarKeys.events(year, month), ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planner-calendar', 'events'] });
    },
  });
}

export function useDeletePlannerEvent(year: number, month: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePlannerEvent,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: plannerCalendarKeys.events(year, month) });
      const prev = qc.getQueryData(plannerCalendarKeys.events(year, month));
      qc.setQueryData(plannerCalendarKeys.events(year, month), (old: any) => ({
        events: (old?.events ?? []).filter((e: PlannerCalendarEvent) => e.id !== id),
      }));
      return { prev };
    },
    onError: (_err: unknown, _vars: string, ctx: any) => {
      if (ctx?.prev) qc.setQueryData(plannerCalendarKeys.events(year, month), ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planner-calendar', 'events'] });
    },
  });
}
