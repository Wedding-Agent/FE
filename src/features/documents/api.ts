import { apiClient } from '@/lib/api-client';
import type { Document, DocumentCategory, DocumentListResponse } from '@/types/document';

// TODO: BE 연동 시 mock 데이터 제거

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'mock-1',
    fileName: '웨딩홀_계약서.jpg',
    category: 'CONTRACT',
    status: 'COMPLETED',
    thumbnailUrl: '',
    imageUrl: '',
    extractedText: '계약서\n\n계약일: 2026년 4월 15일\n업체명: 그랜드웨딩홀\n총금액: 5,500,000원\n\n본 계약은 상기 당사자 간에 체결된 웨딩홀 이용 계약입니다.',
    extractedFields: {
      contractDate: '2026년 4월 15일',
      totalAmount: '5,500,000원',
      vendorName: '그랜드웨딩홀',
    },
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'mock-2',
    fileName: '스튜디오_영수증.png',
    category: 'RECEIPT',
    status: 'COMPLETED',
    thumbnailUrl: '',
    imageUrl: '',
    extractedText: '영수증\n\n결제일: 2026년 4월 8일\n업체: 포토스튜디오A\n결제금액: 800,000원\n품목: 웨딩 스냅 촬영',
    extractedFields: {
      contractDate: '2026년 4월 8일',
      totalAmount: '800,000원',
      vendorName: '포토스튜디오A',
    },
    createdAt: '2026-04-08T14:30:00Z',
  },
];

function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

export async function fetchDocuments(params?: {
  category?: DocumentCategory | 'ALL';
  page?: number;
  size?: number;
}): Promise<DocumentListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const filtered =
      !params?.category || params.category === 'ALL'
        ? MOCK_DOCUMENTS
        : MOCK_DOCUMENTS.filter((d) => d.category === params.category);
    return {
      content: filtered,
      totalElements: filtered.length,
      totalPages: 1,
      number: 0,
      size: filtered.length,
    };
  }

  const searchParams = new URLSearchParams();
  if (params?.category && params.category !== 'ALL') {
    searchParams.set('category', params.category);
  }
  searchParams.set('page', String(params?.page ?? 0));
  searchParams.set('size', String(params?.size ?? 20));

  return apiClient.get('ocr/documents', { searchParams }).json<DocumentListResponse>();
}

export async function fetchDocument(id: string): Promise<Document> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const doc = MOCK_DOCUMENTS.find((d) => d.id === id);
    if (!doc) throw new Error('문서를 찾을 수 없습니다.');
    return doc;
  }
  return apiClient.get(`ocr/documents/${id}`).json<Document>();
}

export async function uploadDocument(
  file: File,
  documentType?: DocumentCategory,
): Promise<Document> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 800));
    const newDoc: Document = {
      id: `mock-${Date.now()}`,
      fileName: file.name,
      category: documentType ?? 'OTHER',
      status: 'PROCESSING',
      thumbnailUrl: '',
      imageUrl: URL.createObjectURL(file),
      extractedText: null,
      extractedFields: null,
      createdAt: new Date().toISOString(),
    };
    MOCK_DOCUMENTS.unshift(newDoc);
    // 3초 후 COMPLETED로 전환 (mock 폴링 시뮬레이션)
    setTimeout(() => {
      const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === newDoc.id);
      if (idx !== -1) {
        MOCK_DOCUMENTS[idx] = {
          ...MOCK_DOCUMENTS[idx],
          status: 'COMPLETED',
          extractedText: `[OCR 결과]\n파일명: ${file.name}\n분류: ${documentType ?? 'OTHER'}\n\n텍스트 추출이 완료되었습니다.`,
          extractedFields: { vendorName: '(mock 데이터)' },
        };
      }
    }, 5000);
    return newDoc;
  }

  const body = new FormData();
  body.append('file', file);
  if (documentType) body.append('documentType', documentType);

  return apiClient.post('ocr/documents', { body }).json<Document>();
}

export async function deleteDocument(id: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === id);
    if (idx !== -1) MOCK_DOCUMENTS.splice(idx, 1);
    return;
  }
  await apiClient.delete(`ocr/documents/${id}`);
}
