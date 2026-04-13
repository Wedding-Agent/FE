import { AppShell } from '@/components/layout/AppShell';

export default function CoupleLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="couple">{children}</AppShell>;
}
