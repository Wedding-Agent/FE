// ── Channel & Category Types ──────────────────────────────────────────────────

export type PromotionChannel =
  | 'INSTAGRAM'   // 인스타그램
  | 'KAKAO'       // 카카오톡 채널
  | 'BLOG'        // 네이버·티스토리 블로그
  | 'WEBSITE'     // 홈페이지
  | 'FLYER'       // 전단지·현수막
  | 'CUSTOM';     // 직접 입력

export type PromotionCategory =
  | 'NEW_CUSTOMER'    // 신규 고객 모집
  | 'SEASON_PROMO'    // 시즌 프로모션
  | 'EVENT'           // 특가 이벤트
  | 'SERVICE_INTRO'   // 서비스 소개
  | 'REVIEW'          // 후기 홍보
  | 'CUSTOM';         // 자유 작성

export const PROMOTION_CHANNEL_LABEL: Record<PromotionChannel, string> = {
  INSTAGRAM:  '인스타그램',
  KAKAO:      '카카오톡',
  BLOG:       '블로그',
  WEBSITE:    '홈페이지',
  FLYER:      '전단지',
  CUSTOM:     '기타',
};

export const PROMOTION_CHANNEL_EMOJI: Record<PromotionChannel, string> = {
  INSTAGRAM:  '📸',
  KAKAO:      '💬',
  BLOG:       '✍️',
  WEBSITE:    '🌐',
  FLYER:      '📄',
  CUSTOM:     '📌',
};

export const PROMOTION_CATEGORY_LABEL: Record<PromotionCategory, string> = {
  NEW_CUSTOMER:   '신규 고객 모집',
  SEASON_PROMO:   '시즌 프로모션',
  EVENT:          '특가 이벤트',
  SERVICE_INTRO:  '서비스 소개',
  REVIEW:         '후기 홍보',
  CUSTOM:         '자유 작성',
};

export const ALL_PROMOTION_CHANNELS: PromotionChannel[] = [
  'INSTAGRAM', 'KAKAO', 'BLOG', 'WEBSITE', 'FLYER', 'CUSTOM',
];

export const ALL_PROMOTION_CATEGORIES: PromotionCategory[] = [
  'NEW_CUSTOMER', 'SEASON_PROMO', 'EVENT', 'SERVICE_INTRO', 'REVIEW', 'CUSTOM',
];

/** 선택 시 textarea에 자동 채워지는 기본 문구 템플릿 */
export const PROMOTION_TEMPLATES: Record<PromotionCategory, string> = {
  NEW_CUSTOMER: `✨ 2026년 결혼을 준비 중이신가요?

Promise Marry 전문 플래너가 여러분의 특별한 날을 완벽하게 준비해드립니다.

✅ 전국 500+ 업체 네트워크
✅ 1:1 맞춤 웨딩 플래닝
✅ 투명한 견적 & 합리적인 비용

📞 무료 상담 신청 → 링크 클릭`,

  SEASON_PROMO: `🌸 봄 웨딩 시즌 한정 특가!

4~6월 예식 고객님께 드리는 특별 혜택

🎁 스드메 패키지 최대 20% 할인
🎁 웨딩홀 예약금 면제
🎁 전문 플래너 무료 동행 서비스

선착순 10쌍 한정! 지금 바로 상담 예약하세요.`,

  EVENT: `🎉 창립 3주년 감사 이벤트

지금 상담 신청하시면 추첨을 통해
✨ 1등: 허니문 패키지권 (200만원 상당)
✨ 2등: 스냅 촬영권 (50만원 상당)
✨ 3등: 웨딩 케이크 무료 제공

이벤트 기간: ~2026년 4월 30일`,

  SERVICE_INTRO: `💍 Promise Marry 웨딩 플래닝 서비스

결혼 준비의 처음부터 끝까지 함께합니다.

📌 서비스 항목
• 웨딩홀 투어 & 예약 대행
• 드레스·예복·메이크업 조율
• 스냅·영상 촬영 연결
• 청첩장·답례품 기획
• 당일 현장 코디네이션

10년 경력 전문 플래너가 직접 담당합니다.`,

  REVIEW: `💌 실제 고객님의 생생한 후기

"덕분에 정말 꿈같은 결혼식이었어요! 아무것도 몰랐는데 처음부터 끝까지 다 챙겨주셔서 너무 감사했습니다. 다음에 동생 결혼할 때도 꼭 부탁드릴게요." — 2026년 3월 신부 ⭐⭐⭐⭐⭐

소중한 후기를 남겨주신 고객님께 감사드립니다 💕`,

  CUSTOM: '',
};

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface Promotion {
  id: string;
  channel: PromotionChannel;
  category: PromotionCategory;
  title: string;       // 제목 (내부 관리용)
  content: string;     // 홍보 문구 본문
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionInput {
  channel: PromotionChannel;
  category: PromotionCategory;
  title: string;
  content: string;
}

export type UpdatePromotionInput = Partial<CreatePromotionInput>;
