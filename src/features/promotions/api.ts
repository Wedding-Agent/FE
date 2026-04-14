import { apiClient } from '@/lib/api-client';
import type { Promotion, CreatePromotionInput, UpdatePromotionInput } from '@/types/promotions';

// ── Mock 감지 ────────────────────────────────────────────────────────────────
function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ── Mock 데이터 ──────────────────────────────────────────────────────────────
let MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    channel: 'INSTAGRAM',
    category: 'NEW_CUSTOMER',
    title: '봄 신규 고객 모집 인스타',
    content: `✨ 2026년 결혼을 준비 중이신가요?

Promise Marry 전문 플래너가 여러분의 특별한 날을 완벽하게 준비해드립니다.

✅ 전국 500+ 업체 네트워크
✅ 1:1 맞춤 웨딩 플래닝
✅ 투명한 견적 & 합리적인 비용

📞 무료 상담 신청 → 링크 클릭`,
    createdAt: '2026-04-01T10:00:00',
    updatedAt: '2026-04-01T10:00:00',
  },
  {
    id: 'promo-2',
    channel: 'KAKAO',
    category: 'SEASON_PROMO',
    title: '봄 시즌 카카오 프로모션',
    content: `🌸 봄 웨딩 시즌 한정 특가!

4~6월 예식 고객님께 드리는 특별 혜택

🎁 스드메 패키지 최대 20% 할인
🎁 웨딩홀 예약금 면제
🎁 전문 플래너 무료 동행 서비스

선착순 10쌍 한정! 지금 바로 상담 예약하세요.`,
    createdAt: '2026-04-05T14:00:00',
    updatedAt: '2026-04-05T14:00:00',
  },
  {
    id: 'promo-3',
    channel: 'BLOG',
    category: 'SERVICE_INTRO',
    title: '플래너 서비스 소개 블로그',
    content: `💍 Promise Marry 웨딩 플래닝 서비스

결혼 준비의 처음부터 끝까지 함께합니다.

📌 서비스 항목
• 웨딩홀 투어 & 예약 대행
• 드레스·예복·메이크업 조율
• 스냅·영상 촬영 연결
• 청첩장·답례품 기획
• 당일 현장 코디네이션

10년 경력 전문 플래너가 직접 담당합니다.`,
    createdAt: '2026-04-10T09:00:00',
    updatedAt: '2026-04-12T11:30:00',
  },
];

let promoIdCounter = 100;

// ── API 함수 ─────────────────────────────────────────────────────────────────

export async function fetchPromotions(): Promise<Promotion[]> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    return [...MOCK_PROMOTIONS].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }
  return apiClient.get('api/planner/promotions').json();
}

export async function createPromotion(payload: CreatePromotionInput): Promise<Promotion> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const now = new Date().toISOString();
    const promo: Promotion = {
      id: `promo-mock-${++promoIdCounter}`,
      ...payload,
      createdAt: now,
      updatedAt: now,
    };
    MOCK_PROMOTIONS = [promo, ...MOCK_PROMOTIONS];
    return promo;
  }
  return apiClient.post('api/planner/promotions', { json: payload }).json();
}

export async function updatePromotion(
  id: string,
  payload: UpdatePromotionInput,
): Promise<Promotion> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    let updated: Promotion | undefined;
    MOCK_PROMOTIONS = MOCK_PROMOTIONS.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, ...payload, updatedAt: new Date().toISOString() };
      return updated;
    });
    if (!updated) throw new Error(`Promotion ${id} not found`);
    return updated;
  }
  return apiClient.patch(`api/planner/promotions/${id}`, { json: payload }).json();
}

export async function deletePromotion(id: string): Promise<void> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 150));
    MOCK_PROMOTIONS = MOCK_PROMOTIONS.filter((p) => p.id !== id);
    return;
  }
  await apiClient.delete(`api/planner/promotions/${id}`);
}
