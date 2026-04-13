export type CommunityTag =
  | 'VENUE'
  | 'PHOTO'
  | 'DRESS'
  | 'MAKEUP'
  | 'HONEYMOON'
  | 'CATERING'
  | 'FLOWER'
  | 'GIFT'
  | 'TIPS'
  | 'REVIEW'
  | 'QUESTION';

export type CommunitySort = 'LATEST' | 'POPULAR';

export const TAG_LABEL: Record<CommunityTag, string> = {
  VENUE:     '웨딩홀',
  PHOTO:     '사진·영상',
  DRESS:     '드레스·예복',
  MAKEUP:    '헤어·메이크업',
  HONEYMOON: '신혼여행',
  CATERING:  '식대·케이터링',
  FLOWER:    '꽃장식',
  GIFT:      '예물·예단',
  TIPS:      '웨딩팁',
  REVIEW:    '후기',
  QUESTION:  '질문',
};

export const TAG_EMOJI: Record<CommunityTag, string> = {
  VENUE:     '🏛️',
  PHOTO:     '📷',
  DRESS:     '👗',
  MAKEUP:    '💄',
  HONEYMOON: '✈️',
  CATERING:  '🍽️',
  FLOWER:    '🌸',
  GIFT:      '💍',
  TIPS:      '💡',
  REVIEW:    '⭐',
  QUESTION:  '❓',
};

export const ALL_TAGS: CommunityTag[] = [
  'TIPS', 'REVIEW', 'QUESTION',
  'VENUE', 'PHOTO', 'DRESS', 'MAKEUP',
  'HONEYMOON', 'CATERING', 'FLOWER', 'GIFT',
];

export interface PostAuthor {
  userId: string;
  nickname: string;
  profileEmoji: string;
}

export interface CommunityPost {
  postId: string;
  title: string;
  content: string;
  preview: string;       // first ~120 chars
  tags: CommunityTag[];
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityComment {
  commentId: string;
  postId: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  isOwner: boolean;
}

export interface PostListResponse {
  posts: CommunityPost[];
  hasNext: boolean;
  lastId?: string;
}

export interface PostDetailResponse {
  post: CommunityPost;
  comments: CommunityComment[];
}

// ── helpers ──────────────────────────────────────────────────────

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return '방금';
  if (mins  < 60) return `${mins}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days  < 7)  return `${days}일 전`;
  return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}
