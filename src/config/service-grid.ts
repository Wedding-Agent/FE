import {
  Mail,
  Calculator,
  Store,
  Users,
  BookOpen,
  Camera,
  Mic,
  FileText,
  ClipboardList,
  MessageSquare,
  Building2,
  Megaphone,
  MessageCircle,
  TrendingUp,
  BarChart2,
  Newspaper,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '@/types/auth';

export interface ServiceGridItem {
  label: string;
  Icon: LucideIcon;
  href: string;
  bgColor: string;
  iconColor: string;
}

// design spec §4.2~4.4 기준
export const SERVICE_GRID_ITEMS: Record<Role, ServiceGridItem[]> = {
  couple: [
    {
      label: '디지털\n청첩장',
      Icon: Mail,
      href: '/couple/invitation',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
    {
      label: '예산\n관리',
      Icon: Calculator,
      href: '/couple/budget',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-500',
    },
    {
      label: '업체\n찾기',
      Icon: Store,
      href: '/couple/vendors',
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-500',
    },
    {
      label: '커플\n스페이스',
      Icon: Users,
      href: '/couple/couple-space',
      bgColor: 'bg-fuchsia-100',
      iconColor: 'text-fuchsia-500',
    },
    {
      label: '웨딩\n스토리',
      Icon: BookOpen,
      href: '/couple/story',
      bgColor: 'bg-violet-100',
      iconColor: 'text-violet-500',
    },
    {
      label: '포토\n스튜디오',
      Icon: Camera,
      href: '/couple/studio',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-500',
    },
    {
      label: 'AI 음성\n상담',
      Icon: Mic,
      href: '/couple/ai-voice',
      bgColor: 'bg-sky-100',
      iconColor: 'text-sky-500',
    },
    {
      label: '문서\n보관함',
      Icon: FileText,
      href: '/couple/documents',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-500',
    },
  ],
  planner: [
    {
      label: '고객 예약\n관리',
      Icon: ClipboardList,
      href: '/planner/customers',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      label: '고객과\n채팅',
      Icon: MessageSquare,
      href: '/planner/chats',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-500',
    },
    {
      label: '업체와\n채팅',
      Icon: Building2,
      href: '/planner/vendors',
      bgColor: 'bg-violet-100',
      iconColor: 'text-violet-500',
    },
    {
      label: '계약서\n관리',
      Icon: FileText,
      href: '/planner/contracts',
      bgColor: 'bg-sky-100',
      iconColor: 'text-sky-500',
    },
    {
      label: '플래너\n게시판',
      Icon: Newspaper,
      href: '/planner/board',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-500',
    },
    {
      label: '업체 매칭\n·추천',
      Icon: Store,
      href: '/planner/vendors',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-500',
    },
    {
      label: '홍보 멘트\n작성',
      Icon: Megaphone,
      href: '/planner/promotions',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'SMS\n자동화',
      Icon: MessageCircle,
      href: '/planner/sms',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500',
    },
  ],
  vendor: [
    {
      label: '고객 예약\n관리',
      Icon: ClipboardList,
      href: '/vendor/reservations',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500',
    },
    {
      label: '고객과\n채팅',
      Icon: MessageSquare,
      href: '/vendor/chats',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-500',
    },
    {
      label: '계약서\n관리',
      Icon: FileText,
      href: '/vendor/contracts',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      label: '동종 업계\n게시판',
      Icon: Newspaper,
      href: '/vendor/board',
      bgColor: 'bg-lime-100',
      iconColor: 'text-lime-600',
    },
    {
      label: '홍보 멘트\n작성',
      Icon: Megaphone,
      href: '/vendor/promotions',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500',
    },
    {
      label: '규정·뉴스\n정리',
      Icon: Newspaper,
      href: '/vendor/news',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-500',
    },
    {
      label: '경쟁 업체\n분석',
      Icon: TrendingUp,
      href: '/vendor/analytics',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-500',
    },
    {
      label: '매출\n관리',
      Icon: BarChart2,
      href: '/vendor/revenue',
      bgColor: 'bg-sky-100',
      iconColor: 'text-sky-500',
    },
  ],
};
