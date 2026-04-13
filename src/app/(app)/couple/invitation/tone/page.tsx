'use client';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/invitation/ProgressBar';
import { useInvitation } from '@/contexts/InvitationContext';
import type { ToneType } from '@/contexts/InvitationContext';
import styles from './page.module.css';

const TONE_OPTIONS: { id: ToneType; title: string; desc: string; example: string }[] = [
  { id: 'FORMAL',   title: '격식있는',   desc: '전통적이고 예의바른 표현',       example: '삼가 청하옵건대…' },
  { id: 'WARM',     title: '따뜻한',     desc: '정감있고 포근한 느낌',           example: '따뜻한 마음으로 초대합니다' },
  { id: 'MODERN',   title: '현대적인',   desc: '세련되고 트렌디한 표현',         example: '저희의 새로운 시작에 함께해 주세요' },
  { id: 'CLASSIC',  title: '클래식',     desc: '고전적이고 우아한 분위기',       example: '영원한 사랑을 약속하는 자리에' },
  { id: 'CASUAL',   title: '캐주얼',     desc: '편안하고 친근한 느낌',           example: '우리 결혼해요! 축하해주러 와요' },
  { id: 'ROMANTIC', title: '로맨틱',     desc: '감성적이고 낭만적인 표현',       example: '사랑이 꽃피는 그날, 함께해주세요' },
];

export default function InvitationTonePage() {
  const router = useRouter();
  const { data, updateField } = useInvitation();
  const [selected, setSelected] = useState<ToneType>(data.tone ?? 'WARM');
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleNext = () => {
    updateField('tone', selected);
    router.push('/couple/invitation/design');
  };

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    const idx = TONE_OPTIONS.findIndex((t) => t.id === selected);
    const cols = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    let next = idx >= 0 ? idx : 0;
    if (e.key === 'ArrowRight') next = Math.min(TONE_OPTIONS.length - 1, next + 1);
    if (e.key === 'ArrowLeft') next = Math.max(0, next - 1);
    if (e.key === 'ArrowDown') next = Math.min(TONE_OPTIONS.length - 1, next + cols);
    if (e.key === 'ArrowUp') next = Math.max(0, next - cols);
    if (['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)) {
      e.preventDefault();
      const nextId = TONE_OPTIONS[next]?.id;
      if (nextId) { setSelected(nextId); btnRefs.current[next]?.focus(); }
    }
  };

  return (
    <div className={styles.page}>
      <ProgressBar title="청첩장 만들기" currentStep={3} totalSteps={6} />
      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <p className={styles.stepLabel}>STEP 3</p>
            <h1 className={styles.pageTitle}>문구 톤 선택</h1>
            <p className={styles.subTitle}>청첩장에 사용할 문구의 톤을 선택해주세요</p>
          </header>

          <div className={styles.grid} role="radiogroup" aria-label="문구 톤 선택" tabIndex={0} onKeyDown={onGridKeyDown}>
            {TONE_OPTIONS.map((opt, i) => {
              const active = opt.id === selected;
              return (
                <button
                  key={opt.id}
                  ref={(el) => { btnRefs.current[i] = el; }}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelected(opt.id)}
                  className={`${styles.toneCard} ${active ? styles.selected : ''}`}
                >
                  <div className={styles.cardTop}>
                    <div>
                      <h3 className={styles.toneTitle}>{opt.title}</h3>
                      <p className={styles.toneDesc}>{opt.desc}</p>
                    </div>
                    <span className={`${styles.check} ${active ? styles.checkOn : ''}`} aria-hidden="true">✓</span>
                  </div>
                  <div className={styles.exampleBox}>
                    <span className={styles.exampleText}>{opt.example}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.backBtn} onClick={() => router.push('/couple/invitation/photo')}>← 이전</button>
            <button type="button" className={styles.nextBtn} onClick={handleNext}>다음 →</button>
          </div>
        </section>
      </main>
    </div>
  );
}
