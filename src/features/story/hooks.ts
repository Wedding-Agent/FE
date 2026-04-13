import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createStory,
  deleteStory,
  fetchStories,
  toggleLike,
  updateStory,
} from './api';
import type { CreateStoryInput, StoryEntry, StoryMilestone, UpdateStoryInput } from '@/types/story';

// ── Query Keys ───────────────────────────────────────────────────────────────
export const storyKeys = {
  all:  ()                              => ['story'] as const,
  list: (m: StoryMilestone | null)      => ['story', 'list', m] as const,
};

// ── Query ─────────────────────────────────────────────────────────────────────

export function useStories(milestone: StoryMilestone | null) {
  return useQuery({
    queryKey: storyKeys.list(milestone),
    queryFn:  () => fetchStories(milestone),
    staleTime: 300_000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateStory(currentMilestone: StoryMilestone | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStoryInput) => createStory(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: storyKeys.list(currentMilestone) });
      const prev = qc.getQueryData<StoryEntry[]>(storyKeys.list(currentMilestone));
      const optimistic: StoryEntry = {
        ...input,
        id:        `optimistic-${Date.now()}`,
        liked:     false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      qc.setQueryData<StoryEntry[]>(
        storyKeys.list(currentMilestone),
        (old) => [optimistic, ...(old ?? [])],
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(storyKeys.list(currentMilestone), ctx.prev);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: storyKeys.all() }),
  });
}

export function useUpdateStory(currentMilestone: StoryMilestone | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStoryInput) => updateStory(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: storyKeys.list(currentMilestone) });
      const prev = qc.getQueryData<StoryEntry[]>(storyKeys.list(currentMilestone));
      qc.setQueryData<StoryEntry[]>(
        storyKeys.list(currentMilestone),
        (old) =>
          (old ?? []).map((e) =>
            e.id === input.id
              ? { ...e, ...input, updatedAt: new Date().toISOString() }
              : e,
          ),
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(storyKeys.list(currentMilestone), ctx.prev);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: storyKeys.all() }),
  });
}

export function useDeleteStory(currentMilestone: StoryMilestone | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStory(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: storyKeys.list(currentMilestone) });
      const prev = qc.getQueryData<StoryEntry[]>(storyKeys.list(currentMilestone));
      qc.setQueryData<StoryEntry[]>(
        storyKeys.list(currentMilestone),
        (old) => (old ?? []).filter((e) => e.id !== id),
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(storyKeys.list(currentMilestone), ctx.prev);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: storyKeys.all() }),
  });
}

export function useToggleLike(currentMilestone: StoryMilestone | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleLike(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: storyKeys.list(currentMilestone) });
      const prev = qc.getQueryData<StoryEntry[]>(storyKeys.list(currentMilestone));
      qc.setQueryData<StoryEntry[]>(
        storyKeys.list(currentMilestone),
        (old) =>
          (old ?? []).map((e) => (e.id === id ? { ...e, liked: !e.liked } : e)),
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev !== undefined)
        qc.setQueryData(storyKeys.list(currentMilestone), ctx.prev);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: storyKeys.all() }),
  });
}
