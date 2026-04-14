'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchProfile, updateNickname, deleteAccount } from './api';
import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/auth';

export const profileKeys = {
  me: () => ['profile', 'me'] as const,
};

// ── 프로필 조회 ────────────────────────────────────────────────
export function useProfile(role: Role) {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: () => fetchProfile(role),
    staleTime: 60_000,
  });
}

// ── 닉네임 변경 ────────────────────────────────────────────────
export function useUpdateNickname() {
  const queryClient = useQueryClient();
  const { user, setAuth, token } = useAuthStore();

  return useMutation({
    mutationFn: (nickname: string) => updateNickname(nickname),
    onSuccess: (_, nickname) => {
      // authStore의 닉네임도 즉시 업데이트
      if (user && token) {
        setAuth(token, { ...user, nickname });
      }
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      toast.success('닉네임이 변경됐어요.');
    },
    onError: () => {
      toast.error('닉네임 변경에 실패했어요.');
    },
  });
}

// ── 로그아웃 ───────────────────────────────────────────────────
export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return () => {
    clearAuth();
    router.replace('/login');
  };
}

// ── 회원 탈퇴 ──────────────────────────────────────────────────
export function useDeleteAccount() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearAuth();
      router.replace('/login');
    },
    onError: () => {
      toast.error('회원 탈퇴에 실패했어요. 다시 시도해주세요.');
    },
  });
}
