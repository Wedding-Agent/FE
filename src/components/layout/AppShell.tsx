import type { Role } from '@/types/auth';
import { BottomTabBar } from './BottomTabBar';
import { RoleHeader } from './RoleHeader';

interface AppShellProps {
  role: Role;
  title?: string;
  children: React.ReactNode;
}

export function AppShell({ role, title, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-md mx-auto relative min-h-screen">
        <RoleHeader role={role} title={title} />
        <main className="pb-24 px-4">{children}</main>
        <BottomTabBar role={role} />
      </div>
    </div>
  );
}
