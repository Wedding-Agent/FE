'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CommunityPost, CommunitySort, CommunityTag } from '@/types/community';
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  fetchPostDetail,
  fetchPosts,
  searchPosts,
  toggleLike,
} from './api';

export const communityKeys = {
  all:      () => ['community'] as const,
  lists:    () => ['community', 'list'] as const,
  list:     (sort: CommunitySort, tags: CommunityTag[]) =>
              ['community', 'list', sort, tags.join(',')] as const,
  detail:   (postId: string) => ['community', 'detail', postId] as const,
  search:   (keyword: string) => ['community', 'search', keyword] as const,
};

// ── List (infinite) ───────────────────────────────────────────────

export function usePostList(sort: CommunitySort, tags: CommunityTag[]) {
  return useInfiniteQuery({
    queryKey: communityKeys.list(sort, tags),
    queryFn: ({ pageParam }) =>
      fetchPosts({ sort, tags, lastId: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? last.lastId : undefined),
    staleTime: 30_000,
  });
}

// ── Detail ────────────────────────────────────────────────────────

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: communityKeys.detail(postId),
    queryFn: () => fetchPostDetail(postId),
    staleTime: 0,
  });
}

// ── Search (infinite) ────────────────────────────────────────────

export function usePostSearch(keyword: string) {
  return useInfiniteQuery({
    queryKey: communityKeys.search(keyword),
    queryFn: ({ pageParam }) =>
      searchPosts(keyword, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? last.lastId : undefined),
    enabled: keyword.trim().length >= 2,
    staleTime: 60_000,
  });
}

// ── Create post ───────────────────────────────────────────────────

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      title: string;
      content: string;
      tags: CommunityTag[];
    }) => createPost(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.lists() });
      toast.success('게시글이 등록되었습니다.');
    },
    onError: () => toast.error('게시글 등록에 실패했습니다.'),
  });
}

// ── Delete post ───────────────────────────────────────────────────

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.lists() });
      toast.success('게시글이 삭제되었습니다.');
    },
    onError: () => toast.error('삭제에 실패했습니다.'),
  });
}

// ── Like (optimistic) ─────────────────────────────────────────────

export function useToggleLike(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ liked }: { liked: boolean }) => toggleLike(postId, liked),
    onMutate: async ({ liked }) => {
      await qc.cancelQueries({ queryKey: communityKeys.detail(postId) });
      const snapshot = qc.getQueryData(communityKeys.detail(postId));
      qc.setQueryData(communityKeys.detail(postId), (old: ReturnType<typeof fetchPostDetail> | undefined) => {
        if (!old) return old;
        return old instanceof Promise
          ? old
          : {
              ...(old as Awaited<ReturnType<typeof fetchPostDetail>>),
              post: {
                ...(old as Awaited<ReturnType<typeof fetchPostDetail>>).post,
                isLiked: liked,
                likeCount:
                  (old as Awaited<ReturnType<typeof fetchPostDetail>>).post.likeCount +
                  (liked ? 1 : -1),
              },
            };
      });
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(communityKeys.detail(postId), ctx.snapshot);
      toast.error('좋아요 처리에 실패했습니다.');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.detail(postId) });
    },
  });
}

// ── Add comment ───────────────────────────────────────────────────

export function useAddComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addComment(postId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.detail(postId) });
    },
    onError: () => toast.error('댓글 등록에 실패했습니다.'),
  });
}

// ── Delete comment ────────────────────────────────────────────────

export function useDeleteComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(postId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: communityKeys.detail(postId) });
      toast.success('댓글이 삭제되었습니다.');
    },
    onError: () => toast.error('댓글 삭제에 실패했습니다.'),
  });
}
