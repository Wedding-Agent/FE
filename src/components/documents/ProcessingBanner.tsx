import styles from './ProcessingBanner.module.css';

interface Props {
  count: number;
}

export function ProcessingBanner({ count }: Props) {
  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <span className={styles.dot} aria-hidden="true" />
      <p className={styles.text}>
        AI가 {count}개의 문서를 분석하고 있어요. 잠시 기다려주세요.
      </p>
    </div>
  );
}
