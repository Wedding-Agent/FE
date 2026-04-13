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

const MOCK_NOTIFICATIONS: Notification[] = [
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

// mock 읽음 상태 (페이지 방문 시 업데이트)
const readSet = new Set<string>(
  MOCK_NOTIFICATIONS.filter((n) => n.isRead).map((n) => n.notificationId),
);

export async function fetchNotifications(lastId?: string): Promise<NotificationListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 250));
    const list = MOCK_NOTIFICATIONS.map((n) => ({
      ...n,
      isRead: readSet.has(n.notificationId),
    }));
    return { notifications: list, hasNext: false };
  }

  const searchParams = new URLSearchParams({ size: '20' });
  if (lastId) searchParams.set('lastId', lastId);
  return apiClient.get('notifications', { searchParams }).json<NotificationListResponse>();
}

export async function fetchUnreadCount(): Promise<UnreadCountResponse> {
  if (isMockMode()) {
    const count = MOCK_NOTIFICATIONS.filter((n) => !readSet.has(n.notificationId)).length;
    return { unreadCount: count };
  }
  return apiClient.get('notifications/unread').json<UnreadCountResponse>();
}

export async function markAllRead(): Promise<void> {
  if (isMockMode()) {
    MOCK_NOTIFICATIONS.forEach((n) => readSet.add(n.notificationId));
    return;
  }
  await apiClient.patch('notifications/read-all');
}
