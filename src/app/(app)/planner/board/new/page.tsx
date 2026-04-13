'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useCreatePost } from '@/features/community/hooks';
import { ALL_TAGS, TAG_EMOJI, TAG_LABEL, type CommunityTag } from '@/types/community';
// couple/community/new와 동일한 레이아웃·스타일 재사용
import styles from '@/app/(app)/couple/community/new/page.module.css';

const TITLE_MAX   = 100;
const CONTENT_MAX = 3000;
const TAG_MAX     = 4;

export default function PlannerNewPostPage() {
  const router = useRouter();
  const createPost = useCreatePost();

  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [tags,    setTags]    = useState<CommunityTag[]>([]);

  const toggleTag = (tag: CommunityTag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < TAG_MAX) {
      setTags([...tags, tag]);
    }
  };

  const canSubmit =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    tags.length > 0 &&
    !createPost.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const post = await createPost.mutateAsync({
      title: title.trim(),
      content: content.trim(),
      tags,
    });
    router.replace(`/planner/board/${post.postId}`);
  };

  const titleRemaining   = TITLE_MAX - title.length;
  const contentRemaining = CONTENT_MAX - content.length;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button type="button" className={styles.backBtn} onClick={() => router.back()}>
          <ChevronLeft size={18} />
          돌아가기
        </button>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h1 className={styles.formTitle}>새 글 작성</h1>

          <div className={styles.field}>
            <label className={styles.label}>제목 *</label>
            <input
              type="text"
              className={`${styles.input} ${styles.titleInput}`}
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
              required
            />
            <span className={`${styles.titleCount} ${titleRemaining < 20 ? styles.countWarn : ''}`}>
              {titleRemaining}자 남음
            </span>
          </div>

          <div className={styles.tagSection}>
            <span className={styles.tagLabel}>태그 * (최대 {TAG_MAX}개)</span>
            <div className={styles.tagGrid}>
              {ALL_TAGS.map((tag) => {
                const active   = tags.includes(tag);
                const disabled = !active && tags.length >= TAG_MAX;
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.tagChip} ${active ? styles.tagChipActive : ''}`}
                    onClick={() => toggleTag(tag)}
                    disabled={disabled}
                    aria-pressed={active}
                  >
                    <span aria-hidden="true">{TAG_EMOJI[tag]}</span>
                    {TAG_LABEL[tag]}
                  </button>
                );
              })}
            </div>
            <p className={styles.tagHint}>
              {tags.length === 0
                ? '관련 태그를 선택하면 더 많은 사람에게 노출돼요.'
                : `선택됨: ${tags.map((t) => TAG_LABEL[t]).join(', ')}`}
            </p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>내용 *</label>
            <textarea
              className={`${styles.textarea} ${styles.contentArea}`}
              placeholder="자유롭게 이야기를 나눠보세요..."
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
              required
            />
            <span className={`${styles.contentCount} ${contentRemaining < 200 ? styles.countWarn : ''}`}>
              {contentRemaining}자 남음
            </span>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>
              취소
            </button>
            <button type="submit" className={styles.submitBtn} disabled={!canSubmit}>
              {createPost.isPending ? '등록 중…' : '게시하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
