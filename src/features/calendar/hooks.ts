import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  fetchWeddingInfo,
  updateEvent,
  updateWeddingDate,
} from './api';
import type { CalendarEvent } from '@/types/calendar';

// ── Query Keys ───────────────────────────────────────────────────────────────
export const calendarKeys = {
  events:      (year: number, month: number) => ['calendar', 'events', year, month] as const,
  weddingInfo: ()                            => ['calendar', 'wedding-info'] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export function useCalendarEvents(year: number, month: number) {
  return useQuery({
    queryKey: calendarKeys.events(year, month),
    queryFn:  () => fetchEvents(year, month),
    staleTime: 1000 * 60 * 2,
  });
}

export function useWeddingInfo() {
  return useQuery({
    queryKey: calendarKeys.weddingInfo(),
    queryFn:  fetchWeddingInfo,
    staleTime: 1000 * 60 * 10,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateEvent(year: number, month: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: calendarKeys.events(year, month) });
      const prev = qc.getQueryData(calendarKeys.events(year, month));
      qc.setQueryData(calendarKeys.events(year, month), (old: any) => ({
        events: [
          ...(old?.events ?? []),
          { ...payload, id: `optimistic-${Date.now()}`, createdAt: new Date().toISOString() },
        ],
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(calendarKeys.events(year, month), ctx.prev);
    },
    onSuccess: () => {
      // 인접 월도 무효화 (이벤트가 다른 달에 속할 수 있음)
      qc.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}

export function useUpdateEvent(year: number, month: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>> }) =>
      updateEvent(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: calendarKeys.events(year, month) });
      const prev = qc.getQueryData(calendarKeys.events(year, month));
      qc.setQueryData(calendarKeys.events(year, month), (old: any) => ({
        events: (old?.events ?? []).map((e: CalendarEvent) =>
          e.id === id ? { ...e, ...payload } : e,
        ),
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(calendarKeys.events(year, month), ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}

export function useDeleteEvent(year: number, month: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: calendarKeys.events(year, month) });
      const prev = qc.getQueryData(calendarKeys.events(year, month));
      qc.setQueryData(calendarKeys.events(year, month), (old: any) => ({
        events: (old?.events ?? []).filter((e: CalendarEvent) => e.id !== id),
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(calendarKeys.events(year, month), ctx.prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}

export function useUpdateWeddingDate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateWeddingDate,
    onSuccess: (data) => {
      qc.setQueryData(calendarKeys.weddingInfo(), data);
      qc.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });
}
