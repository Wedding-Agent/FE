export type NotificationType =
  | 'NEW_MESSAGE'
  | 'NEW_COMMENT'
  | 'NEW_REPLY'
  | 'NEW_FOLLOWER'
  | 'POST_LIKE'
  | 'ROOM_INVITE'
  | 'SYSTEM'

export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  relatedId?: number | null
  relatedType?: string | null
  createdAt: string
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  NEW_MESSAGE: '새 메시지',
  NEW_COMMENT: '새 댓글',
  NEW_REPLY: '새 답글',
  NEW_FOLLOWER: '새 팔로워',
  POST_LIKE: '게시글 좋아요',
  ROOM_INVITE: '채팅방 초대',
  SYSTEM: '시스템',
}
