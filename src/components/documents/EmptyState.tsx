import styles from './EmptyState.module.css';

interface Props {
  category?: string;
}

export function EmptyState({ category }: Props) {
  const isFiltered = category && category !== 'ALL';
  return (
    <div className={styles.wrap} role="status" aria-label="문서 없음">
      <span className={styles.icon} aria-hidden="true">📂</span>
      <p className={styles.title}>
        {isFiltered ? '해당 카테고리에 문서가 없어요' : '아직 문서가 없어요'}
      </p>
      <p className={styles.desc}>
        {isFiltered
          ? '다른 카테고리를 선택하거나 새 문서를 업로드해주세요.'
          : '계약서, 영수증 등 웨딩 관련 문서를\n사진으로 업로드하면 AI가 자동으로 분류해요.'}
      </p>
    </div>
  );
}
