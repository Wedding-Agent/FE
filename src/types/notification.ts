/** 알림 카테고리 */
export type NotificationCategory =
  | 'CHAT'        // 새 채팅 메시지
  | 'INVITATION'  // 청첩장 생성 완료
  | 'DOCUMENT'    // 문서 OCR 완료
  | 'SYSTEM';     // 시스템 알림

/** 알림 세부 타입 */
export type NotificationType =
  | 'NEW_MESSAGE'        // 새 채팅 메시지
  | 'INVITATION_DONE'    // 청첩장 생성 완료
  | 'INVITATION_FAILED'  // 청첩장 생성 실패
  | 'DOCUMENT_DONE'      // 문서 분석 완료
  | 'DOCUMENT_FAILED'    // 문서 분석 실패
  | 'SYSTEM_NOTICE';     // 공지

export interface NotificationSender {
  senderId: string;
  senderName: string;
}

export interface Notification {
  notificationId: string;
  sender: NotificationSender | null;
  category: NotificationCategory;
  type: NotificationType;
  content: string;
  /** 클릭 시 이동할 프론트 경로 */
  targetPath: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationListResponse {
  notifications: Notification[];
  hasNext: boolean;
  lastId?: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
