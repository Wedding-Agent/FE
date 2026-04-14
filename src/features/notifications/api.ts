import { apiClient } from '@/lib/api-client';
import type { Notification, NotificationListResponse, UnreadCountResponse } from '@/types/notification';

function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

const now = () => new Date().toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

const MOCK_NOTIFICATIONS_COUPLE: Notification[] = [
  {
    notificationId: 'noti-1',
    sender: { senderId: 'planner-1', senderName: '김플래너' },
    category: 'CHAT',
    type: 'NEW_MESSAGE',
    content: '김플래너님이 새 메시지를 보냈어요: "네, 웨딩홀 일정 확인해드릴게요 😊"',
    targetPath: '/couple/chat/room-1',
    createdAt: minsAgo(5),
    isRead: false,
  },
  {
    notificationId: 'noti-2',
    sender: null,
    category: 'INVITATION',
    type: 'INVITATION_DONE',
    content: '청첩장이 완성됐어요! 지금 바로 확인해보세요 ✨',
    targetPath: '/couple/invitation/result',
    createdAt: minsAgo(30),
    isRead: false,
  },
  {
    notificationId: 'noti-3',
    sender: null,
    category: 'DOCUMENT',
    type: 'DOCUMENT_DONE',
    content: '"웨딩홀_계약서.jpg" 문서 분석이 완료됐어요. 추출된 정보를 확인해보세요.',
    targetPath: '/couple/documents/mock-1',
    createdAt: hoursAgo(1),
    isRead: false,
  },
  {
    notificationId: 'noti-4',
    sender: { senderId: 'vendor-1', senderName: '그랜드웨딩홀' },
    category: 'CHAT',
    type: 'NEW_MESSAGE',
    content: '그랜드웨딩홀에서 계약서 초안을 보냈어요.',
    targetPath: '/couple/chat/room-2',
    createdAt: hoursAgo(2),
    isRead: true,
  },
  {
    notificationId: 'noti-5',
    sender: null,
    category: 'SYSTEM',
    type: 'SYSTEM_NOTICE',
    content: 'Promise Marry에 오신 걸 환영해요! 웨딩 준비를 함께 시작해봐요 💕',
    targetPath: '/couple',
    createdAt: daysAgo(1),
    isRead: true,
  },
  {
    notificationId: 'noti-6',
    sender: null,
    category: 'DOCUMENT',
    type: 'DOCUMENT_FAILED',
    content: '"스튜디오_영수증.png" 문서 분석에 실패했어요. 다시 업로드해주세요.',
    targetPath: '/couple/documents',
    createdAt: daysAgo(2),
    isRead: true,
  },
  {
    notificationId: 'noti-7',
    sender: { senderId: 'vendor-2', senderName: '포토스튜디오A' },
    category: 'CHAT',
    type: 'NEW_MESSAGE',
    content: '포토스튜디오A: "사진 컨셉 어떻게 생각하세요?"',
    targetPath: '/couple/chat/room-3',
    createdAt: daysAgo(3),
    isRead: true,
  },
];

