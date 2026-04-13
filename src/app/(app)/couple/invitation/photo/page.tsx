'use client';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/invitation/ProgressBar';
import SingleImageUploader from '@/components/invitation/SingleImageUploader';
import { useInvitation } from '@/contexts/InvitationContext';
import styles from './page.module.css';

const GUIDE = [
  '웨딩 촬영 사진, 일상 사진, 연애 사진 등 다양한 사진을 올려주세요',
  '고화질 이미지를 권장합니다 (최소 1000×1000 픽셀)',
  'AI가 자동으로 최적의 레이아웃을 생성합니다',
  '가로/세로 비율이 다양해도 괜찮습니다',
];

export default function InvitationPhotoPage() {
  const router = useRouter();
  const { data, setUserImages } = useInvitation();

  return (
    <div className={styles.page}>
      <ProgressBar title="청첩장 만들기" currentStep={2} totalSteps={6} />
      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <p className={styles.stepLabel}>STEP 2</p>
            <h1 className={styles.pageTitle}>메인 사진 업로드</h1>
            <p className={styles.subTitle}>청첩장에 사용할 대표 사진을 선택해주세요</p>
          </header>

          <div className={styles.uploaderWrap}>
            <SingleImageUploader
              value={data.assets.userImages?.[0] ?? null}
              onChange={(file) => setUserImages(file ? [file] : [])}
            />
          </div>

          <div className={styles.guide}>
            <div className={styles.guideTitle}>📸 사진 업로드 가이드</div>
            <ul className={styles.guideList}>
              {GUIDE.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.backBtn} onClick={() => router.push('/couple/invitation/info')}>← 이전</button>
            <button
              type="button"
              className={styles.nextBtn}
              onClick={() => router.push('/couple/invitation/tone')}
              disabled={!data.assets.userImages?.[0]}
            >
              다음 →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
