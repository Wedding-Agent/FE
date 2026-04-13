import type { CreateTaskInput, SharedTask, TaskPriority, UpdateTaskInput } from '@/types/couple-space';
import { PRIORITY_ORDER } from '@/types/couple-space';

function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ── 정렬 헬퍼 ─────────────────────────────────────────────────────────────────
export function sortTasks(tasks: SharedTask[]): SharedTask[] {
  const byPriority = (a: SharedTask, b: SharedTask) =>
    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  return [
    ...tasks.filter((t) => !t.done).sort(byPriority),
    ...tasks.filter((t) =>  t.done).sort(byPriority),
  ];
}

// ── Mock 데이터 ───────────────────────────────────────────────────────────────
let MOCK_TASKS: SharedTask[] = sortTasks([
  { id:'task-1',  title:'웨딩홀 계약',             category:'venue',      priority:'high',   dueDate:'2025-08-10', done:true,  createdAt:'2025-07-01T10:00:00Z', updatedAt:'2025-08-10T10:00:00Z' },
  { id:'task-2',  title:'드레스 1차 피팅',          category:'dress',      priority:'normal', dueDate:'2025-10-15', done:true,  createdAt:'2025-09-01T10:00:00Z', updatedAt:'2025-10-15T10:00:00Z' },
  { id:'task-3',  title:'청첩장 디자인 선택',       category:'invitation', priority:'normal', dueDate:undefined,    done:true,  createdAt:'2025-11-01T10:00:00Z', updatedAt:'2025-11-20T10:00:00Z' },
  { id:'task-4',  title:'스냅 작가 계약',           category:'studio',     priority:'normal', dueDate:'2025-09-20', done:true,  createdAt:'2025-08-15T10:00:00Z', updatedAt:'2025-09-20T10:00:00Z' },
  { id:'task-5',  title:'웨딩홀 식순 확정',         category:'venue',      priority:'high',   dueDate:'2026-07-01', done:false, createdAt:'2026-01-10T10:00:00Z', updatedAt:'2026-01-10T10:00:00Z' },
  { id:'task-6',  title:'드레스 최종 수선',         category:'dress',      priority:'normal', dueDate:'2026-08-20', done:false, createdAt:'2026-02-01T10:00:00Z', updatedAt:'2026-02-01T10:00:00Z' },
  { id:'task-7',  title:'헤어 메이크업 리허설',     category:'makeup',     priority:'normal', dueDate:'2026-09-10', done:false, createdAt:'2026-02-10T10:00:00Z', updatedAt:'2026-02-10T10:00:00Z' },
  { id:'task-8',  title:'신랑 수트 피팅',           category:'dress',      priority:'normal', dueDate:'2026-07-15', done:false, createdAt:'2026-03-01T10:00:00Z', updatedAt:'2026-03-01T10:00:00Z' },
  { id:'task-9',  title:'청첩장 발송',              category:'invitation', priority:'high',   dueDate:'2026-09-01', done:false, createdAt:'2026-03-15T10:00:00Z', updatedAt:'2026-03-15T10:00:00Z' },
  { id:'task-10', title:'허니문 항공권 예약',       category:'honeymoon',  priority:'normal', dueDate:'2026-08-01', done:false, createdAt:'2026-04-01T10:00:00Z', updatedAt:'2026-04-01T10:00:00Z' },
  { id:'task-11', title:'예물 반지 수령',           category:'etc',        priority:'low',    dueDate:undefined,    done:false, createdAt:'2026-04-05T10:00:00Z', updatedAt:'2026-04-05T10:00:00Z' },
  { id:'task-12', title:'사진 셀렉 완료',           category:'studio',     priority:'low',    dueDate:undefined,    done:false, createdAt:'2026-04-10T10:00:00Z', updatedAt:'2026-04-10T10:00:00Z' },
]);

let taskIdCounter = 12;
function genId(): string { return `task-${++taskIdCounter}`; }

// ── API 함수 ──────────────────────────────────────────────────────────────────

export async function fetchTasks(): Promise<SharedTask[]> {
  if (isMockMode()) return sortTasks([...MOCK_TASKS]);
  const res = await fetch('/api/couple-space/tasks');
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(input: CreateTaskInput): Promise<SharedTask> {
  if (isMockMode()) {
    const now = new Date().toISOString();
    const task: SharedTask = { ...input, id: genId(), done: false, createdAt: now, updatedAt: now };
    MOCK_TASKS = sortTasks([task, ...MOCK_TASKS]);
    return task;
  }
  const res = await fetch('/api/couple-space/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(input: UpdateTaskInput): Promise<SharedTask> {
  if (isMockMode()) {
    const now = new Date().toISOString();
    MOCK_TASKS = sortTasks(
      MOCK_TASKS.map((t) => (t.id === input.id ? { ...t, ...input, updatedAt: now } : t)),
    );
    return MOCK_TASKS.find((t) => t.id === input.id)!;
  }
  const { id, ...body } = input;
  const res = await fetch(`/api/couple-space/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  if (isMockMode()) {
    MOCK_TASKS = MOCK_TASKS.filter((t) => t.id !== id);
    return;
  }
  const res = await fetch(`/api/couple-space/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}

export async function toggleTask(id: string): Promise<SharedTask> {
  if (isMockMode()) {
    const now = new Date().toISOString();
    MOCK_TASKS = sortTasks(
      MOCK_TASKS.map((t) => (t.id === id ? { ...t, done: !t.done, updatedAt: now } : t)),
    );
    return MOCK_TASKS.find((t) => t.id === id)!;
  }
  const res = await fetch(`/api/couple-space/tasks/${id}/toggle`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle task');
  return res.json();
}
