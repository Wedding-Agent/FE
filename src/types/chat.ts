export type ChatRoomType = 'PRIVATE' | 'GROUP';
export type ChatMessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
export type ChatMessageStatus = 'SENDING' | 'SENT' | 'FAILED';

export interface ChatRoom {
  roomId: string;
  type: ChatRoomType;
  title: string;
  partnerRole?: 'couple' | 'planner' | 'vendor';
  lastMessageContent: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  isAlarmOn: boolean;
}

export interface ChatMessageSender {
  userId: string;
  nickname: string;
  role: 'couple' | 'planner' | 'vendor';
}

export interface ChatMessage {
  messageId: string;
  roomId: string;
  sender: ChatMessageSender | null;
  type: ChatMessageType;
  content: string | null;
  status?: ChatMessageStatus;
  createdAt: string;
  isSoftDeleted?: boolean;
}

export interface ChatRoomListResponse {
  rooms: ChatRoom[];
  hasNext: boolean;
  lastId?: string;
}

export interface ChatContact {
  userId: string;
  nickname: string;
  role: 'planner' | 'vendor';
  existingRoomId: string | null;
}

export interface ChatContactListResponse {
  contacts: ChatContact[];
  hasNext: boolean;
}

export interface ChatMessageListResponse {
  messages: ChatMessage[];
  hasNext: boolean;
  lastId?: string;
}
