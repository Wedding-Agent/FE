import { apiClient } from '@/lib/api-client';
import type {
  CommunityPost,
  CommunityComment,
  CommunitySort,
  CommunityTag,
  PostListResponse,
  PostDetailResponse,
} from '@/types/community';

// TODO: BE 연동 시 mock 데이터 제거

function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ────────────────────────────────────────────────────────────────
// Mock state
// ────────────────────────────────────────────────────────────────

const MOCK_USER_ID = 'me';

let MOCK_POSTS: CommunityPost[] = [
  {
    postId: 'p-1',
    title: '그랜드웨딩홀 실제 후기입니다 😊',
    content:
      '안녕하세요! 지난 주에 그랜드웨딩홀에서 웨딩을 진행했어요. 홀 자체는 정말 아름답고 식장 직원분들도 친절하셨어요. 다만 주차 공간이 협소해서 하객분들이 조금 불편해하셨습니다. 식대는 1인당 65,000원이었는데 음식 퀄리티가 꽤 좋았어요. 궁금한 점 있으시면 댓글 남겨주세요!',
    preview: '지난 주에 그랜드웨딩홀에서 웨딩을 진행했어요. 홀 자체는 정말 아름답고 식장 직원분들도 친절하셨어요. 다만 주차...',
    tags: ['VENUE', 'REVIEW'],
    author: { userId: 'u-1', nickname: '행복한예비신부', profileEmoji: '👰' },
    likeCount: 34,
    commentCount: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    postId: 'p-2',
    title: '드레스 샵 비교해봤어요 (강남 5곳)',
    content:
      '강남 드레스 샵 5곳을 직접 방문하고 비교했습니다. 1. 라벨드레스 - 디자인 다양, 가격 높음 2. 화이트로즈 - 가성비 최고 3. 미라클드레스 - 커스텀 가능 4. 로맨스브라이덜 - 친절함 최고 5. 드림웨딩 - 한복 병행 가능. 가장 추천하는 곳은 화이트로즈예요! 가격 대비 퀄리티가 훌륭합니다.',
    preview: '강남 드레스 샵 5곳을 직접 방문하고 비교했습니다. 라벨드레스, 화이트로즈, 미라클드레스 등 가격과 퀄리티를...',
    tags: ['DRESS', 'TIPS', 'REVIEW'],
    author: { userId: 'u-2', nickname: '웨딩준비중🌸', profileEmoji: '💐' },
    likeCount: 87,
    commentCount: 23,
    isLiked: true,
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    postId: 'p-3',
    title: '허니문 몰디브 vs 발리 어떻게 결정하셨어요?',
    content:
      '신혼여행을 몰디브와 발리 사이에서 고민 중입니다. 몰디브는 수상방갈로 로망이 있는데 비용이 너무 비싸서요... 발리는 문화체험도 하고 음식도 맛있다고 해서 매력적인데 치안이 좀 걱정됩니다. 실제로 다녀오신 분들 경험 공유해주시면 정말 감사해요!',
    preview: '신혼여행을 몰디브와 발리 사이에서 고민 중입니다. 몰디브는 수상방갈로 로망이 있는데 비용이 너무 비싸서요...',
    tags: ['HONEYMOON', 'QUESTION'],
    author: { userId: 'u-3', nickname: '예비신랑강동원', profileEmoji: '🤵' },
    likeCount: 15,
    commentCount: 31,
    isLiked: false,
    createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
  },
  {
    postId: 'p-4',
    title: '웨딩 스냅 촬영 꿀팁 공유해요 📸',
    content:
      '스냅 촬영 경험을 바탕으로 꿀팁을 정리했어요. 1. 메이크업 고려해서 촬영 시간 설정하기 2. 골든아워(일몰 전 1시간) 활용 3. 야외 촬영 시 바람막이 가져가기 4. 드레스 핀 여분 챙기기 5. 신랑 양복 예비 와이셔츠 필수. 촬영 당일 여유 있게 준비하면 사진이 훨씬 자연스럽게 나와요!',
    preview: '스냅 촬영 경험을 바탕으로 꿀팁을 정리했어요. 메이크업 고려한 촬영 시간 설정, 골든아워 활용, 야외 촬영 준비물 등...',
    tags: ['PHOTO', 'TIPS'],
    author: { userId: 'u-4', nickname: '스냅작가꿈나무', profileEmoji: '📷' },
    likeCount: 102,
    commentCount: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
  },
  {
    postId: 'p-5',
    title: '청첩장 문구 추천 받아요 💌',
    content:
      '청첩장 문구를 작성 중인데 너무 딱딱하지 않으면서도 품위있는 문구를 찾고 있어요. 전통적인 한자 문구보다는 요즘 트렌드에 맞는 감성적인 문구로 하고 싶습니다. 혹시 본인 청첩장 문구 공유해주실 수 있나요? 아니면 좋았던 문구 추천도 환영해요!',
    preview: '청첩장 문구를 작성 중인데 너무 딱딱하지 않으면서도 품위있는 문구를 찾고 있어요. 감성적인 문구 추천 부탁드립니다!',
    tags: ['TIPS', 'QUESTION'],
    author: { userId: 'u-5', nickname: '2026봄결혼예정', profileEmoji: '🌷' },
    likeCount: 28,
    commentCount: 47,
    isLiked: false,
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  },
  {
    postId: 'p-6',
    title: '예물 반지 브랜드 추천 (실구매 후기)',
    content:
      '저희 부부는 까르띠에 러브링으로 결정했어요! 처음엔 주얼리아, 티파니도 고려했지만 결국 까르띠에로 했습니다. 까르띠에는 AS가 좋고 리세일 가치도 높아서 만족스러워요. 예산이 빠듯하다면 국내 브랜드 중 아이반 로도 퀄리티가 좋더라고요.',
    preview: '저희 부부는 까르띠에 러브링으로 결정했어요! 처음엔 주얼리아, 티파니도 고려했지만 결국 까르띠에로 했습니다...',
    tags: ['GIFT', 'REVIEW'],
    author: { userId: 'u-6', nickname: '결혼D-30💍', profileEmoji: '💎' },
    likeCount: 56,
    commentCount: 19,
    isLiked: false,
    createdAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
  },
  {
    postId: 'p-7',
    title: '헤어·메이크업 리허설 꼭 해야 하나요?',
    content:
      '결혼 준비를 하다보니 메이크업 리허설 비용이 추가로 들어간다고 하더라고요. 보통 20~30만원 정도라는데, 실제로 리허설을 해보니 어떠셨나요? 생략해도 괜찮을지, 아니면 꼭 해야할지 경험자분들 의견 부탁드려요!',
    preview: '결혼 준비를 하다보니 메이크업 리허설 비용이 추가로 들어간다고 하더라고요. 보통 20~30만원 정도라는데...',
    tags: ['MAKEUP', 'QUESTION'],
    author: { userId: 'u-7', nickname: '웨딩초보자', profileEmoji: '🙋' },
    likeCount: 19,
    commentCount: 26,
    isLiked: false,
    createdAt: new Date(Date.now() - 12 * 3_600_000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3_600_000).toISOString(),
  },
  {
    postId: 'p-8',
    title: '꽃장식 업체 선정 시 주의사항 🌹',
    content:
      '꽃장식 업체를 선정하면서 겪었던 시행착오를 공유할게요. 계약서에 꽃 종류와 수량을 반드시 명시해야 해요. 저는 이 부분을 놓쳐서 행사 당일 원하던 것보다 훨씬 적은 꽃이 왔었어요. 또한 행사 당일 설치 시간과 철거 시간도 미리 확인하세요!',
    preview: '꽃장식 업체를 선정하면서 겪었던 시행착오를 공유할게요. 계약서에 꽃 종류와 수량을 반드시 명시해야 해요...',
    tags: ['FLOWER', 'TIPS'],
    author: { userId: 'u-1', nickname: '행복한예비신부', profileEmoji: '👰' },
    likeCount: 43,
    commentCount: 7,
    isLiked: false,
    createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
  },
];

