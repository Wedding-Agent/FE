import Link from 'next/link';
import { Heart, Users, Briefcase, Store } from 'lucide-react';
import { cn } from '@/lib/cn';

const ROLE_OPTIONS = [
  {
    role: 'couple',
    label: '커플',
    description: '예비부부로 웨딩을 준비해요',
    Icon: Heart,
    color: 'from-[#FF6B8A] to-[#9B5DE5]',
    border: 'border-pink-200 hover:border-pink-400',
    bg: 'hover:bg-pink-50',
  },
  {
    role: 'planner',
    label: '플래너',
    description: '웨딩 플래너로 고객을 관리해요',
    Icon: Briefcase,
    color: 'from-[#2E7BFF] to-[#6E4BFF]',
    border: 'border-blue-200 hover:border-blue-400',
    bg: 'hover:bg-blue-50',
  },
  {
    role: 'vendor',
    label: '업체',
    description: '스드메/예식장 등 업체를 운영해요',
    Icon: Store,
    color: 'from-[#FF8A3D] to-[#1FB28C]',
    border: 'border-orange-200 hover:border-orange-400',
    bg: 'hover:bg-orange-50',
  },
] as const;

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Heart size={28} className="text-brand fill-brand" />
          <h1 className="text-2xl font-bold text-text-primary">Promise Marry</h1>
        </div>
        <p className="text-text-muted text-sm">역할을 선택해주세요</p>
      </div>

      <div className="space-y-3">
        {ROLE_OPTIONS.map(({ role, label, description, Icon, color, border, bg }) => (
          <Link
            key={role}
            href={`/signup/${role}`}
            className={cn(
              'flex items-center gap-4 p-4 rounded-card border bg-surface transition-all',
              'active:scale-[0.98]',
              border,
              bg
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-icon flex items-center justify-center bg-gradient-to-br',
                color
              )}
            >
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">{label}</p>
              <p className="text-sm text-text-muted">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-center text-sm text-text-muted">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-brand font-medium hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
