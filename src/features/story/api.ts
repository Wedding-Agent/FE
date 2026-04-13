import type {
  CreateStoryInput,
  StoryEntry,
  StoryMilestone,
  UpdateStoryInput,
} from '@/types/story';

function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ── Mock 데이터 (최신순) ──────────────────────────────────────────────────────
let MOCK_STORIES: StoryEntry[] = [
  {
    id: 'story-8', milestone: 'etc',
    date: '2026-04-05', title: '웨딩 준비 중간 일지',
    content: '드디어 웨딩 준비도 막바지에 접어들었어요. 청첩장 디자인도 확정됐고 식순도 MC와 조율 완료! 남은 건 드레스 최종 수선과 부케 선택인데, 생각보다 결정할 게 많아서 둘이 같이 카페에서 체크리스트 점검했어요. 힘들지만 설레는 마음이 더 커요.',
    liked: false,
    createdAt: '2026-04-05T10:00:00Z', updatedAt: '2026-04-05T10:00:00Z',
  },
  {
    id: 'story-7', milestone: 'honeymoon',
    date: '2026-03-30', title: '발리 허니문 확정',
    content: '허니문 장소로 오래 고민하던 발리로 최종 확정했어요! 울루와뚜 절벽 근처 리조트로 예약 완료. 5박 7일 일정으로 스파, 라이스 테라스 투어, 커플 요리 클래스까지 알차게 계획했어요. 결혼식 끝나고 바로 비행기 타는 거라 피곤하겠지만 너무 기대돼요.',
    liked: false,
    createdAt: '2026-03-30T14:00:00Z', updatedAt: '2026-03-30T14:00:00Z',
  },
  {
    id: 'story-6', milestone: 'photo',
    date: '2026-02-08', title: '야외 스냅 촬영 다녀왔어요',
    content: '서초 자연 스냅 작가님과 남산 야외 촬영을 다녀왔어요. 날씨가 완벽해서 사진이 정말 예쁘게 나왔어요. 드레스 입고 걷다가 계단에서 넘어질 뻔했는데, 그 순간도 자연스럽게 찍혀서 오히려 웃픈 명장면이 됐어요. 셀렉 무제한이라 고르는 게 더 힘들 것 같아요.',
    liked: false,
    createdAt: '2026-02-08T09:00:00Z', updatedAt: '2026-02-08T09:00:00Z',
  },
  {
    id: 'story-5', milestone: 'dress',
    date: '2025-11-22', title: '드레스 최종 선택!',
    content: '청담 브라이덜 하우스에서 세 번의 피팅 끝에 드레스를 최종 결정했어요. A라인 레이스 드레스로 골랐는데, 입어보는 순간 눈물이 왈칵 나올 뻔했어요. 엄마도 같이 왔는데 실제로 눈물 흘리셨어요. 수선 두 번 더 받으면 완성이에요!',
    liked: true,
    createdAt: '2025-11-22T15:00:00Z', updatedAt: '2025-11-22T15:00:00Z',
  },
  {
    id: 'story-4', milestone: 'venue',
    date: '2025-08-10', title: '그랜드 힐튼 웨딩 계약 완료',
    content: '웨딩홀 세 군데 투어 끝에 그랜드 힐튼으로 최종 결정하고 계약서에 사인했어요. 강남이라 접근성도 좋고, 연회장 뷰가 정말 압도적이에요. 예산이 살짝 초과됐지만 인생에 한 번인데 후회 없이 선택하자고 했어요. 이제 진짜 현실이 됐네요!',
    liked: true,
    createdAt: '2025-08-10T11:00:00Z', updatedAt: '2025-08-10T11:00:00Z',
  },
  {
    id: 'story-3', milestone: 'engagement',
    date: '2025-03-15', title: '가족들과 함께한 약혼식',
    content: '양가 부모님과 형제들이 모인 작은 약혼식을 열었어요. 레스토랑 프라이빗 룸을 빌려서 조촐하게 했는데 분위기가 정말 따뜻했어요. 어머니 두 분이 처음 만나셨는데 너무 잘 맞으셔서 마음이 놓였어요. 함 받는 날, 두 가족이 하나가 되는 기분이었어요.',
    liked: false,
    createdAt: '2025-03-15T12:00:00Z', updatedAt: '2025-03-15T12:00:00Z',
  },
  {
    id: 'story-2', milestone: 'proposal',
    date: '2024-10-20', title: '인생 최고의 순간',
    content: '제주도 여행 마지막 날 일몰 시간에 성산일출봉 앞에서 프로포즈를 받았어요. 반지를 꺼내는 순간 세상이 멈춘 것 같았어요. 너무 놀라서 한참 말을 못 했는데, 결국 "응"이라는 한 마디에 둘 다 펑펑 울었어요. 마침 지나가던 분이 사진을 찍어주셔서 그 순간이 남아있어요.',
    liked: true,
    createdAt: '2024-10-20T17:30:00Z', updatedAt: '2024-10-20T17:30:00Z',
  },
  {
    id: 'story-1', milestone: 'first_meet',
    date: '2024-04-13', title: '우리가 처음 만난 날',
    content: '친구 생일파티에서 처음 만났어요. 음악 취향 얘기를 하다가 둘 다 같은 밴드를 좋아한다는 걸 알게 됐고 그날 새벽 2시까지 카페에서 이야기했어요. 집에 가면서 "이 사람 또 보고 싶다"고 생각했는데, 일주일 뒤에 콘서트 티켓 두 장 들고 연락이 왔어요. 운명이었던 것 같아요.',
    liked: true,
    createdAt: '2024-04-13T20:00:00Z', updatedAt: '2024-04-13T20:00:00Z',
  },
];

