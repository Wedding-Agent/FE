import { apiClient } from '@/lib/api-client';
import type {
  ChatContact,
  ChatContactListResponse,
  ChatMessage,
  ChatMessageListResponse,
  ChatRoom,
  ChatRoomListResponse,
} from '@/types/chat';

// TODO: BE 연동 시 mock 제거
function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

const MOCK_MY_ID = 'user-1';
const MOCK_MY_NICKNAME = '테스트커플';

const MOCK_ROOMS: ChatRoom[] = [
  {
    roomId: 'room-1',
    type: 'PRIVATE',
    title: '김플래너',
    partnerRole: 'planner',
    lastMessageContent: '네, 말씀하신 웨딩홀 일정 확인해드릴게요 😊',
    lastMessageAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    unreadCount: 2,
    isAlarmOn: true,
  },
  {
    roomId: 'room-2',
    type: 'PRIVATE',
    title: '그랜드웨딩홀',
    partnerRole: 'vendor',
    lastMessageContent: '계약서 초안 보내드렸습니다.',
    lastMessageAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    unreadCount: 0,
    isAlarmOn: true,
  },
  {
    roomId: 'room-3',
    type: 'PRIVATE',
    title: '포토스튜디오A',
    partnerRole: 'vendor',
    lastMessageContent: '사진 컨셉 어떻게 생각하세요?',
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
    unreadCount: 0,
    isAlarmOn: false,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'room-1': [
    {
      messageId: 'msg-1',
      roomId: 'room-1',
      sender: { userId: 'planner-1', nickname: '김플래너', role: 'planner' },
      type: 'TEXT',
      content: '안녕하세요! 웨딩 플래너 김지수입니다. 어떻게 도와드릴까요?',
      createdAt: new Date(Date.now() - 30 * 60_000).toISOString(),
    },
    {
      messageId: 'msg-2',
      roomId: 'room-1',
      sender: { userId: MOCK_MY_ID, nickname: MOCK_MY_NICKNAME, role: 'couple' },
      type: 'TEXT',
      content: '안녕하세요! 웨딩홀 예약 관련해서 문의드리고 싶어요.',
      createdAt: new Date(Date.now() - 20 * 60_000).toISOString(),
    },
    {
      messageId: 'msg-3',
      roomId: 'room-1',
      sender: { userId: 'planner-1', nickname: '김플래너', role: 'planner' },
      type: 'TEXT',
      content: '네, 말씀하신 웨딩홀 일정 확인해드릴게요 😊',
      createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    },
  ],
  'room-2': [
    {
      messageId: 'msg-4',
      roomId: 'room-2',
      sender: { userId: 'vendor-1', nickname: '그랜드웨딩홀', role: 'vendor' },
      type: 'TEXT',
      content: '안녕하세요. 그랜드웨딩홀입니다.',
      createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
    },
    {
      messageId: 'msg-5',
      roomId: 'room-2',
      sender: { userId: 'vendor-1', nickname: '그랜드웨딩홀', role: 'vendor' },
      type: 'TEXT',
      content: '계약서 초안 보내드렸습니다.',
      createdAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    },
  ],
  'room-3': [
    {
      messageId: 'msg-6',
      roomId: 'room-3',
      sender: { userId: 'vendor-2', nickname: '포토스튜디오A', role: 'vendor' },
      type: 'TEXT',
      content: '사진 컨셉 어떻게 생각하세요?',
      createdAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
    },
  ],
};

export function getMyUserId(): string {
  if (isMockMode()) return MOCK_MY_ID;
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return '';
    const parsed = JSON.parse(raw) as { state?: { user?: { id?: string } } };
    return parsed?.state?.user?.id ?? '';
  } catch {
    return '';
  }
}

export async function fetchChatRooms(): Promise<ChatRoomListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    return { rooms: [...MOCK_ROOMS], hasNext: false };
  }
  return apiClient.get('chat/rooms').json<ChatRoomListResponse>();
}

