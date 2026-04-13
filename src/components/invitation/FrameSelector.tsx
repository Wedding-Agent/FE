'use client';
import { useMemo, useState } from 'react';
import styles from './FrameSelector.module.css';

interface FrameOption {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  bg: string;
  accent: string;
}

const DEFAULT_OPTIONS: FrameOption[] = [
  { id: 'classic', title: '클래식 프레임', desc: '우아한 골드 테두리', emoji: '🖼️', bg: 'linear-gradient(180deg,rgba(255,244,214,.95),rgba(255,255,255,.65))', accent: 'rgba(245,158,11,.65)' },
  { id: 'floral', title: '플로럴 프레임', desc: '꽃무늬 장식 테두리', emoji: '🌸', bg: 'linear-gradient(180deg,rgba(255,223,236,.95),rgba(255,255,255,.65))', accent: 'rgba(236,72,153,.55)' },
  { id: 'minimal', title: '미니멀 프레임', desc: '심플한 라인 테두리', emoji: '▭', bg: 'linear-gradient(180deg,rgba(245,247,255,.95),rgba(255,255,255,.65))', accent: 'rgba(99,102,241,.45)' },
  { id: 'romantic', title: '로맨틱 프레임', desc: '하트와 리본 장식', emoji: '🎀', bg: 'linear-gradient(180deg,rgba(240,226,255,.95),rgba(255,255,255,.65))', accent: 'rgba(168,85,247,.55)' },
];

interface Props {
  options?: FrameOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
}

export default function FrameSelector({ options = DEFAULT_OPTIONS, value, defaultValue = 'romantic', onChange }: Props) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const selectedId = isControlled ? value : internal;
  const selectedIndex = useMemo(() => Math.max(0, options.findIndex((o) => o.id === selectedId)), [options, selectedId]);

  const select = (id: string) => { if (!isControlled) setInternal(id); onChange?.(id); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
    const next = (selectedIndex + dir + options.length) % options.length;
    select(options[next].id);
  };

  return (
    <div className={styles.grid} role="radiogroup" aria-label="테두리 디자인 선택" tabIndex={0} onKeyDown={handleKeyDown}>
      {options.map((opt) => {
        const active = opt.id === selectedId;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => select(opt.id)}
            className={`${styles.card} ${active ? styles.active : ''}`}
            style={{ background: opt.bg, boxShadow: active ? `0 0 0 2px ${opt.accent}, 0 12px 32px rgba(0,0,0,.1)` : undefined }}
          >
            <div className={styles.emoji}>{opt.emoji}</div>
            <div className={styles.cardTitle}>{opt.title}</div>
            <div className={styles.cardDesc}>{opt.desc}</div>
            {active && <div className={styles.check} style={{ background: opt.accent }} aria-hidden="true">✓</div>}
          </button>
        );
      })}
    </div>
  );
}
