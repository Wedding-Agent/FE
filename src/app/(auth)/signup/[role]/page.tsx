import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Role } from '@/types/auth';
import { RoleSignupForm } from './RoleSignupForm';

const VALID_ROLES: Role[] = ['couple', 'planner', 'vendor'];

const ROLE_LABEL: Record<Role, string> = {
  couple: '커플',
  planner: '플래너',
  vendor: '업체',
};

interface PageProps {
  params: { role: string };
}

export default function RoleSignupPage({ params }: PageProps) {
  if (!VALID_ROLES.includes(params.role as Role)) {
    notFound();
  }

  const role = params.role as Role;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/signup"
          className="p-2 rounded-icon hover:bg-bg transition-colors text-text-muted"
          aria-label="뒤로 가기"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-text-primary">{ROLE_LABEL[role]} 회원가입</h2>
          <p className="text-xs text-text-muted">정보를 입력해주세요</p>
        </div>
      </div>

      <div className="bg-surface rounded-card p-6 shadow-sm border border-border">
        <RoleSignupForm role={role} />
      </div>
    </div>
  );
}
