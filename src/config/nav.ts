import {
  CalendarDays,
  Users,
  Sparkles,
  MessageSquare,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '@/types/auth';

export interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  isAI?: boolean;
}

// design spec §4.1: 캘린더 / 커뮤니티 / AI(FAB) / 채팅 / 프로필
export const NAV_ITEMS: Record<Role, NavItem[]> = {
  couple: [
    { href: '/couple/calendar', label: '캘린더', Icon: CalendarDays },
    { href: '/couple/community', label: '커뮤니티', Icon: Users },
    { href: '/couple/ai', label: 'AI', Icon: Sparkles, isAI: true },
    { href: '/couple/chat', label: '채팅', Icon: MessageSquare },
    { href: '/couple/profile', label: '프로필', Icon: User },
  ],
  planner: [
    { href: '/planner/calendar', label: '캘린더', Icon: CalendarDays },
    { href: '/planner/board', label: '커뮤니티', Icon: Users },
    { href: '/planner/ai', label: 'AI', Icon: Sparkles, isAI: true },
    { href: '/planner/chats', label: '채팅', Icon: MessageSquare },
    { href: '/planner/profile', label: '프로필', Icon: User },
  ],
  vendor: [
    { href: '/vendor/reservations', label: '캘린더', Icon: CalendarDays },
    { href: '/vendor/board', label: '커뮤니티', Icon: Users },
    { href: '/vendor/ai', label: 'AI', Icon: Sparkles, isAI: true },
    { href: '/vendor/chats', label: '채팅', Icon: MessageSquare },
    { href: '/vendor/profile', label: '프로필', Icon: User },
  ],
};