let MOCK_COMMENTS: CommunityComment[] = [
  {
    commentId: 'c-1', postId: 'p-1',
    content: '저도 그랜드웨딩홀 검토 중인데 도움이 많이 됐어요! 혹시 스몰웨딩 패키지는 따로 있었나요?',
    author: { userId: 'u-3', nickname: '예비신랑강동원', profileEmoji: '🤵' },
    createdAt: new Date(Date.now() - 20 * 3_600_000).toISOString(),
    isOwner: false,
  },
  {
    commentId: 'c-2', postId: 'p-1',
    content: '주차가 협소한 건 저도 들었어요. 발렛 서비스는 별도 비용인가요?',
    author: { userId: 'u-5', nickname: '2026봄결혼예정', profileEmoji: '🌷' },
    createdAt: new Date(Date.now() - 18 * 3_600_000).toISOString(),
    isOwner: false,
  },
  {
    commentId: 'c-3', postId: 'p-1',
    content: '후기 감사해요! 정말 도움 됐습니다 🙏',
    author: { userId: MOCK_USER_ID, nickname: '나', profileEmoji: '😊' },
    createdAt: new Date(Date.now() - 5 * 3_600_000).toISOString(),
    isOwner: true,
  },
  {
    commentId: 'c-4', postId: 'p-3',
    content: '몰디브 다녀왔어요! 수상방갈로는 정말 로망인데 가격이 장난이 아니에요 😅 발리는 치안보다는 스쿠터 조심하세요!',
    author: { userId: 'u-2', nickname: '웨딩준비중🌸', profileEmoji: '💐' },
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    isOwner: false,
  },
  {
    commentId: 'c-5', postId: 'p-3',
    content: '저는 발리 선택했는데 너무 좋았어요! 우붓 쪽 풀빌라 추천드려요 🌴',
    author: { userId: 'u-6', nickname: '결혼D-30💍', profileEmoji: '💎' },
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    isOwner: false,
  },
];

