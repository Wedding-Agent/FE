import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, fetchUnreadCount, markAllRead } from './api';

export const notificationKeys = {
  all:        () => ['notifications'] as const,
  list:       () => ['notifications', 'list'] as const,
  unread:     () => ['notifications', 'unread'] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn:  () => fetchNotifications(),
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn:  fetchUnreadCount,
    staleTime: 20_000,
    refetchInterval: 60_000,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.list() });
      qc.invalidateQueries({ queryKey: notificationKeys.unread() });
    },
  });
}
