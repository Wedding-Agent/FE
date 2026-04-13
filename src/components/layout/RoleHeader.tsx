'use client';

import { Bell, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUnreadCount } from '@/features/notifications/hooks';
import type { Role } from '@/types/auth';
import { cn } from '@/lib/cn';

interface RoleHeaderProps {
  role: Role;
  title?: string;
}

const ROLE_LABEL: Record<Role, string> = {
  couple: 'Promise Marry',
  planner: '플래너 대시보드',
  vendor: '업체 대시보드',
};

const ROLE_TITLE_COLOR: Record<Role, string> = {
  couple: 'text-[#FF4D6D]',
  planner: 'text-[#2E7BFF]',
  vendor: 'text-[#FF8A3D]',
};

export function RoleHeader({ role, title }: RoleHeaderProps) {
  const router = useRouter();
  const nickname = useAuthStore((s) => s.user?.nickname);
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.unreadCount ?? 0;
  const displayTitle = title ?? ROLE_LABEL[role];

  const notifPath = `/${role}/notifications`;

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
        <div className="flex items-center gap-1.5">
          <Heart size={18} className="text-brand fill-brand" />
          <span className={cn('text-base font-bold', ROLE_TITLE_COLOR[role])}>
            {displayTitle}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {nickname && (
            <span className="text-sm text-text-muted">{nickname}님</span>
          )}
          <button
            className="relative p-1.5 rounded-icon hover:bg-bg transition-colors"
            aria-label={`알림${unreadCount > 0 ? ` (${unreadCount}개 미읽음)` : ''}`}
            onClick={() => router.push(notifPath)}
          >
            <Bell size={20} className="text-text-muted" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#fb7185]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
