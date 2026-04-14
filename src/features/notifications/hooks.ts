import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, fetchUnreadCount, markAllRead } from './api';

export const notificationKeys = {
  all:        (role?: string) => ['notifications', role ?? 'couple'] as const,
  list:       (role?: string) => ['notifications', role ?? 'couple', 'list'] as const,
  unread:     (role?: string) => ['notifications', role ?? 'couple', 'unread'] as const,
};

export function useNotifications(role?: string) {
  return useQuery({
    queryKey: notificationKeys.list(role),
    queryFn:  () => fetchNotifications(undefined, role),
    staleTime: 30_000,
  });
}

export function useUnreadCount(role?: string) {
  return useQuery({
    queryKey: notificationKeys.unread(role),
    queryFn:  () => fetchUnreadCount(role),
    staleTime: 20_000,
    refetchInterval: 60_000,
  });
}

export function useMarkAllRead(role?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllRead(role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.list(role) });
      qc.invalidateQueries({ queryKey: notificationKeys.unread(role) });
    },
  });
}
