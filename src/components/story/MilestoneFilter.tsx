'use client';

import type { StoryMilestone } from '@/types/story';
import { ALL_MILESTONES, MILESTONE_EMOJI, MILESTONE_LABEL } from '@/types/story';
import { cn } from '@/lib/cn';
import styles from './MilestoneFilter.module.css';

interface MilestoneFilterProps {
  selected: StoryMilestone | null;
  onChange: (m: StoryMilestone | null) => void;
}

export function MilestoneFilter({ selected, onChange }: MilestoneFilterProps) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="마일스톤 필터">
      <button
        type="button"
        role="tab"
        aria-selected={selected === null}
        className={cn(styles.chip, selected === null && styles.active)}
        onClick={() => onChange(null)}
      >
        전체
      </button>
      {ALL_MILESTONES.map((m) => (
        <button
          key={m}
          type="button"
          role="tab"
          aria-selected={selected === m}
          className={cn(styles.chip, selected === m && styles.active)}
          onClick={() => onChange(m)}
        >
          <span aria-hidden="true">{MILESTONE_EMOJI[m]}</span>
          {MILESTONE_LABEL[m]}
        </button>
      ))}
    </div>
  );
}