const MOCK_NOTIFICATIONS_PLANNER: Notification[] = [
  {
    notificationId: 'p-noti-1',
    sender: { senderId: 'customer-1', senderName: '김민수' },
    category: 'CHAT',
    type: 'NEW_MESSAGE',
    content: '김민수 고객님이 새 메시지를 보냈어요: "웨딩홀 투어 일정 확인해주실 수 있나요?"',
    targetPath: '/planner/chats/room-1',
    createdAt: minsAgo(3),
    isRead: false,
  },
  {
    notificationId: 'p-noti-2',
    sender: null,
    category: 'DOCUMENT',
    type: 'DOCUMENT_DONE',
    content: '"그랜드웨딩홀_계약서.pdf" 문서 분석이 완료됐어요. 추출된 정보를 확인해보세요.',
    targetPath: '/planner/contracts/mock-1',
    createdAt: minsAgo(20),
    isRead: false,
  },
  {
    notificationId: 'p-noti-3',
    sender: { senderId: 'customer-2', senderName: '박준혁' },
    category: 'CHAT',
    type: 'NEW_MESSAGE',
    content: '박준혁 고객님이 새 메시지를 보냈어요: "드레스샵 예약 날짜 변경 가능한가요?"',
    targetPath: '/planner/chats/room-2',
    createdAt: hoursAgo(1),
    isRead: false,
  },
  {
    notificationId: 'p-noti-4',
    sender: null,
    category: 'SYSTEM',
    type: 'SYSTEM_NOTICE',
    content: '이번 달 예약 고객 3명의 결혼식이 2개월 이내로 다가왔어요. 일정을 확인해보세요 📅',
    targetPath: '/planner/customers',
    createdAt: hoursAgo(3),
    isRead: true,
  },
  {
    notificationId: 'p-noti-5',
    sender: { senderId: 'vendor-1', senderName: '그랜드웨딩홀' },
    category: 'CHAT',
    type: 'NEW_MESSAGE',
    content: '그랜드웨딩홀에서 새 메시지를 보냈어요: "5월 예약 가능 일정 공유드립니다."',
    targetPath: '/planner/chats/room-3',
    createdAt: hoursAgo(5),
    isRead: true,
  },
  {
    notificationId: 'p-noti-6',
    sender: null,
    category: 'DOCUMENT',
    type: 'DOCUMENT_FAILED',
    content: '"로즈드레스_영수증.png" 문서 분석에 실패했어요. 다시 업로드해주세요.',
    targetPath: '/planner/contracts',
    createdAt: daysAgo(1),
    isRead: true,
  },
  {
    notificationId: 'p-noti-7',
    sender: null,
    category: 'SYSTEM',
    type: 'SYSTEM_NOTICE',
    content: 'Promise Marry 플래너 대시보드에 오신 걸 환영해요! 고객 관리를 시작해보세요 💼',
    targetPath: '/planner',
    createdAt: daysAgo(2),
    isRead: true,
  },
];

// 역할별 Mock 데이터 라우팅 (기본: couple)
function getMockNotifications(role?: string): Notification[] {
  return role === 'planner' ? MOCK_NOTIFICATIONS_PLANNER : MOCK_NOTIFICATIONS_COUPLE;
}

// 역할별 읽음 상태 관리
const readSets: Record<string, Set<string>> = {
  couple: new Set<string>(
    MOCK_NOTIFICATIONS_COUPLE.filter((n) => n.isRead).map((n) => n.notificationId),
  ),
  planner: new Set<string>(
    MOCK_NOTIFICATIONS_PLANNER.filter((n) => n.isRead).map((n) => n.notificationId),
  ),
};

export async function fetchNotifications(lastId?: string, role?: string): Promise<NotificationListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 250));
    const mockList = getMockNotifications(role);
    const rs = readSets[role ?? 'couple'] ?? readSets['couple'];
    const list = mockList.map((n) => ({
      ...n,
      isRead: rs.has(n.notificationId),
    }));
    return { notifications: list, hasNext: false };
  }

  const searchParams = new URLSearchParams({ size: '20' });
  if (lastId) searchParams.set('lastId', lastId);
  return apiClient.get('notifications', { searchParams }).json<NotificationListResponse>();
}

export async function fetchUnreadCount(role?: string): Promise<UnreadCountResponse> {
  if (isMockMode()) {
    const mockList = getMockNotifications(role);
    const rs = readSets[role ?? 'couple'] ?? readSets['couple'];
    const count = mockList.filter((n) => !rs.has(n.notificationId)).length;
    return { unreadCount: count };
  }
  return apiClient.get('notifications/unread').json<UnreadCountResponse>();
}

export async function markAllRead(role?: string): Promise<void> {
  if (isMockMode()) {
    const mockList = getMockNotifications(role);
    const rs = readSets[role ?? 'couple'] ?? readSets['couple'];
    mockList.forEach((n) => rs.add(n.notificationId));
    return;
  }
  await apiClient.patch('notifications/read-all');
}
