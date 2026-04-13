'use client';
import ProgressBar from '@/components/invitation/ProgressBar';
import { BasicInfoForm } from '@/components/invitation/BasicInfoForm';
import styles from './page.module.css';

export default function InvitationInfoPage() {
  return (
    <div className={styles.page}>
      <ProgressBar title="청첩장 만들기" currentStep={1} totalSteps={6} />
      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <p className={styles.stepLabel}>STEP 1</p>
            <h1 className={styles.pageTitle}>기본 정보 입력</h1>
            <p className={styles.subTitle}>신랑·신부 및 예식 정보를 입력해주세요</p>
          </header>
          <BasicInfoForm />
        </section>
      </main>
    </div>
  );
}
