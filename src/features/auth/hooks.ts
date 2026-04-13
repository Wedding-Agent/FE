'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/auth';
import { loginApi, signupApi } from './api';
import type { LoginInput, SignupInput } from './schemas';

// Mock credentials for development (TODO: remove when BE is ready)
const MOCK_USERS: Record<string, { nickname: string; role: Role }> = {
  'couple@test.com': { nickname: '테스트커플', role: 'couple' },
  'planner@test.com': { nickname: '김플래너', role: 'planner' },
  'vendor@test.com': { nickname: '스튜디오A', role: 'vendor' },
};

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      // TODO: BE 연동 시 mock 제거
      const mockUser = MOCK_USERS[data.email];
      if (mockUser && data.password.length >= 8) {
        return {
          access_token: 'mock-token-' + Date.now(),
          user_id: data.email,
          nickname: mockUser.nickname,
          role: mockUser.role,
        };
      }
      return loginApi(data);
    },
    onSuccess: (res) => {
      setAuth(res.access_token, {
        id: res.user_id,
        nickname: res.nickname,
        role: res.role,
      });
      toast.success(`${res.nickname}님, 환영합니다!`);
      router.replace(`/${res.role}`);
    },
    onError: () => {
      toast.error('이메일 또는 비밀번호를 확인해주세요');
    },
  });
}

export function useSignup(role: Role) {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupInput) =>
      signupApi({ email: data.email, password: data.password, nickname: data.nickname, role }),
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/login');
    },
    onError: () => {
      toast.error('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}
