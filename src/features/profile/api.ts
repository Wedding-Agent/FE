import { apiClient } from '@/lib/api-client';
import type { User, Role } from '@/types/auth';

// ── Mock 데이터 ──────────────────────────────────────────────────
function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

const MOCK_PROFILES: Record<Role, User> = {
  couple: {
    id: 'couple-1',
    nickname: '민지&준호',
    role: 'couple',
    email: 'couple@test.com',
    provider: 'email',
    createdAt: '2025-11-15',
  },
  planner: {
    id: 'planner-1',
    nickname: '박수진 플래너',
    role: 'planner',
    email: 'planner@test.com',
    provider: 'kakao',
    createdAt: '2025-10-01',
  },
  vendor: {
    id: 'vendor-1',
    nickname: '스튜디오 루나',
    role: 'vendor',
    email: 'vendor@test.com',
    provider: 'google',
    createdAt: '2025-09-20',
  },
};

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── API 함수 ────────────────────────────────────────────────────

export async function fetchProfile(role: Role): Promise<User> {
  if (isMockMode()) {
    await delay(300);
    return { ...MOCK_PROFILES[role] };
  }
  return apiClient.get('users/me').json<User>();
}

export async function updateNickname(nickname: string): Promise<void> {
  if (isMockMode()) {
    await delay(200);
    return;
  }
  await apiClient.patch('users/me', { json: { nickname } });
}

export async function deleteAccount(): Promise<void> {
  if (isMockMode()) {
    await delay(300);
    return;
  }
  await apiClient.delete('users/me');
}
