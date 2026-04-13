'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Trash2 } from 'lucide-react';
import {
  usePostDetail,
  useToggleLike,
  useAddComment,
  useDeleteComment,
  useDeletePost,
} from '@/features/community/hooks';
import { CommentItem }  from '@/components/community/CommentItem';
import { CommentInput } from '@/components/community/CommentInput';
import { TAG_EMOJI, TAG_LABEL, formatRelativeTime } from '@/types/community';
// couple/community/[postId]와 동일한 레이아웃·스타일 재사용
import styles from '@/app/(app)/couple/community/[postId]/page.module.css';

interface Props {
  params: Promise<{ postId: string }>;
}

export default function PlannerPostDetailPage({ params }: Props) {
  const { postId } = use(params);
  const router = useRouter();

  const { data, isLoading, isError, refetch } = usePostDetail(postId);
  const toggleLike    = useToggleLike(postId);
  const addComment    = useAddComment(postId);
  const deleteComment = useDeleteComment(postId);
  const deletePost    = useDeletePost();

  const post     = data?.post;
  const comments = data?.comments ?? [];

  const handleDelete = async () => {
    if (!confirm('이 게시글을 삭제하시겠어요?')) return;
    await deletePost.mutateAsync(postId);
    router.replace('/planner/board');
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button type="button" className={styles.backBtn} onClick={() => router.back()}>
          <ChevronLeft size={18} />
          목록으로
        </button>

        {isLoading && (
          <div className={styles.skeleton}>
            <div className={styles.skeletonPost} />
            <div className={styles.skeletonComments} />
          </div>
        )}

        {isError && (
          <div className={styles.errorWrap}>
            <p className={styles.errorText}>게시글을 불러오지 못했어요.</p>
            <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        )}

        {post && (
          <>
            <article className={styles.postCard}>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {TAG_EMOJI[tag]} {TAG_LABEL[tag]}
                  </span>
                ))}
              </div>
              <h1 className={styles.postTitle}>{post.title}</h1>
              <div className={styles.authorRow}>
                <div className={styles.authorInfo}>
                  <span className={styles.authorEmoji} aria-hidden="true">
                    {post.author.profileEmoji}
                  </span>
                  <div>
                    <p className={styles.authorName}>{post.author.nickname}</p>
                    <p className={styles.authorTime}>{formatRelativeTime(post.createdAt)}</p>
                  </div>
                </div>
                {post.author.userId === 'me' && (
                  <div className={styles.postActions}>
                    <button
                      type="button"
                      className={styles.deletePostBtn}
                      onClick={handleDelete}
                      disabled={deletePost.isPending}
                    >
                      <Trash2 size={13} />
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <p className={styles.postContent}>{post.content}</p>
              <div className={styles.likeRow}>
                <button
                  type="button"
                  className={`${styles.likeBtn} ${post.isLiked ? styles.likeBtnActive : ''}`}
                  onClick={() => toggleLike.mutate({ liked: !post.isLiked })}
                  disabled={toggleLike.isPending}
                >
                  <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                  {post.likeCount}
                </button>
              </div>
            </article>

            <section className={styles.commentsSection}>
              <h2 className={styles.commentsTitle}>
                댓글 {comments.length > 0 ? `${comments.length}개` : ''}
              </h2>
              {comments.length === 0 ? (
                <p className={styles.noComments}>첫 번째 댓글을 남겨보세요 💬</p>
              ) : (
                <div className={styles.commentList}>
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.commentId}
                      comment={comment}
                      onDelete={(id) => deleteComment.mutate(id)}
                      isPending={deleteComment.isPending}
                    />
                  ))}
                </div>
              )}
              <CommentInput
                onSubmit={(content) => addComment.mutate(content)}
                isPending={addComment.isPending}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