export async function fetchChatMessages(
  roomId: string,
  lastId?: string,
): Promise<ChatMessageListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    const msgs = MOCK_MESSAGES[roomId] ?? [];
    return { messages: msgs, hasNext: false };
  }
  const searchParams = new URLSearchParams({ size: '20' });
  if (lastId) searchParams.set('lastId', lastId);
  return apiClient
    .get(`chat/rooms/${roomId}/messages`, { searchParams })
    .json<ChatMessageListResponse>();
}

export async function sendMessage(roomId: string, content: string): Promise<ChatMessage> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 100));
    const newMsg: ChatMessage = {
      messageId: `msg-${Date.now()}`,
      roomId,
      sender: { userId: MOCK_MY_ID, nickname: MOCK_MY_NICKNAME, role: 'couple' },
      type: 'TEXT',
      content,
      createdAt: new Date().toISOString(),
    };
    if (!MOCK_MESSAGES[roomId]) MOCK_MESSAGES[roomId] = [];
    MOCK_MESSAGES[roomId].push(newMsg);
    const room = MOCK_ROOMS.find((r) => r.roomId === roomId);
    if (room) {
      room.lastMessageContent = content;
      room.lastMessageAt = newMsg.createdAt;
    }
    return newMsg;
  }
  return apiClient.post(`chat/rooms/${roomId}/messages`, { json: { content } }).json<ChatMessage>();
}

export async function patchLastRead(roomId: string): Promise<void> {
  if (isMockMode()) {
    const room = MOCK_ROOMS.find((r) => r.roomId === roomId);
    if (room) room.unreadCount = 0;
    return;
  }
  await apiClient.patch(`chat/rooms/${roomId}/last-read`);
}

// ── 연락처 목록 (새 대화 상대 검색용) ──────────────────────────

const MOCK_CONTACTS: ChatContact[] = [
  { userId: 'planner-1', nickname: '김지수 플래너', role: 'planner', existingRoomId: 'room-1' },
  { userId: 'planner-2', nickname: '박소연 플래너', role: 'planner', existingRoomId: null },
  { userId: 'vendor-1',  nickname: '그랜드웨딩홀', role: 'vendor',  existingRoomId: 'room-2' },
  { userId: 'vendor-2',  nickname: '포토스튜디오A', role: 'vendor',  existingRoomId: 'room-3' },
  { userId: 'vendor-3',  nickname: '드레스하우스B', role: 'vendor',  existingRoomId: null },
  { userId: 'vendor-4',  nickname: '메이크업아티스트C', role: 'vendor', existingRoomId: null },
];

export async function fetchContacts(query?: string): Promise<ChatContactListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const filtered = query
      ? MOCK_CONTACTS.filter((c) => c.nickname.includes(query))
      : MOCK_CONTACTS;
    return { contacts: filtered, hasNext: false };
  }
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('q', query);
  return apiClient.get('chat/contacts', { searchParams }).json<ChatContactListResponse>();
}

export async function createChatRoom(targetUserId: string): Promise<{ roomId: string }> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 400));
    // 기존 채팅방이 있으면 해당 roomId 반환
    const contact = MOCK_CONTACTS.find((c) => c.userId === targetUserId);
    if (contact?.existingRoomId) return { roomId: contact.existingRoomId };
    // 없으면 새 방 생성
    const newRoomId = `room-${Date.now()}`;
    const newRoom: ChatRoom = {
      roomId: newRoomId,
      type: 'PRIVATE',
      title: contact?.nickname ?? '새 대화',
      partnerRole: contact?.role ?? 'vendor',
      lastMessageContent: null,
      lastMessageAt: null,
      unreadCount: 0,
      isAlarmOn: true,
    };
    MOCK_ROOMS.unshift(newRoom);
    if (contact) contact.existingRoomId = newRoomId;
    return { roomId: newRoomId };
  }
  return apiClient
    .post('chat/rooms', { json: { targetUserId } })
    .json<{ roomId: string }>();
}
