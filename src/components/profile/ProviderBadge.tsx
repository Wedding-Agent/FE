import type { OAuthProvider } from '@/types/auth';
import { PROVIDER_LABEL, PROVIDER_EMOJI, PROVIDER_COLOR } from '@/types/auth';
import styles from './ProviderBadge.module.css';

interface ProviderBadgeProps {
  provider: OAuthProvider;
}

export function ProviderBadge({ provider }: ProviderBadgeProps) {
  const { bg, text } = PROVIDER_COLOR[provider];
  return (
    <span
      className={styles.badge}
      style={{ background: bg, color: text }}
      aria-label={`${PROVIDER_LABEL[provider]}으로 가입`}
    >
      <span className={styles.emoji} aria-hidden="true">{PROVIDER_EMOJI[provider]}</span>
      {PROVIDER_LABEL[provider]}
    </span>
  );
}
