import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, fetchTasks, toggleTask, updateTask } from './api';
import type { CreateTaskInput, SharedTask, UpdateTaskInput } from '@/types/couple-space';
import { PRIORITY_ORDER } from '@/types/couple-space';

// ── Query Keys ───────────────────────────────────────────────────────────────
export const coupleSpaceKeys = {
  all:   () => ['couple-space'] as const,
  tasks: () => ['couple-space', 'tasks'] as const,
};

// ── 낙관적 업데이트용 re-sort ─────────────────────────────────────────────────
function sortOptimistic(tasks: SharedTask[]): SharedTask[] {
  const byPriority = (a: SharedTask, b: SharedTask) =>
    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  return [
    ...tasks.filter((t) => !t.done).sort(byPriority),
    ...tasks.filter((t) =>  t.done).sort(byPriority),
  ];
}

// ── Query ─────────────────────────────────────────────────────────────────────

export function useSharedTasks() {
  return useQuery({
    queryKey: coupleSpaceKeys.tasks(),
    queryFn:  fetchTasks,
    staleTime: 300_000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: coupleSpaceKeys.tasks() });
      const prev = qc.getQueryData<SharedTask[]>(coupleSpaceKeys.tasks());
      const optimistic: SharedTask = {
        ...input,
        id:        `optimistic-${Date.now()}`,
        done:      false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      qc.setQueryData<SharedTask[]>(
        coupleSpaceKeys.tasks(),
        (old) => sortOptimistic([optimistic, ...(old ?? [])]),
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(coupleSpaceKeys.tasks(), ctx.prev);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: coupleSpaceKeys.all() }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTaskInput) => updateTask(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: coupleSpaceKeys.tasks() });
      const prev = qc.getQueryData<SharedTask[]>(coupleSpaceKeys.tasks());
      qc.setQueryData<SharedTask[]>(
        coupleSpaceKeys.tasks(),
        (old) =>
          sortOptimistic(
            (old ?? []).map((t) =>
              t.id === input.id ? { ...t, ...input, updatedAt: new Date().toISOString() } : t,
            ),
          ),
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(coupleSpaceKeys.tasks(), ctx.prev);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: coupleSpaceKeys.all() }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: coupleSpaceKeys.tasks() });
      const prev = qc.getQueryData<SharedTask[]>(coupleSpaceKeys.tasks());
      qc.setQueryData<SharedTask[]>(
        coupleSpaceKeys.tasks(),
        (old) => (old ?? []).filter((t) => t.id !== id),
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(coupleSpaceKeys.tasks(), ctx.prev);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: coupleSpaceKeys.all() }),
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: coupleSpaceKeys.tasks() });
      const prev = qc.getQueryData<SharedTask[]>(coupleSpaceKeys.tasks());
      qc.setQueryData<SharedTask[]>(
        coupleSpaceKeys.tasks(),
        (old) =>
          sortOptimistic(
            (old ?? []).map((t) =>
              t.id === id ? { ...t, done: !t.done, updatedAt: new Date().toISOString() } : t,
            ),
          ),
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(coupleSpaceKeys.tasks(), ctx.prev);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: coupleSpaceKeys.all() }),
  });
}
