// ── 마일스톤 타입 ──────────────────────────────────────────────────────────────
export type StoryMilestone =
  | 'first_meet'
  | 'proposal'
  | 'engagement'
  | 'venue'
  | 'dress'
  | 'photo'
  | 'honeymoon'
  | 'etc';

// ── Record 상수 ───────────────────────────────────────────────────────────────
export const MILESTONE_LABEL: Record<StoryMilestone, string> = {
  first_meet: '첫 만남',
  proposal:   '프로포즈',
  engagement: '약혼',
  venue:      '웨딩홀',
  dress:      '드레스',
  photo:      '스냅',
  honeymoon:  '허니문',
  etc:        '기타',
};

export const MILESTONE_EMOJI: Record<StoryMilestone, string> = {
  first_meet: '💑',
  proposal:   '💍',
  engagement: '🥂',
  venue:      '🏛️',
  dress:      '👗',
  photo:      '📷',
  honeymoon:  '✈️',
  etc:        '📝',
};

export const MILESTONE_COLOR: Record<StoryMilestone, string> = {
  first_meet: '#f43f5e',
  proposal:   '#ec4899',
  engagement: '#a855f7',
  venue:      '#fb7185',
  dress:      '#f472b6',
  photo:      '#818cf8',
  honeymoon:  '#38bdf8',
  etc:        '#94a3b8',
};

export const ALL_MILESTONES: StoryMilestone[] = [
  'first_meet', 'proposal', 'engagement', 'venue',
  'dress', 'photo', 'honeymoon', 'etc',
];

// ── 도메인 모델 ───────────────────────────────────────────────────────────────
export interface StoryEntry {
  id:        string;
  title:     string;
  content:   string;
  date:      string;      // "YYYY-MM-DD"
  milestone: StoryMilestone;
  liked:     boolean;
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
}

export interface CreateStoryInput {
  title:     string;
  content:   string;
  date:      string;
  milestone: StoryMilestone;
}

export type UpdateStoryInput = CreateStoryInput & { id: string };

// ── 헬퍼 ─────────────────────────────────────────────────────────────────────
export function formatStoryDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일`;
}
