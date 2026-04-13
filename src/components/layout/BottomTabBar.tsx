'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/config/nav';
import type { Role } from '@/types/auth';
import { cn } from '@/lib/cn';

interface BottomTabBarProps {
  role: Role;
}

const ROLE_AI_GRADIENT: Record<Role, string> = {
  couple: 'from-[#FF6B8A] to-[#9B5DE5]',
  planner: 'from-[#2E7BFF] to-[#6E4BFF]',
  vendor: 'from-[#FF8A3D] to-[#1FB28C]',
};

export function BottomTabBar({ role }: BottomTabBarProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {items.map(({ href, label, Icon, isAI }) => {
          const active = pathname === href || (pathname?.startsWith(`${href}/`) ?? false);

          if (isAI) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={cn(
                  'flex flex-col items-center justify-center -mt-4',
                  'w-14 h-14 rounded-full bg-gradient-to-br shadow-lg',
                  'active:scale-95 transition-transform',
                  ROLE_AI_GRADIENT[role]
                )}
              >
                <Icon size={24} className="text-white" strokeWidth={2} />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-icon transition-colors',
                active ? 'text-brand' : 'text-text-muted hover:text-text-primary'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
