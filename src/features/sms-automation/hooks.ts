import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchSmsSchedules, createSms, deleteSms, sendSmsNow } from './api';
import type { SmsSchedule, CreateSmsInput } from '@/types/sms-automation';

// ── Query Keys ───────────────────────────────────────────────────────────────
export const smsKeys = {
  all:  () => ['sms-schedules'] as const,
  list: () => ['sms-schedules', 'list'] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export function useSmsSchedules() {
  return useQuery({
    queryKey: smsKeys.list(),
    queryFn:  fetchSmsSchedules,
    staleTime: 60_000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateSms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSmsInput) => createSms(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: smsKeys.list() });
      const prev = qc.getQueryData<SmsSchedule[]>(smsKeys.list());
      // 낙관적 추가
      const optimistic: SmsSchedule = {
        id:           `optimistic-${Date.now()}`,
        customerId:   payload.customerId,
        customerName: '',
        phone:        '',
        templateType: payload.templateType,
        message:      payload.message,
        status:       payload.timing === 'immediate' ? 'sent' : 'scheduled',
        scheduledAt:  payload.timing === 'scheduled' ? payload.scheduledAt : undefined,
        sentAt:       payload.timing === 'immediate' ? new Date().toISOString() : undefined,
        createdAt:    new Date().toISOString(),
      };
      qc.setQueryData<SmsSchedule[]>(smsKeys.list(), (old) =>
        old ? [...old, optimistic] : [optimistic],
      );
      return { prev };
    },
    onError: (_err: unknown, _vars: CreateSmsInput, ctx: { prev: SmsSchedule[] | undefined } | undefined) => {
      if (ctx?.prev !== undefined) qc.setQueryData(smsKeys.list(), ctx.prev);
      toast.error('SMS 등록에 실패했습니다.');
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: smsKeys.list() });
      toast.success(
        variables.timing === 'immediate' ? 'SMS가 발송되었습니다.' : 'SMS 예약이 등록되었습니다.',
      );
    },
  });
}

export function useDeleteSms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSms(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: smsKeys.list() });
      const snapshot = qc.getQueriesData<SmsSchedule[]>({ queryKey: smsKeys.all() });
      qc.setQueriesData<SmsSchedule[]>({ queryKey: smsKeys.all() }, (old) =>
        old ? old.filter((s) => s.id !== id) : old,
      );
      return { snapshot };
    },
    onError: (_err: unknown, _id: string, ctx: { snapshot: [unknown, SmsSchedule[] | undefined][] } | undefined) => {
      if (ctx?.snapshot) {
        ctx.snapshot.forEach(([key, val]) => qc.setQueryData(key as Parameters<typeof qc.setQueryData>[0], val));
      }
      toast.error('삭제에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: smsKeys.list() });
      toast.success('삭제되었습니다.');
    },
  });
}

export function useSendSmsNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sendSmsNow(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: smsKeys.list() });
      const prev = qc.getQueryData<SmsSchedule[]>(smsKeys.list());
      const sentAt = new Date().toISOString();
      qc.setQueryData<SmsSchedule[]>(smsKeys.list(), (old) =>
        old?.map((s) => (s.id === id ? { ...s, status: 'sent' as const, sentAt } : s)),
      );
      return { prev };
    },
    onError: (_err: unknown, _id: string, ctx: { prev: SmsSchedule[] | undefined } | undefined) => {
      if (ctx?.prev !== undefined) qc.setQueryData(smsKeys.list(), ctx.prev);
      toast.error('SMS 발송에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: smsKeys.list() });
      toast.success('SMS가 즉시 발송되었습니다.');
    },
  });
}
