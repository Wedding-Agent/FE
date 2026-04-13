'use client';

import { AGENT_EMOJI, AGENT_LABEL, type AgentType } from '@/types/ai';
import styles from './AgentBadge.module.css';

interface AgentBadgeProps {
  from: AgentType;
  to: AgentType;
}

export function AgentBadge({ from, to }: AgentBadgeProps) {
  return (
    <div className={styles.wrap} aria-label={`${AGENT_LABEL[from]}에서 ${AGENT_LABEL[to]}로 전환`}>
      <span className={styles.agent}>
        <span aria-hidden="true">{AGENT_EMOJI[from]}</span>
        {AGENT_LABEL[from]}
      </span>
      <span className={styles.arrow}>→</span>
      <span className={`${styles.agent} ${styles.agentActive}`}>
        <span aria-hidden="true">{AGENT_EMOJI[to]}</span>
        {AGENT_LABEL[to]}
      </span>
    </div>
  );
}