// ────────────────────────────────────────────────────────────────
// API functions
// ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export async function fetchPosts(params: {
  sort?: CommunitySort;
  tags?: CommunityTag[];
  lastId?: string;
}): Promise<PostListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 350));
    let posts = [...MOCK_POSTS];

    if (params.tags && params.tags.length > 0) {
      posts = posts.filter((p) =>
        params.tags!.some((t) => p.tags.includes(t)),
      );
    }

    if (params.sort === 'POPULAR') {
      posts.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      posts.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    const startIdx = params.lastId
      ? posts.findIndex((p) => p.postId === params.lastId) + 1
      : 0;
    const page = posts.slice(startIdx, startIdx + PAGE_SIZE);
    return {
      posts: page,
      hasNext: startIdx + PAGE_SIZE < posts.length,
      lastId: page.at(-1)?.postId,
    };
  }

  const sp = new URLSearchParams();
  if (params.sort) sp.set('sort', params.sort);
  if (params.tags?.length) sp.set('tags', params.tags.join(','));
  if (params.lastId) sp.set('lastId', params.lastId);
  sp.set('size', String(PAGE_SIZE));
  return apiClient.get('community/posts', { searchParams: sp }).json<PostListResponse>();
}

export async function fetchPostDetail(postId: string): Promise<PostDetailResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 250));
    const post = MOCK_POSTS.find((p) => p.postId === postId);
    if (!post) throw new Error('게시글을 찾을 수 없습니다.');
    const comments = MOCK_COMMENTS.filter((c) => c.postId === postId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return { post, comments };
  }
  return apiClient.get(`community/posts/${postId}`).json<PostDetailResponse>();
}

export async function createPost(payload: {
  title: string;
  content: string;
  tags: CommunityTag[];
}): Promise<CommunityPost> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 400));
    const newPost: CommunityPost = {
      postId: `p-${Date.now()}`,
      title: payload.title,
      content: payload.content,
      preview: payload.content.slice(0, 120) + (payload.content.length > 120 ? '...' : ''),
      tags: payload.tags,
      author: { userId: MOCK_USER_ID, nickname: '나', profileEmoji: '😊' },
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_POSTS.unshift(newPost);
    return newPost;
  }
  return apiClient.post('community/posts', { json: payload }).json<CommunityPost>();
}

export async function deletePost(postId: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const idx = MOCK_POSTS.findIndex((p) => p.postId === postId);
    if (idx !== -1) MOCK_POSTS.splice(idx, 1);
    return;
  }
  await apiClient.delete(`community/posts/${postId}`);
}

export async function toggleLike(postId: string, liked: boolean): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const post = MOCK_POSTS.find((p) => p.postId === postId);
    if (post) {
      post.isLiked = liked;
      post.likeCount += liked ? 1 : -1;
    }
    return;
  }
  if (liked) {
    await apiClient.post(`community/posts/${postId}/like`);
  } else {
    await apiClient.delete(`community/posts/${postId}/like`);
  }
}

export async function addComment(postId: string, content: string): Promise<CommunityComment> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const newComment: CommunityComment = {
      commentId: `c-${Date.now()}`,
      postId,
      content,
      author: { userId: MOCK_USER_ID, nickname: '나', profileEmoji: '😊' },
      createdAt: new Date().toISOString(),
      isOwner: true,
    };
    MOCK_COMMENTS.push(newComment);
    const post = MOCK_POSTS.find((p) => p.postId === postId);
    if (post) post.commentCount += 1;
    return newComment;
  }
  return apiClient
    .post(`community/posts/${postId}/comments`, { json: { content } })
    .json<CommunityComment>();
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const idx = MOCK_COMMENTS.findIndex((c) => c.commentId === commentId);
    if (idx !== -1) MOCK_COMMENTS.splice(idx, 1);
    const post = MOCK_POSTS.find((p) => p.postId === postId);
    if (post) post.commentCount = Math.max(0, post.commentCount - 1);
    return;
  }
  await apiClient.delete(`community/posts/${postId}/comments/${commentId}`);
}

export async function searchPosts(keyword: string, lastId?: string): Promise<PostListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const kw = keyword.toLowerCase();
    const matched = MOCK_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.content.toLowerCase().includes(kw),
    );
    return { posts: matched, hasNext: false };
  }
  const sp = new URLSearchParams({ keyword, size: String(PAGE_SIZE) });
  if (lastId) sp.set('lastId', lastId);
  return apiClient.get('community/search', { searchParams: sp }).json<PostListResponse>();
}
