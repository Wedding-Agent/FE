'use client';

import { useRouter } from 'next/navigation';
import { Heart, MessageCircle } from 'lucide-react';
import { TAG_EMOJI, TAG_LABEL, formatRelativeTime, type CommunityPost } from '@/types/community';
import styles from './PostCard.module.css';

interface PostCardProps {
  post:      CommunityPost;
  basePath?: string;
}

export function PostCard({ post, basePath = '/couple/community' }: PostCardProps) {
  const router = useRouter();

  return (
    <article
      className={styles.card}
      onClick={() => router.push(`${basePath}/${post.postId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`${basePath}/${post.postId}`)}
    >
      {/* Tags */}
      <div className={styles.tags}>
        {post.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {TAG_EMOJI[tag]} {TAG_LABEL[tag]}
          </span>
        ))}
      </div>

      {/* Title */}
      <h2 className={styles.title}>{post.title}</h2>

      {/* Preview */}
      <p className={styles.preview}>{post.preview}</p>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.author}>
          <span className={styles.authorEmoji} aria-hidden="true">
            {post.author.profileEmoji}
          </span>
          <span className={styles.authorName}>{post.author.nickname}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.time}>{formatRelativeTime(post.createdAt)}</span>
        </div>
        <div className={styles.stats}>
          <span className={`${styles.stat} ${post.isLiked ? styles.statLiked : ''}`}>
            <Heart size={13} fill={post.isLiked ? 'currentColor' : 'none'} />
            {post.likeCount}
          </span>
          <span className={styles.stat}>
            <MessageCircle size={13} />
            {post.commentCount}
          </span>
        </div>
      </div>
    </article>
  );
}
