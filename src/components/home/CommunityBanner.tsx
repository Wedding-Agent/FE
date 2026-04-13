import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';

interface CommunityBannerProps {
  href: string;
  title: string;
  description: string;
  darkStyle?: boolean;
}

export function CommunityBanner({ href, title, description, darkStyle = false }: CommunityBannerProps) {
  if (darkStyle) {
    return (
      <Link
        href={href}
        className="block rounded-card p-5 bg-[#1A1A2E] text-white relative overflow-hidden active:scale-[0.98] transition-transform"
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/5" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-icon bg-white/10 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">{title}</p>
              <p className="text-xs opacity-70 mt-0.5">{description}</p>
            </div>
          </div>
          <ArrowRight size={18} className="opacity-60" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="block rounded-card p-4 bg-gradient-to-r from-brand/10 to-purple-100 border border-brand/20 active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-brand text-sm">{title}</p>
          <p className="text-text-muted text-xs mt-0.5">{description}</p>
        </div>
        <ArrowRight size={18} className="text-brand" />
      </div>
    </Link>
  );
}
