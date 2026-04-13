// ── 카테고리 / 우선순위 타입 ─────────────────────────────────────────────────
export type TaskCategory =
  | 'venue' | 'studio' | 'dress' | 'makeup'
  | 'invitation' | 'honeymoon' | 'etc';

export type TaskPriority = 'high' | 'normal' | 'low';

// ── Record 상수 ───────────────────────────────────────────────────────────────
export const TASK_CATEGORY_LABEL: Record<TaskCategory, string> = {
  venue:      '웨딩홀',
  studio:     '스냅',
  dress:      '드레스/수트',
  makeup:     '헤어·메이크업',
  invitation: '청첩장',
  honeymoon:  '허니문',
  etc:        '기타',
};

export const TASK_CATEGORY_EMOJI: Record<TaskCategory, string> = {
  venue:      '🏛️',
  studio:     '📷',
  dress:      '👗',
  makeup:     '💄',
  invitation: '💌',
  honeymoon:  '✈️',
  etc:        '📝',
};

export const ALL_TASK_CATEGORIES: TaskCategory[] = [
  'venue', 'studio', 'dress', 'makeup', 'invitation', 'honeymoon', 'etc',
];

export const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, normal: 1, low: 2 };
export const PRIORITY_LABEL: Record<TaskPriority, string>  = { high: '높음', normal: '보통', low: '낮음' };
export const PRIORITY_COLOR: Record<TaskPriority, string>  = { high: '#ef4444', normal: '#f59e0b', low: '#94a3b8' };

// ── 도메인 모델 ───────────────────────────────────────────────────────────────
export interface SharedTask {
  id:        string;
  title:     string;
  category:  TaskCategory;
  priority:  TaskPriority;
  dueDate?:  string;   // YYYY-MM-DD (선택)
  done:      boolean;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
}

export interface CreateTaskInput {
  title:    string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
}

export type UpdateTaskInput = CreateTaskInput & { id: string };
