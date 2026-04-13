'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createChatRoom, fetchChatMessages, fetchChatRooms, fetchContacts, patchLastRead, sendMessage } from './api';

export const chatKeys = {
  rooms:    ()         => ['chat', 'rooms'] as const,
  messages: (id: string) => ['chat', 'messages', id] as const,
};

export function useChatRooms() {
  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: fetchChatRooms,
    staleTime: 10_000,
    refetchInterval: 10_000,   // 10초 폴링 (WebSocket 연동 전 임시)
  });
}

export function useChatMessages(roomId: string) {
  return useQuery({
    queryKey: chatKeys.messages(roomId),
    queryFn: () => fetchChatMessages(roomId),
    staleTime: 0,
    enabled: !!roomId,
  });
}

export function useSendMessage(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => sendMessage(roomId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
    onError: () => {
      toast.error('메시지 전송에 실패했습니다.');
    },
  });
}

export function useContacts(query: string) {
  return useQuery({
    queryKey: ['chat', 'contacts', query],
    queryFn: () => fetchContacts(query || undefined),
    staleTime: 30_000,
  });
}

export function useCreateChatRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (targetUserId: string) => createChatRoom(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
    onError: () => {
      toast.error('대화를 시작할 수 없어요. 잠시 후 다시 시도해주세요.');
    },
  });
}

export function usePatchLastRead(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => patchLastRead(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}
