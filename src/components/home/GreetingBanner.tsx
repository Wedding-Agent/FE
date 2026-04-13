'use client';

import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/auth';

const ROLE_LABEL: Record<Role, string> = {
  couple: '예비부부',
  planner: '플래너',
  vendor: '업체',
};

interface GreetingBannerProps {
  role: Role;
}

export function GreetingBanner({ role }: GreetingBannerProps) {
  const nickname = useAuthStore((s) => s.user?.nickname) ?? '';

  return (
    <div className="pt-2 pb-1">
      <p className="text-text-muted text-sm">안녕하세요 👋</p>
      <h1 className="text-xl font-bold text-text-primary mt-0.5">
        {nickname}님, 반갑습니다!
      </h1>
      <p className="text-xs text-text-muted mt-0.5">
        {ROLE_LABEL[role]} 대시보드에 오신 것을 환영해요
      </p>
    </div>
  );
}