let storyIdCounter = 8;
function genId(): string {
  return `story-${++storyIdCounter}`;
}

// ── API 함수 ──────────────────────────────────────────────────────────────────

export async function fetchStories(milestone?: StoryMilestone | null): Promise<StoryEntry[]> {
  if (isMockMode()) {
    if (!milestone) return [...MOCK_STORIES];
    return MOCK_STORIES.filter((s) => s.milestone === milestone);
  }
  const params = new URLSearchParams();
  if (milestone) params.set('milestone', milestone);
  const res = await fetch(`/api/story?${params}`);
  if (!res.ok) throw new Error('Failed to fetch stories');
  return res.json();
}

export async function createStory(input: CreateStoryInput): Promise<StoryEntry> {
  if (isMockMode()) {
    const now = new Date().toISOString();
    const entry: StoryEntry = { ...input, id: genId(), liked: false, createdAt: now, updatedAt: now };
    MOCK_STORIES = [entry, ...MOCK_STORIES];
    return entry;
  }
  const res = await fetch('/api/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create story');
  return res.json();
}

export async function updateStory(input: UpdateStoryInput): Promise<StoryEntry> {
  if (isMockMode()) {
    const now = new Date().toISOString();
    MOCK_STORIES = MOCK_STORIES.map((s) =>
      s.id === input.id ? { ...s, ...input, updatedAt: now } : s,
    );
    return MOCK_STORIES.find((s) => s.id === input.id)!;
  }
  const { id, ...body } = input;
  const res = await fetch(`/api/story/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update story');
  return res.json();
}

export async function deleteStory(id: string): Promise<void> {
  if (isMockMode()) {
    MOCK_STORIES = MOCK_STORIES.filter((s) => s.id !== id);
    return;
  }
  const res = await fetch(`/api/story/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete story');
}

export async function toggleLike(id: string): Promise<StoryEntry> {
  if (isMockMode()) {
    const now = new Date().toISOString();
    MOCK_STORIES = MOCK_STORIES.map((s) =>
      s.id === id ? { ...s, liked: !s.liked, updatedAt: now } : s,
    );
    return MOCK_STORIES.find((s) => s.id === id)!;
  }
  const res = await fetch(`/api/story/${id}/like`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle like');
  return res.json();
}
