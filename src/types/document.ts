export type DocumentCategory = 'CONTRACT' | 'RECEIPT' | 'OTHER';
export type DocumentStatus = 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ExtractedFields {
  contractDate?: string;
  totalAmount?: string;
  vendorName?: string;
  [key: string]: string | undefined;
}

export interface Document {
  id: string;
  fileName: string;
  category: DocumentCategory;
  status: DocumentStatus;
  thumbnailUrl: string;
  imageUrl: string;
  extractedText: string | null;
  extractedFields: ExtractedFields | null;
  createdAt: string;
}

export interface DocumentListResponse {
  content: Document[];
  totalElements: number;
  totalPages: number;
  number: number;   // 0-indexed current page
  size: number;
}

export const CATEGORY_LABEL: Record<DocumentCategory | 'ALL', string> = {
  ALL:      '전체',
  CONTRACT: '계약서',
  RECEIPT:  '영수증',
  OTHER:    '기타',
};

export const STATUS_LABEL: Record<DocumentStatus, string> = {
  UPLOADING:  '업로드 중',
  PROCESSING: '분석 중',
  COMPLETED:  '완료',
  FAILED:     '실패',
};
