import { apiClient } from '@/lib/api-client';
import type {
  Vendor,
  VendorDetailResponse,
  VendorFilter,
  VendorListResponse,
  VendorReview,
  VendorSort,
} from '@/types/vendor';

// ── Mock 감지 ────────────────────────────────────────────────────────────────
function isMockMode(): boolean {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return base === '' || base.includes('mock');
}

// ── Mock 업체 데이터 (10개) ───────────────────────────────────────────────────
const MOCK_VENDORS: Vendor[] = [
  {
    vendor_id: 1, name: '그랜드 힐튼 웨딩', category: 'venue',
    region: '강남', style: '럭셔리', capacity: 300,
    price_range: '50M-70M', price_min: 50_000_000,
    rating: 4.8, reviews_count: 45,
    tags: ['4성급 호텔', '발렛파킹', '야경 포함', '허니문 패키지'],
    trustScore: 0.92, hasRainyPlan: true,
    recommendation: {
      rank: 1, score: 0.92,
      reason: '강남 최고급 호텔 웨딩홀로, 현대적인 인테리어와 세련된 서비스가 예비부부의 럭셔리한 결혼식을 완성해드립니다. 최근 6개월 리뷰에서 스태프 친절도가 특히 높은 평가를 받고 있어요.',
    },
    summary: {
      pros: '넓은 홀과 자연채광, 친절하고 전문적인 스태프, 음식 퀄리티 최고',
      cons: '주차 공간이 협소해 발렛 이용 권장, 가격대가 높은 편',
      caution: '피크 시즌(5~6월, 10~11월)은 12개월 전 예약 필수',
    },
  },
  {
    vendor_id: 2, name: '마포 리버사이드홀', category: 'venue',
    region: '마포', style: '모던', capacity: 180,
    price_range: '30M-45M', price_min: 30_000_000,
    rating: 4.5, reviews_count: 32,
    tags: ['한강뷰', '야외 테라스', '소규모 가능', '주차 완비'],
    trustScore: 0.78, hasRainyPlan: true,
    recommendation: {
      rank: 2, score: 0.78,
      reason: '한강 전망을 배경으로 한 로맨틱한 웨딩홀입니다. 야외 테라스에서의 스냅 촬영이 특히 인기 있으며, 중소규모 결혼식에 최적화된 공간 구성이 장점입니다.',
    },
    summary: {
      pros: '한강 뷰 야외 테라스, 적당한 규모, 접근성 우수(지하철 5분)',
      cons: '야외 행사는 날씨 영향, 홀 내부 인테리어 다소 단순',
      caution: '우천 플랜 보유하나 실내 수용 인원 150명으로 제한됨',
    },
  },
  {
    vendor_id: 3, name: '압구정 스튜디오 라', category: 'studio',
    region: '압구정', style: '클래식', capacity: 0,
    price_range: '3M-5M', price_min: 3_000_000,
    rating: 4.9, reviews_count: 128,
    tags: ['자연광 스튜디오', '드레스 협력', '셀렉 무제한', '당일 보정'],
    trustScore: 0.95, hasRainyPlan: false,
    recommendation: {
      rank: 1, score: 0.95,
      reason: '압구정 최정상 웨딩 스튜디오로, 자연광을 최대한 활용한 클래식하고 고급스러운 사진이 특기입니다. 128개 리뷰 모두 긍정적 반응으로 업계 최고 신뢰도를 자랑합니다.',
    },
    summary: {
      pros: '자연광 활용 최고 수준, 친절한 디렉터, 무제한 셀렉 가능',
      cons: '예약 대기 2~3개월 필요, 가격이 평균보다 높음',
      caution: '드레스는 협력 업체 이용 시 할인 적용, 메이크업 아티스트 별도 예약 필요',
    },
  },
  {
    vendor_id: 4, name: '홍대 무드 스튜디오', category: 'studio',
    region: '홍대', style: '모던', capacity: 0,
    price_range: '2M-3.5M', price_min: 2_000_000,
    rating: 4.6, reviews_count: 87,
    tags: ['빈티지 소품', '필름 감성', '야외 촬영 포함', '2인 디렉터'],
    trustScore: 0.82, hasRainyPlan: false,
    recommendation: {
      rank: 2, score: 0.82,
      reason: '홍대의 감성적인 분위기를 살린 필름 스타일 웨딩 사진이 트렌디한 커플에게 인기입니다. 합리적인 가격 대비 퀄리티가 우수해 가성비 최고 스튜디오로 꼽힙니다.',
    },
    summary: {
      pros: '필름 감성 사진 퀄리티 우수, 합리적 가격, 야외 촬영 포함',
      cons: '좁은 스튜디오 공간, 복잡한 홍대 교통',
      caution: '야외 촬영은 날씨에 따라 일정 변경 가능',
    },
  },
  {
    vendor_id: 5, name: '서초 자연 스냅', category: 'studio',
    region: '서초', style: '자연', capacity: 0,
    price_range: '1.5M-2.5M', price_min: 1_500_000,
    rating: 4.7, reviews_count: 63,
    tags: ['야외 전문', '우천 대비 실내 대안', '자연 배경', '경량 장비'],
    trustScore: 0.86, hasRainyPlan: true,
    recommendation: {
      rank: 3, score: 0.86,
      reason: '서초 인근 공원과 자연을 배경으로 한 야외 스냅 사진 전문 스튜디오입니다. 가장 자연스러운 커플의 모습을 담아내는 것으로 유명하며, 우천 시 대안 장소도 준비되어 있습니다.',
    },
    summary: {
      pros: '자연스러운 야외 사진, 합리적 가격, 우천 대비 실내 공간 보유',
      cons: '계절 날씨 의존도 높음, 실내 스튜디오 시설 미흡',
      caution: '봄·가을 시즌 예약이 집중되므로 2개월 전 예약 권장',
    },
  },
  {
    vendor_id: 6, name: '청담 브라이덜 하우스', category: 'dress',
    region: '청담', style: '럭셔리', capacity: 0,
    price_range: '3M-6M', price_min: 3_000_000,
    rating: 4.8, reviews_count: 56,
    tags: ['수입 드레스', '1:1 스타일리스트', 'VIP 피팅룸', '부케 포함'],
    trustScore: 0.88, hasRainyPlan: false,
    recommendation: {
      rank: 1, score: 0.88,
      reason: '청담동 럭셔리 웨딩드레스 전문점으로, 유럽 수입 드레스를 포함한 500여 벌의 컬렉션을 보유합니다. 1:1 전담 스타일리스트가 신부의 체형과 분위기에 맞는 최적의 드레스를 추천합니다.',
    },
    summary: {
      pros: '수입 드레스 다양, 1:1 스타일리스트 서비스, 청담 최고급 시설',
      cons: '가격대 높음, 예약 없이 방문 불가',
      caution: '드레스 수선은 별도 비용 발생, 최소 3회 피팅 권장',
    },
  },
  {
    vendor_id: 7, name: '강남 화이트 드레스', category: 'dress',
    region: '강남', style: '모던', capacity: 0,
    price_range: '1.5M-3M', price_min: 1_500_000,
    rating: 4.4, reviews_count: 41,
    tags: ['국내 디자이너', '맞춤 제작 가능', '합리적 가격', '온라인 예약'],
    trustScore: 0.71, hasRainyPlan: false,
    recommendation: {
      rank: 2, score: 0.71,
      reason: '합리적인 가격으로 트렌디한 모던 웨딩드레스를 제공합니다. 국내 신진 디자이너 작품을 중심으로 독특한 스타일을 원하는 신부에게 적합합니다.',
    },
    summary: {
      pros: '합리적 가격, 국내 디자이너 다양, 맞춤 제작 가능',
      cons: '수입 드레스 선택 폭 제한, 피팅룸 공간 협소',
      caution: '맞춤 제작 시 최소 3개월 여유 필요',
    },
  },
  {
    vendor_id: 8, name: '신촌 글로우 메이크업', category: 'makeup',
    region: '신촌', style: '자연', capacity: 0,
    price_range: '0.6M-1.2M', price_min: 600_000,
    rating: 4.7, reviews_count: 93,
    tags: ['자연 메이크업', '피부 관리 포함', '출장 서비스', '남자 메이크업'],
    trustScore: 0.85, hasRainyPlan: false,
    recommendation: {
      rank: 1, score: 0.85,
      reason: '자연스럽고 화사한 웨딩 메이크업이 특기로, 신부의 본연의 아름다움을 최대한 살리는 기술이 높은 만족도로 이어지고 있습니다. 남자 신랑 메이크업도 가능합니다.',
    },
    summary: {
      pros: '자연스러운 메이크업, 꼼꼼한 피부 케어 포함, 출장 서비스 가능',
      cons: '예약 꽉 찬 주말 일정은 3개월 전부터 예약 필요',
      caution: '알레르기 있는 경우 사전 상담 필수',
    },
  },
  {
    vendor_id: 9, name: '강남 럭스 메이크업', category: 'makeup',
    region: '강남', style: '럭셔리', capacity: 0,
    price_range: '0.8M-1.5M', price_min: 800_000,
    rating: 4.6, reviews_count: 74,
    tags: ['글로우 메이크업', '헤어 포함', '리허설 포함', '장시간 유지'],
    trustScore: 0.80, hasRainyPlan: false,
    recommendation: {
      rank: 2, score: 0.80,
      reason: '강남 프리미엄 헤어·메이크업 전문 살롱으로, 리허설 메이크업을 통해 당일 완벽한 모습을 미리 확인할 수 있습니다. 글로우 피니시 트렌드를 반영한 세련된 스타일이 특기입니다.',
    },
    summary: {
      pros: '리허설 포함, 헤어+메이크업 원스톱, 장시간 유지력 우수',
      cons: '가격이 평균보다 높음, 주차 불편',
      caution: '당일 이른 시간 예약 시 시작 시간 협의 필요',
    },
  },
  {
    vendor_id: 10, name: '행복한 웨딩 MC', category: 'mc',
    region: '강남', style: '모던', capacity: 0,
    price_range: '0.5M-0.8M', price_min: 500_000,
    rating: 4.5, reviews_count: 38,
    tags: ['15년 경력', '식순 맞춤', '감동 멘트', '우천 대비 진행'],
    trustScore: 0.74, hasRainyPlan: true,
    recommendation: {
      rank: 1, score: 0.74,
      reason: '15년 경력의 전문 웨딩 MC로, 감동적인 멘트와 자연스러운 진행으로 하객들로부터 높은 호응을 받습니다. 커플의 스토리를 반영한 맞춤형 식순 구성이 강점입니다.',
    },
    summary: {
      pros: '풍부한 경력과 감동적 멘트, 맞춤형 식순 구성, 합리적 가격',
      cons: '일부 후기에서 진행 속도가 빠르다는 의견 있음',
      caution: '계약 시 사전 미팅 1회 필수 (식순 협의)',
    },
  },
];

