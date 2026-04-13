import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface BigCardProps {
  title: string;
  subtitle?: string;
  Icon: LucideIcon;
  href: string;
  gradient: string;
  className?: string;
}

export function BigCard({ title, subtitle, Icon, href, gradient, className }: BigCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'block rounded-card p-5 bg-gradient-to-br text-white relative overflow-hidden',
        'active:scale-[0.97] transition-transform',
        gradient,
        className
      )}
    >
      {/* 장식용 원 */}
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -right-1 bottom-2 w-14 h-14 rounded-full bg-white/10 pointer-events-none" />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-icon bg-white/20 flex items-center justify-center mb-3">
          <Icon size={22} />
        </div>
        <p className="text-base font-bold leading-tight">{title}</p>
        {subtitle && (
          <p className="text-xs mt-1 opacity-80">{subtitle}</p>
        )}
        <p className="text-xs mt-3 opacity-70">바로가기 →</p>
      </div>
    </Link>
  );
}
