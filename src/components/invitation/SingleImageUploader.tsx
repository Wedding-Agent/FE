'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './SingleImageUploader.module.css';

interface Props {
  label?: string;
  helperText?: string;
  buttonText?: string;
  accept?: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  initialPreviewUrl?: string;
}

export default function SingleImageUploader({
  label = '웨딩 사진 업로드',
  helperText = '클릭하여 사진을 선택하세요',
  buttonText = '사진 선택하기',
  accept = 'image/*',
  value,
  onChange,
  initialPreviewUrl,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialPreviewUrl ?? '');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!value) return;
    if (typeof value === 'string') { setPreview(value); setFile(null); return; }
    if (value instanceof File) {
      setFile(value);
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePick = (picked: File) => { setFile(picked); onChange?.(picked); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) handlePick(picked);
    e.target.value = '';
  };

  const clear = () => { setFile(null); setPreview(''); onChange?.(null); };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.type?.startsWith('image/')) handlePick(dropped);
  };

  return (
    <div className={styles.wrap}>
      <input ref={inputRef} type="file" accept={accept} className={styles.hiddenInput} onChange={handleInputChange} />
      {!preview ? (
        <button
          type="button"
          className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          onDrop={onDrop}
          aria-label={label}
        >
          <div className={styles.icon} aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M7 9.5C7 8.67 7.67 8 8.5 8C9.33 8 10 8.67 10 9.5C10 10.33 9.33 11 8.5 11C7.67 11 7 10.33 7 9.5Z" fill="currentColor" opacity="0.7" />
              <path d="M4 6.5C4 5.12 5.12 4 6.5 4H17.5C18.88 4 20 5.12 20 6.5V17.5C20 18.88 18.88 20 17.5 20H6.5C5.12 20 4 18.88 4 17.5V6.5Z" stroke="currentColor" strokeWidth="1.7" opacity="0.65" />
              <path d="M6.5 16.5L10 13L12.5 15.5L15.5 12.5L17.5 16.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            </svg>
          </div>
          <div className={styles.title}>{label}</div>
          <div className={styles.helper}>{helperText}</div>
          <div className={styles.cta}>{buttonText}</div>
          <div className={styles.hint}>드래그를 통한 첨부도 가능합니다!</div>
        </button>
      ) : (
        <div className={styles.previewCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="업로드된 이미지 미리보기" className={styles.previewImg} />
          <button type="button" className={styles.removeBtn} onClick={clear} aria-label="이미지 제거">×</button>
        </div>
      )}
    </div>
  );
}
