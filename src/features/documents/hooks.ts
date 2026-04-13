'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { DocumentCategory } from '@/types/document';
import { deleteDocument, fetchDocument, fetchDocuments, uploadDocument } from './api';

export const documentKeys = {
  all:    ()          => ['documents'] as const,
  list:   (cat?: string) => ['documents', 'list', cat ?? 'ALL'] as const,
  detail: (id: string)   => ['documents', 'detail', id] as const,
};

export function useDocuments(category?: DocumentCategory | 'ALL') {
  const cat = category ?? 'ALL';
  return useQuery({
    queryKey: documentKeys.list(cat),
    queryFn: () => fetchDocuments({ category: cat }),
    staleTime: 30_000,
  });
}

export function useDocumentsPolling(hasProcessing: boolean) {
  const cat = 'ALL';
  return useQuery({
    queryKey: [...documentKeys.list(cat), 'poll'],
    queryFn: () => fetchDocuments({ category: 'ALL' }),
    enabled: hasProcessing,
    refetchInterval: hasProcessing ? 3000 : false,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => fetchDocument(id),
    staleTime: 0,
  });
}

export function useDocumentPolling(id: string, isProcessing: boolean) {
  return useQuery({
    queryKey: [...documentKeys.detail(id), 'poll'],
    queryFn: () => fetchDocument(id),
    enabled: isProcessing,
    refetchInterval: isProcessing ? 3000 : false,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, documentType }: { file: File; documentType?: DocumentCategory }) =>
      uploadDocument(file, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all() });
      toast.success('문서가 업로드되었습니다. AI가 분석을 시작합니다.');
    },
    onError: () => {
      toast.error('문서 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: documentKeys.all() });
      const snapshot = queryClient.getQueriesData({ queryKey: documentKeys.all() });
      // 낙관적 업데이트: 캐시에서 즉시 제거
      queryClient.setQueriesData({ queryKey: documentKeys.all() }, (old: unknown) => {
        if (old && typeof old === 'object' && 'content' in old) {
          const resp = old as { content: { id: string }[] };
          return { ...resp, content: resp.content.filter((d) => d.id !== id) };
        }
        return old;
      });
      return { snapshot };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.snapshot) {
        ctx.snapshot.forEach(([key, val]) => queryClient.setQueryData(key, val));
      }
      toast.error('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all() });
      toast.success('문서가 삭제되었습니다.');
    },
  });
}
