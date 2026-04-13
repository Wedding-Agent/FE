'use client';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/invitation/ProgressBar';
import { useInvitation } from '@/contexts/InvitationContext';
import styles from './page.module.css';

interface SlideItem {
  id: string;
  title: string;
  desc: string;
  src: string;
}

export default function InvitationResultPage() {
  const router = useRouter();
  const { data } = useInvitation();

  const images = useMemo<SlideItem[]>(() => {
    const designImages = data?.design?.result2dImageUrls;
    if (Array.isArray(designImages) && designImages.length) {
      return designImages.map((url, idx) => ({
        id: `result-${idx + 1}`,
        title: `청첩장 ${idx + 1}`,
        desc: idx === 0
          ? '업로드한 웨딩 사진 + 배경 디자인'
          : 'AI가 생성한 청첩장 이미지',
        src: url,
      }));
    }
    // 결과 없을 때 placeholder
    return [
      { id: 'result-1', title: '청첩장 1', desc: '생성된 청첩장 이미지', src: '/images/1.png' },
      { id: 'result-2', title: '청첩장 2', desc: '생성된 청첩장 이미지', src: '/images/2.png' },
      { id: 'result-3', title: '청첩장 3', desc: '생성된 청첩장 이미지', src: '/images/3.png' },
    ];
  }, [data?.design?.result2dImageUrls]);

  const [index, setIndex] = useState(0);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);
  const total = images.length;

  const clamp = (n: number) => Math.max(0, Math.min(total - 1, n));
  const goPrev = () => setIndex((i) => clamp(i - 1));
  const goNext = () => setIndex((i) => clamp(i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    draggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const dx = e.changedTouches[0].clientX - startXRef.current;
    if (dx > 50) goPrev();
    if (dx < -50) goNext();
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = img.src;
        a.download = `${img.id}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 250);
    });
  };

  return (
    <div className={styles.page}>
      <ProgressBar title="청첩장 만들기" currentStep={6} totalSteps={6} />

      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <p className={styles.stepLabel}>완성!</p>
            <h1 className={styles.pageTitle}>최종 결과</h1>
            <p className={styles.hint}>
              <span aria-hidden="true">📱</span>
              좌우로 스와이프하여 {total}장의 청첩장을 확인하세요
            </p>
          </header>

          <div className={styles.viewerCard}>
            <div className={styles.viewerTop}>
              <div className={styles.viewerBadge}>청첩장 {index + 1}</div>
              <div className={styles.counter} aria-label={`현재 ${index + 1} / ${total}`}>
                {index + 1} / {total}
              </div>
            </div>

            <div
              className={styles.viewer}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <button
                type="button"
                className={`${styles.arrow} ${styles.left}`}
                onClick={goPrev}
                disabled={index === 0}
                aria-label="이전 이미지"
              >
                ‹
              </button>

              <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
                {images.map((img) => (
                  <article key={img.id} className={styles.slide}>
                    <div className={styles.poster}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={styles.img} src={img.src} alt={img.title} />
                    </div>
                    <div className={styles.meta}>
                      <h2 className={styles.slideTitle}>{img.title}</h2>
                      <p className={styles.slideDesc}>{img.desc}</p>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className={`${styles.arrow} ${styles.right}`}
                onClick={goNext}
                disabled={index === total - 1}
                aria-label="다음 이미지"
              >
                ›
              </button>
            </div>

            <div className={styles.dots} role="tablist" aria-label="청첩장 페이지">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${i === index ? styles.dotOn : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}번 이미지로 이동`}
                  aria-current={i === index ? 'true' : 'false'}
                />
              ))}
            </div>
          </div>

          <div className={styles.ctaRow}>
            <button type="button" className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`} onClick={downloadAll}>
              청첩장 {total}장 모두 다운로드
            </button>
            <button
              type="button"
              className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}
              onClick={() => router.push('/couple/invitation/design')}
            >
              디자인 다시하기
            </button>
          </div>
        </section>

        <button
          type="button"
          className={styles.tryOptionsBtn}
          onClick={() => router.push('/couple/invitation')}
        >
          ✨ 처음으로 돌아가기
        </button>
      </main>
    </div>
  );
}
