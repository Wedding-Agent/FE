import type { SSEEvent } from '@/types/ai';

/**
 * Real SSE streaming via fetch ReadableStream.
 * Yields parsed SSEEvent objects as they arrive.
 */
export async function* streamAIResponse(
  prompt: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  signal?: AbortSignal,
): AsyncGenerator<SSEEvent> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const isMock = base === '' || base.includes('mock');

  if (isMock) {
    yield* mockStream(prompt);
    return;
  }

  let token: string | null = null;
  try {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { token?: string } };
      token = parsed?.state?.token ?? null;
    }
  } catch {}

  const resp = await fetch(`${base}/ai/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ prompt, history }),
    signal,
  });

  if (!resp.ok || !resp.body) {
    yield { type: 'error', message: `HTTP ${resp.status}` } as SSEEvent;
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        yield JSON.parse(raw) as SSEEvent;
      } catch {
        // skip malformed line
      }
    }
  }
}

// ────────────────────────────────────────────────────────────────
// Mock stream generator — simulates realistic AI responses
// ────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type MockScenario = {
  match: (prompt: string) => boolean;
  events: () => AsyncGenerator<SSEEvent>;
};

async function* emitText(text: string, chunkSize = 3): AsyncGenerator<SSEEvent> {
  for (let i = 0; i < text.length; i += chunkSize) {
    yield { type: 'text_chunk', delta: text.slice(i, i + chunkSize) };
    await delay(18 + Math.random() * 20);
  }
}

// ── Scenario: Budget ──────────────────────────────────────────────
async function* budgetScenario(): AsyncGenerator<SSEEvent> {
  yield { type: 'agent_switch', from: 'orchestrator', to: 'couple' };
  await delay(300);
  yield { type: 'tool_call', toolCallId: 'tc-1', toolName: 'get_budget_summary', args: {} };
  await delay(700);
  yield {
    type: 'tool_result',
    toolCallId: 'tc-1',
    toolName: 'get_budget_summary',
    result: {
      totalBudget: 30_000_000,
      totalSpent: 10_250_000,
      remaining: 19_750_000,
      usagePct: 34.2,
      unexpectedCount: 1,
      topCategory: '웨딩홀',
      topSpent: 5_500_000,
    },
  };
  await delay(200);
  yield* emitText(
    '현재 예산 현황을 분석했어요 💰\n\n' +
    '총 예산 **3,000만원** 중 **1,025만원**을 사용했어요.\n' +
    '전체의 **34.2%** 수준으로 아직 안전 단계(🟢)예요.\n\n' +
    '📊 카테고리별 주요 지출:\n' +
    '• 웨딩홀 계약금: 5,500,000원\n' +
    '• 신혼여행 항공권: 2,400,000원\n' +
    '• 웨딩드레스: 1,200,000원\n\n' +
    '⚠️ **예상치 못한 지출** 1건(헤어·메이크업 리허설 200,000원)이 확인됐어요. 예산을 재조정할지 검토해보세요.',
  );
  yield { type: 'done' };
}

// ── Scenario: Documents ───────────────────────────────────────────
async function* documentsScenario(): AsyncGenerator<SSEEvent> {
  yield { type: 'agent_switch', from: 'orchestrator', to: 'couple' };
  await delay(300);
  yield { type: 'tool_call', toolCallId: 'tc-2', toolName: 'get_documents', args: {} };
  await delay(800);
  yield {
    type: 'tool_result',
    toolCallId: 'tc-2',
    toolName: 'get_documents',
    result: {
      total: 2,
      documents: [
        { fileName: '웨딩홀_계약서.jpg', category: 'CONTRACT', vendorName: '그랜드웨딩홀', totalAmount: '5,500,000원' },
        { fileName: '스튜디오_영수증.png', category: 'RECEIPT', vendorName: '포토스튜디오A', totalAmount: '800,000원' },
      ],
    },
  };
  await delay(200);
  yield* emitText(
    '문서 보관함에서 **2개의 문서**를 분석했어요 📄\n\n' +
    '**📋 그랜드웨딩홀 계약서**\n' +
    '• 계약 금액: 5,500,000원\n' +
    '• 계약일: 2026년 4월 15일\n\n' +
    '**🧾 포토스튜디오A 영수증**\n' +
    '• 결제 금액: 800,000원\n' +
    '• 웨딩 스냅 촬영 계약\n\n' +
    '두 문서 모두 예산 관리와 연동되어 있어요. 추가 계약서나 영수증이 있다면 업로드해주세요!',
  );
  yield { type: 'done' };
}

// ── Scenario: Checklist ───────────────────────────────────────────
async function* checklistScenario(): AsyncGenerator<SSEEvent> {
  yield { type: 'agent_switch', from: 'orchestrator', to: 'couple' };
  await delay(300);
  yield { type: 'tool_call', toolCallId: 'tc-3', toolName: 'get_wedding_checklist', args: {} };
  await delay(600);
  yield {
    type: 'tool_result',
    toolCallId: 'tc-3',
    toolName: 'get_wedding_checklist',
    result: {
      dDay: 'D-83',
      done: 5,
      total: 20,
    },
  };
  await delay(200);
  yield* emitText(
    '웨딩 준비 현황을 정리했어요 ✅\n\n' +
    '결혼식까지 **D-83** 남았어요!\n' +
    '전체 20개 항목 중 **5개 완료** (25% 진행)\n\n' +
    '⚠️ **이번 달 반드시 완료해야 할 항목:**\n' +
    '• [ ] 청첩장 발송 (D-60 전 권장)\n' +
    '• [ ] 식대 인원 확정 및 업체 통보\n' +
    '• [ ] 신혼여행 비자 및 예방접종 확인\n' +
    '• [ ] 혼인신고 서류 준비\n\n' +
    '✅ **완료된 항목:**\n' +
    '• [x] 웨딩홀 계약\n' +
    '• [x] 사진·영상 업체 계약\n' +
    '• [x] 드레스 선택\n' +
    '• [x] 신혼여행 항공권 예매\n' +
    '• [x] 청첩장 디자인 확정',
  );
  yield { type: 'done' };
}

// ── Scenario: Community posts ─────────────────────────────────────
async function* communityScenario(): AsyncGenerator<SSEEvent> {
  yield { type: 'agent_switch', from: 'orchestrator', to: 'couple' };
  await delay(300);
  yield { type: 'tool_call', toolCallId: 'tc-4', toolName: 'get_community_posts', args: { sort: 'POPULAR' } };
  await delay(600);
  yield {
    type: 'tool_result',
    toolCallId: 'tc-4',
    toolName: 'get_community_posts',
    result: {
      posts: [
        { title: '웨딩 스냅 촬영 꿀팁 공유해요 📸', likeCount: 102, commentCount: 8 },
        { title: '드레스 샵 비교해봤어요 (강남 5곳)', likeCount: 87, commentCount: 23 },
        { title: '예물 반지 브랜드 추천 (실구매 후기)', likeCount: 56, commentCount: 19 },
      ],
    },
  };
  await delay(200);
  yield* emitText(
    '커뮤니티 인기 게시글을 가져왔어요 💬\n\n' +
    '**🔥 이번 주 인기글 TOP 3:**\n\n' +
    '1. 📸 **웨딩 스냅 촬영 꿀팁** (❤️ 102)\n' +
    '   골든아워 활용, 드레스 핀 여분 챙기기 등 실용적인 팁\n\n' +
    '2. 👗 **드레스 샵 강남 5곳 비교** (❤️ 87)\n' +
    '   화이트로즈 가성비 최고 추천!\n\n' +
    '3. 💍 **예물 반지 실구매 후기** (❤️ 56)\n' +
    '   까르띠에 러브링 AS 후기 포함\n\n' +
    '관심 있는 글에 댓글 달아 소통해보세요!',
  );
  yield { type: 'done' };
}

// ── Scenario: Honeymoon ───────────────────────────────────────────
async function* honeymoonScenario(): AsyncGenerator<SSEEvent> {
  yield { type: 'agent_switch', from: 'orchestrator', to: 'couple' };
  await delay(200);
  yield { type: 'tool_call', toolCallId: 'tc-5', toolName: 'search_vendors', args: { type: 'honeymoon', query: '신혼여행' } };
  await delay(700);
  yield {
    type: 'tool_result',
    toolCallId: 'tc-5',
    toolName: 'search_vendors',
    result: {
      recommendations: ['몰디브', '발리', '하와이', '이탈리아', '일본 오키나와'],
    },
  };
  await delay(200);
  yield* emitText(
    '인기 신혼여행지를 추천해드릴게요 ✈️\n\n' +
    '**1위 🏝️ 몰디브** — 수상방갈로 로망의 끝판왕\n' +
    '• 예산: 약 400~700만원 (2인)\n' +
    '• 추천 리조트: 선시아나, 코모 코카 뚜투\n' +
    '• 최적 시기: 1~3월, 11~12월\n\n' +
    '**2위 🌴 발리** — 자연+문화+로맨스\n' +
    '• 예산: 약 150~300만원 (2인)\n' +
    '• 추천 지역: 우붓 풀빌라, 스미냑 해변\n' +
    '• 치안 팁: 스쿠터보다 전용 기사 추천\n\n' +
    '**3위 🌺 하와이** — 허니문 클래식\n' +
    '• 예산: 약 300~500만원 (2인)\n' +
    '• 추천 섬: 마우이 > 오아후\n\n' +
    '현재 예산에서 신혼여행 계획 금액은 **4,000만원**으로, 몰디브나 하와이도 충분히 가능해요! 💍',
  );
  yield { type: 'done' };
}

// ── Scenario: Vendor search ───────────────────────────────────────
async function* vendorScenario(): AsyncGenerator<SSEEvent> {
  yield { type: 'agent_switch', from: 'orchestrator', to: 'couple' };
  await delay(300);
  yield { type: 'tool_call', toolCallId: 'tc-6', toolName: 'search_vendors', args: { type: 'venue', region: '서울' } };
  await delay(800);
  yield {
    type: 'tool_result',
    toolCallId: 'tc-6',
    toolName: 'search_vendors',
    result: {
      vendors: [
        { name: '그랜드웨딩홀', region: '강남', capacity: 300, priceRange: '3,000~6,000만원' },
        { name: '파크하얏트 서울', region: '강남', capacity: 200, priceRange: '5,000만원~' },
        { name: '롯데호텔 서울', region: '중구', capacity: 400, priceRange: '4,000~7,000만원' },
      ],
    },
  };
  await delay(200);
  yield* emitText(
    '서울 웨딩홀 업체를 검색했어요 🏛️\n\n' +
    '**인기 웨딩홀 TOP 3:**\n\n' +
    '🥇 **그랜드웨딩홀** (강남)\n' +
    '• 수용: 최대 300명 | 예산: 3,000~6,000만원\n' +
    '• 특징: 자연광 채광, 넓은 포토존, 드레스룸 완비\n\n' +
    '🥈 **파크하얏트 서울** (강남)\n' +
    '• 수용: 최대 200명 | 예산: 5,000만원~\n' +
    '• 특징: 5성급 호텔, 프리미엄 식대, 완벽한 서비스\n\n' +
    '🥉 **롯데호텔 서울** (중구)\n' +
    '• 수용: 최대 400명 | 예산: 4,000~7,000만원\n' +
    '• 특징: 대규모 행사 가능, 도심 접근성 우수\n\n' +
    '관심 있는 업체에 견적 문의를 해보세요! 채팅으로 업체와 직접 소통할 수 있어요.',
  );
  yield { type: 'done' };
}

// ── Scenario: General / fallback ──────────────────────────────────
async function* generalScenario(prompt: string): AsyncGenerator<SSEEvent> {
  yield { type: 'agent_switch', from: 'orchestrator', to: 'couple' };
  await delay(400);
  yield* emitText(
    `안녕하세요! 웨딩 비서예요 💍\n\n` +
    `"${prompt}"에 대해 답변드릴게요.\n\n` +
    `저는 웨딩 준비의 전 과정을 도와드릴 수 있어요:\n\n` +
    `• 💰 **예산 관리** — 지출 현황 분석 및 절약 팁\n` +
    `• 📄 **문서 분석** — 계약서·영수증 OCR 자동 추출\n` +
    `• 🏛️ **업체 추천** — 웨딩홀·드레스·사진·메이크업\n` +
    `• ✅ **체크리스트** — D-Day별 준비 항목 관리\n` +
    `• 💬 **커뮤니티** — 다른 커플의 후기와 팁\n` +
    `• ✈️ **신혼여행** — 여행지 추천 및 예산 계획\n\n` +
    `하단의 빠른 메뉴를 눌러 바로 시작해보세요!`,
  );
  yield { type: 'done' };
}

// ── Scenario router ────────────────────────────────────────────────
async function* mockStream(prompt: string): AsyncGenerator<SSEEvent> {
  const p = prompt.toLowerCase();
  if (p.includes('예산') || p.includes('지출') || p.includes('비용'))     yield* budgetScenario();
  else if (p.includes('문서') || p.includes('계약') || p.includes('영수')) yield* documentsScenario();
  else if (p.includes('체크') || p.includes('준비') || p.includes('일정')) yield* checklistScenario();
  else if (p.includes('커뮤니티') || p.includes('인기') || p.includes('게시')) yield* communityScenario();
  else if (p.includes('신혼여행') || p.includes('여행') || p.includes('허니문')) yield* honeymoonScenario();
  else if (p.includes('업체') || p.includes('웨딩홀') || p.includes('찾')) yield* vendorScenario();
  else yield* generalScenario(prompt);
}