// ── Mock 리뷰 데이터 (업체별 3개, 총 30개) ───────────────────────────────────
const MOCK_REVIEWS: VendorReview[] = [
  // venue 1
  { review_id: 'rv-1-1', vendor_id: 1, author: '박지수', rating: 5, sentiment: 'pos', createdAt: '2026-03-15T10:00:00Z', tags: ['친절한 스태프', '넓은 홀'], content: '정말 꿈에 그리던 결혼식이었어요. 스태프분들이 처음부터 끝까지 세심하게 케어해주셨고, 홀이 너무 넓고 화려해서 하객분들도 깜짝 놀라셨어요. 음식도 정말 맛있었고요!' },
  { review_id: 'rv-1-2', vendor_id: 1, author: '김민준', rating: 5, sentiment: 'pos', createdAt: '2026-02-20T09:00:00Z', tags: ['음식 퀄리티', '야경'], content: '저녁 웨딩이었는데 야경이 정말 멋있었습니다. 음식 퀄리티도 일반 웨딩홀과 비교 불가였고, 하객들한테 칭찬을 엄청 받았어요. 가격이 좀 있지만 그만한 가치가 있습니다.' },
  { review_id: 'rv-1-3', vendor_id: 1, author: '이서연', rating: 4, sentiment: 'neu', createdAt: '2026-01-10T14:00:00Z', tags: ['주차 불편'], content: '전반적으로 만족스럽지만 주차 공간이 부족해서 발렛 이용했어요. 발렛 대기 시간이 좀 길었습니다. 홀과 서비스는 정말 훌륭했어요.' },
  // venue 2
  { review_id: 'rv-2-1', vendor_id: 2, author: '최하은', rating: 5, sentiment: 'pos', createdAt: '2026-03-01T11:00:00Z', tags: ['한강뷰', '야외테라스'], content: '한강뷰 야외 테라스에서 찍은 사진이 너무 예쁘게 나왔어요! 접근성도 좋고 스태프분들도 친절하셨습니다.' },
  { review_id: 'rv-2-2', vendor_id: 2, author: '정민호', rating: 4, sentiment: 'pos', createdAt: '2026-02-14T10:00:00Z', tags: ['소규모 적합'], content: '소규모 결혼식에 딱 맞는 공간이었어요. 규모는 작지만 아늑하고 분위기가 좋았습니다. 가성비도 좋은 편이에요.' },
  { review_id: 'rv-2-3', vendor_id: 2, author: '한소희', rating: 3, sentiment: 'neg', createdAt: '2026-01-25T15:00:00Z', tags: ['날씨 변수'], content: '야외 행사 진행하려 했는데 갑자기 비가 와서 실내로 급하게 옮겼어요. 우천 플랜이 있다고 했지만 실내 수용 인원이 제한적이어서 좀 불편했습니다.' },
  // studio 3
  { review_id: 'rv-3-1', vendor_id: 3, author: '윤지아', rating: 5, sentiment: 'pos', createdAt: '2026-03-22T10:00:00Z', tags: ['자연광', '디렉팅'], content: '정말 최고의 스튜디오예요!! 자연광으로 찍은 사진이 너무 예뻐서 셀렉하기가 힘들 정도였어요. 디렉터분이 정말 편하게 이끌어주셔서 긴장도 금방 풀렸어요.' },
  { review_id: 'rv-3-2', vendor_id: 3, author: '강태양', rating: 5, sentiment: 'pos', createdAt: '2026-02-28T13:00:00Z', tags: ['무제한 셀렉', '보정'], content: '셀렉 무제한이라 300장 이상 건졌어요ㅋㅋ 보정도 빨리 해주시고 퀄리티도 최고입니다. 가격이 좀 있지만 완전 만족!' },
  { review_id: 'rv-3-3', vendor_id: 3, author: '임나영', rating: 4, sentiment: 'pos', createdAt: '2026-01-18T11:00:00Z', tags: ['예약 대기'], content: '사진은 너무 잘 나왔는데 예약을 3개월 전에 겨우 잡았어요. 인기가 너무 많아서 일정 잡기가 어렵습니다. 그래도 결과물은 정말 최고예요.' },
  // studio 4
  { review_id: 'rv-4-1', vendor_id: 4, author: '오민지', rating: 5, sentiment: 'pos', createdAt: '2026-03-10T14:00:00Z', tags: ['필름 감성', '빈티지'], content: '홍대 감성 완전 제대로 살린 스튜디오예요. 필름 느낌 사진 원하는 분들한테 강추합니다. 소품도 너무 예쁘고 저희 스타일에 딱 맞았어요!' },
  { review_id: 'rv-4-2', vendor_id: 4, author: '서준혁', rating: 4, sentiment: 'pos', createdAt: '2026-02-05T15:00:00Z', tags: ['가성비', '야외촬영'], content: '야외 촬영 포함이라 가성비가 정말 좋아요. 홍대 특유의 감성적인 장소에서 찍어서 사진이 독특하게 잘 나왔습니다.' },
  { review_id: 'rv-4-3', vendor_id: 4, author: '노은빈', rating: 4, sentiment: 'neu', createdAt: '2026-01-30T10:00:00Z', tags: ['공간 협소'], content: '사진 퀄리티는 좋은데 실내 스튜디오 공간이 좀 좁은 편이에요. 야외로 이동해서 찍는 시간이 더 많았어요. 전체적으로는 만족합니다.' },
  // studio 5
  { review_id: 'rv-5-1', vendor_id: 5, author: '류하린', rating: 5, sentiment: 'pos', createdAt: '2026-03-18T10:00:00Z', tags: ['자연 배경', '자연스러운'], content: '공원에서 찍은 사진들이 너무 자연스럽고 예뻐요! 억지로 포즈 잡는 느낌 없이 우리다운 모습 그대로 담겨서 정말 마음에 들어요.' },
  { review_id: 'rv-5-2', vendor_id: 5, author: '문세준', rating: 5, sentiment: 'pos', createdAt: '2026-02-12T13:00:00Z', tags: ['합리적 가격'], content: '이 가격에 이 퀄리티면 완전 가성비 최고죠. 야외 전문이라 날씨가 걱정됐는데 당일 날씨가 완벽했고 사진도 너무 잘 나왔어요.' },
  { review_id: 'rv-5-3', vendor_id: 5, author: '남지현', rating: 4, sentiment: 'neu', createdAt: '2026-01-08T14:00:00Z', tags: ['실내 시설'], content: '야외 사진은 정말 좋은데 우천으로 인해 실내 대안 장소에서 찍었는데 실내 시설이 좀 아쉬웠어요. 야외 날씨만 좋으면 완벽한 스튜디오입니다.' },
  // dress 6
  { review_id: 'rv-6-1', vendor_id: 6, author: '황지은', rating: 5, sentiment: 'pos', createdAt: '2026-03-25T11:00:00Z', tags: ['수입 드레스', '스타일리스트'], content: '수입 드레스 종류가 어마어마하고 스타일리스트분이 제 체형에 딱 맞는 드레스를 골라주셨어요. 완전 만족! 비싸지만 그만한 가치 있어요.' },
  { review_id: 'rv-6-2', vendor_id: 6, author: '배은서', rating: 5, sentiment: 'pos', createdAt: '2026-02-22T14:00:00Z', tags: ['VIP 서비스'], content: 'VIP 피팅룸에서 편안하게 여러 벌 입어볼 수 있어서 좋았어요. 부케도 포함이라 따로 준비 안 해도 돼서 편했고요. 결혼식 사진 보니까 드레스가 너무 예쁘게 나왔어요.' },
  { review_id: 'rv-6-3', vendor_id: 6, author: '조수정', rating: 4, sentiment: 'pos', createdAt: '2026-01-20T10:00:00Z', tags: ['수선 비용'], content: '드레스가 너무 예쁜데 수선 비용이 추가로 꽤 나왔어요. 처음에 그 부분 안내가 명확하지 않아서 약간 당황했습니다. 그래도 결과물은 만족해요.' },
  // dress 7
  { review_id: 'rv-7-1', vendor_id: 7, author: '전수아', rating: 5, sentiment: 'pos', createdAt: '2026-03-12T13:00:00Z', tags: ['국내 디자이너', '독특한 스타일'], content: '국내 신진 디자이너 드레스들이 너무 예뻐요! 남들이랑 다른 개성 있는 드레스 원하는 분들한테 딱이에요. 가격도 합리적이고요.' },
  { review_id: 'rv-7-2', vendor_id: 7, author: '안재현', rating: 4, sentiment: 'pos', createdAt: '2026-02-08T11:00:00Z', tags: ['합리적 가격'], content: '이 가격이면 퀄리티가 정말 좋아요. 청담 명품 드레스숍들 다 가봤는데 여기가 가성비 최고입니다.' },
  { review_id: 'rv-7-3', vendor_id: 7, author: '장민아', rating: 3, sentiment: 'neg', createdAt: '2026-01-15T15:00:00Z', tags: ['협소한 공간'], content: '드레스는 이쁜데 피팅룸이 너무 좁아서 움직이기 불편했어요. 한꺼번에 많은 드레스 입어보기가 어렵더라고요. 예약하고 가시는 걸 추천드려요.' },
  // makeup 8
  { review_id: 'rv-8-1', vendor_id: 8, author: '홍서은', rating: 5, sentiment: 'pos', createdAt: '2026-03-20T09:00:00Z', tags: ['자연 메이크업', '화사함'], content: '결혼식 메이크업인데도 너무 자연스럽고 화사하게 해주셔서 하객분들이 다들 예쁘다고 해주셨어요! 피부 관리도 꼼꼼히 해주셔서 사진도 잘 나왔어요.' },
  { review_id: 'rv-8-2', vendor_id: 8, author: '권재원', rating: 5, sentiment: 'pos', createdAt: '2026-02-18T10:00:00Z', tags: ['출장 서비스', '시간 준수'], content: '출장 메이크업 서비스 이용했는데 시간도 정확히 지켜주시고 완성도도 높았어요. 남자 메이크업도 자연스럽게 잘 해주셨어요.' },
  { review_id: 'rv-8-3', vendor_id: 8, author: '신예나', rating: 4, sentiment: 'pos', createdAt: '2026-01-12T11:00:00Z', tags: ['예약 어려움'], content: '메이크업은 너무 마음에 드는데 주말 예약이 너무 어려워요. 3개월 전에 예약했는데도 원하는 시간대 잡기가 힘들었어요. 일찍 예약하세요!' },
  // makeup 9
  { review_id: 'rv-9-1', vendor_id: 9, author: '이유진', rating: 5, sentiment: 'pos', createdAt: '2026-03-08T10:00:00Z', tags: ['리허설', '글로우'], content: '리허설 포함이라 당일 메이크업 완성본 미리 확인할 수 있어서 너무 좋았어요. 글로우 메이크업이 사진에서 정말 예쁘게 나왔어요!' },
  { review_id: 'rv-9-2', vendor_id: 9, author: '김준서', rating: 4, sentiment: 'pos', createdAt: '2026-02-10T14:00:00Z', tags: ['헤어+메이크업'], content: '헤어랑 메이크업 한 곳에서 해결할 수 있어서 편했어요. 두 분이 호흡이 맞아서 전체적으로 스타일이 잘 어우러졌어요.' },
  { review_id: 'rv-9-3', vendor_id: 9, author: '박솔지', rating: 4, sentiment: 'neu', createdAt: '2026-01-22T13:00:00Z', tags: ['가격대 높음'], content: '퀄리티는 좋은데 가격이 조금 부담스러운 편이에요. 리허설까지 포함하면 가성비가 애매할 수 있어요. 여유가 된다면 추천합니다.' },
  // mc 10
  { review_id: 'rv-10-1', vendor_id: 10, author: '최가은', rating: 5, sentiment: 'pos', createdAt: '2026-03-28T10:00:00Z', tags: ['감동 멘트', '식순'], content: '결혼식 진행이 너무 자연스럽고 감동적이었어요! 저희 연애 스토리를 반영한 멘트가 하객들 눈물샘을 자극했어요. 정말 잊지 못할 결혼식이 됐습니다.' },
  { review_id: 'rv-10-2', vendor_id: 10, author: '노시현', rating: 4, sentiment: 'pos', createdAt: '2026-02-16T11:00:00Z', tags: ['경력 많음', '전문적'], content: '경력이 많으셔서 그런지 어떤 돌발상황도 자연스럽게 넘어가셨어요. 식순 협의도 친절하게 해주시고 전반적으로 만족스러웠습니다.' },
  { review_id: 'rv-10-3', vendor_id: 10, author: '정현우', rating: 4, sentiment: 'neu', createdAt: '2026-01-28T14:00:00Z', tags: ['진행 속도'], content: '멘트나 진행 능력은 좋은데 전체 식 진행이 예상보다 빠르게 끝났어요. 식순 협의 때 시간 조율을 더 꼼꼼히 하면 좋을 것 같아요.' },
];

