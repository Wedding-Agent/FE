'use client';

import { ALL_TAGS, TAG_EMOJI, TAG_LABEL, type CommunityTag } from '@/types/community';
import styles from './TagFilter.module.css';

interface TagFilterProps {
  selected: CommunityTag[];
  onChange: (tags: CommunityTag[]) => void;
}

export function TagFilter({ selected, onChange }: TagFilterProps) {
  const toggle = (tag: CommunityTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        {ALL_TAGS.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
              onClick={() => toggle(tag)}
              aria-pressed={active}
            >
              <span aria-hidden="true">{TAG_EMOJI[tag]}</span>
              {TAG_LABEL[tag]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
