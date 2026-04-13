'use client';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './ImageUploader.module.css';

interface Props {
  maxCount?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
}

export default function ImageUploader({ maxCount = 10, value, onChange, accept = 'image/*' }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [innerFiles, setInnerFiles] = useState<File[]>([]);
  const files = value ?? innerFiles;

  const setFiles = (next: File[]) => { if (onChange) onChange(next); else setInnerFiles(next); };
  const remaining = useMemo(() => Math.max(0, maxCount - files.length), [maxCount, files.length]);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    setFiles([...files, ...picked.slice(0, remaining)]);
    e.target.value = '';
  };

  const removeAt = (idx: number) => setFiles(files.filter((_, i) => i !== idx));

  const [previews, setPreviews] = useState<{ id: string; url: string }[]>([]);
  useEffect(() => {
    const next = files.map((f) => ({ id: `${f.name}-${f.size}-${f.lastModified}`, url: URL.createObjectURL(f) }));
    setPreviews(next);
    return () => next.forEach((p) => URL.revokeObjectURL(p.url));
  }, [files]);

  useEffect(() => {
    listRef.current?.scrollTo({ left: listRef.current.scrollWidth, behavior: 'smooth' });
  }, [files.length]);

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.addCard} onClick={() => remaining && inputRef.current?.click()} disabled={!remaining}>
        <div className={styles.plus}>+</div>
        <div className={styles.addText}>이미지 추가</div>
        <div className={styles.count}>{files.length}/{maxCount}</div>
        {!remaining && <div className={styles.hint}>최대 {maxCount}장까지</div>}
      </button>
      <div className={styles.list} ref={listRef}>
        {previews.map((p, idx) => (
          <div key={p.id} className={styles.thumbItem}>
            <div className={styles.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`upload-${idx + 1}`} />
            </div>
            <div className={styles.thumbFooter}>
              <span className={styles.thumbIndex}>{idx + 1}</span>
              <button type="button" className={styles.removeBtn} onClick={() => removeAt(idx)} aria-label="remove">✕</button>
            </div>
          </div>
        ))}
      </div>
      <input id={inputId} ref={inputRef} className={styles.hiddenInput} type="file" accept={accept} multiple onChange={handlePick} />
    </div>
  );
}
