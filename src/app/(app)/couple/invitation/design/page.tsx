'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/invitation/ProgressBar';
import ImageUploader from '@/components/invitation/ImageUploader';
import LoadingModal from '@/components/invitation/LoadingModal';
import { useInvitation } from '@/contexts/InvitationContext';
import styles from './page.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

const GUIDE = [
  '원하시는 청첩장 스타일의 참고 이미지를 업로드해주세요',
  'AI가 이 스타일을 참고하여 디자인을 생성합니다',
  '최대 3장까지 업로드 가능합니다',
  '이미지가 없으면 AI가 자동으로 최적 스타일을 선택합니다',
];

export default function InvitationDesignPage() {
  const router = useRouter();
  const { data, setStyleImages, setDesignResultImages } = useInvitation();
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    controllerRef.current = new AbortController();

    const payload = {
      groom: data.groom,
      bride: data.bride,
      wedding: data.wedding,
      extraMessage: data.extraMessage,
      additionalRequest: data.additionalRequest,
      tone: data.tone,
    };

    try {
      const mainImage = data.assets?.userImages?.[0] ?? null;
      const styleImages = data.assets?.styleImages ?? [];
      const formData = new FormData();

      if (mainImage) formData.append('weddingImage', mainImage);
      styleImages.forEach((f) => formData.append('styleImages', f));
      formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

      const response = await fetch(`${API_BASE}/api/invitations/design`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        signal: controllerRef.current.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? `HTTP ${response.status}`);
      }

      const json = await response.json() as { result2dImageUrls?: string[] };
      const urls = json?.result2dImageUrls;

      if (!Array.isArray(urls) || urls.length === 0) {
        throw new Error('생성된 청첩장 이미지가 없습니다.');
      }

      setDesignResultImages(urls);
      router.push('/couple/invitation/result');
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      alert((error as Error).message ?? '전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <LoadingModal open={loading} message="AI가 청첩장을 디자인하고 있어요..." />
      <ProgressBar title="청첩장 만들기" currentStep={4} totalSteps={6} />

      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <p className={styles.stepLabel}>STEP 4</p>
            <h1 className={styles.pageTitle}>디자인 요청 사항</h1>
            <p className={styles.subTitle}>원하는 스타일의 청첩장 이미지를 첨부해주세요</p>
          </header>

          <div className={styles.uploaderWrap}>
            <ImageUploader
              maxCount={3}
              value={data.assets.styleImages}
              onChange={setStyleImages}
            />
          </div>

          <div className={styles.guide}>
            <div className={styles.guideTitle}>🎨 스타일 이미지 가이드</div>
            <ul className={styles.guideList}>
              {GUIDE.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.backBtn} onClick={() => router.push('/couple/invitation/tone')}>
              ← 이전
            </button>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '생성 중...' : '청첩장 만들기'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
