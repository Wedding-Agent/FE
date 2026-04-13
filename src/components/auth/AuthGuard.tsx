'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

function getRoleFromPath(pathname: string): Role | null {
  if (pathname.startsWith('/couple')) return 'couple';
  if (pathname.startsWith('/planner')) return 'planner';
  if (pathname.startsWith('/vendor')) return 'vendor';
  return null;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token || !user) {
      router.replace('/login');
      return;
    }

    // role guard: 현재 경로의 role과 user.role이 다르면 본인 role 홈으로 redirect
    const pathRole = pathname ? getRoleFromPath(pathname) : null;
    if (pathRole && pathRole !== user.role) {
      router.replace(`/${user.role}`);
    }
  }, [token, user, pathname, router]);

  if (!token || !user) return null;

  return <>{children}</>;
}
