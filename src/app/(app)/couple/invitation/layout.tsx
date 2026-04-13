import { InvitationProvider } from '@/contexts/InvitationContext';

export default function InvitationLayout({ children }: { children: React.ReactNode }) {
  return <InvitationProvider>{children}</InvitationProvider>;
}
