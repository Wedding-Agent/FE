'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function InvitationLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (loading) return;
    setLoading(true);
    // TODO: BE 연동 시 /api/invitations/init 호출
    await new Promise((r) => setTimeout(r, 400));
    router.push('/couple/invitation/info');
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.orb1} />
        <span className={styles.orb2} />
        <span className={styles.orb3} />
      </div>

      <main className={styles.main}>
        <section className={styles.heroCard}>
          <div className={styles.badge}>✨ AI Wedding Invitation</div>

          <h1 className={styles.title}>
            따뜻한 감성의{' '}
            <span className={styles.highlight}>AI 청첩장</span>을
            <br />
            만들어보세요
          </h1>

          <p className={styles.subTitle}>
            신랑·신부 정보 입력 → 사진 업로드 → 디자인 선택까지
            <br />
            완성된 청첩장 이미지를 바로 다운로드할 수 있어요.
          </p>

          <div className={styles.ctaRow}>
            <button type="button" className={styles.primaryBtn} onClick={handleStart} disabled={loading}>
              {loading ? (
                <span className={styles.btnInner}>
                  <span className={styles.spinner} aria-hidden="true" />
                  준비 중...
                </span>
              ) : (
                '시작하기 →'
              )}
            </button>
            <button type="button" className={styles.ghostBtn} onClick={() => router.back()}>
              돌아가기
            </button>
          </div>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}><span className={styles.metaDot} /> 임시 토큰 발급 후 진행</div>
            <div className={styles.metaItem}><span className={styles.metaDot} /> 결과물 다운로드 지원</div>
            <div className={styles.metaItem}><span className={styles.metaDot} /> 웨딩 감성 + 글래스 UI</div>
          </div>
        </section>

        <section className={styles.steps}>
          {[
            { step: '01', icon: '🧾', title: '기본 정보 입력', desc: '신랑·신부 이름, 부모님, 예식장·날짜 입력' },
            { step: '02', icon: '📸', title: '사진 업로드', desc: '웨딩·일상 사진으로 원하는 무드 전달' },
            { step: '03', icon: '🎨', title: '문구 톤 선택', desc: '격식·따뜻함·로맨틱 등 6가지 스타일' },
            { step: '04', icon: '✨', title: '디자인 & 결과', desc: 'AI가 완성한 청첩장 이미지 다운로드' },
          ].map((s) => (
            <article key={s.step} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.step}</div>
              <div className={styles.stepIcon}>{s.icon}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <div className={styles.stepDesc}>{s.desc}</div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