// ── API 함수 ─────────────────────────────────────────────────────────────────

/** 업체 목록 조회 (필터 + 정렬) */
export async function fetchVendors(
  filter: VendorFilter,
  sort: VendorSort,
): Promise<VendorListResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 250));
    let list = [...MOCK_VENDORS];

    // 필터 적용
    if (filter.category)    list = list.filter((v) => v.category === filter.category);
    if (filter.region)      list = list.filter((v) => v.region === filter.region);
    if (filter.maxPrice)    list = list.filter((v) => v.price_min <= filter.maxPrice!);
    if (filter.style)       list = list.filter((v) => v.style === filter.style);
    if (filter.minCapacity) list = list.filter((v) => v.capacity >= filter.minCapacity!);
    if (filter.hasRainyPlan) list = list.filter((v) => v.hasRainyPlan);

    // 정렬 적용
    if (sort === 'recommended') list.sort((a, b) => a.recommendation.rank - b.recommendation.rank);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'price_asc') list.sort((a, b) => a.price_min - b.price_min);
    else if (sort === 'price_desc') list.sort((a, b) => b.price_min - a.price_min);

    return { vendors: list, total: list.length };
  }

  const params = new URLSearchParams();
  if (filter.category)    params.set('category',    filter.category);
  if (filter.region)      params.set('region',      filter.region);
  if (filter.maxPrice)    params.set('maxPrice',    String(filter.maxPrice));
  if (filter.style)       params.set('style',       filter.style);
  if (filter.minCapacity) params.set('minCapacity', String(filter.minCapacity));
  if (filter.hasRainyPlan) params.set('hasRainyPlan', 'true');
  params.set('sort', sort);

  return apiClient.get(`api/user/vendors?${params.toString()}`).json();
}

/** 업체 상세 조회 (리뷰 + 유사 업체 포함) */
export async function fetchVendorDetail(id: number): Promise<VendorDetailResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    const vendor = MOCK_VENDORS.find((v) => v.vendor_id === id);
    if (!vendor) throw new Error('업체를 찾을 수 없습니다.');

    const reviews = MOCK_REVIEWS.filter((r) => r.vendor_id === id);
    const similar = MOCK_VENDORS
      .filter((v) => v.category === vendor.category && v.vendor_id !== id)
      .slice(0, 3);

    return { vendor, reviews, similar };
  }

  return apiClient.get(`api/user/vendors/${id}`).json();
}
