'use client';

import { useCallback, useRef, useState } from 'react';
import { streamAIResponse } from '@/lib/ai-stream';
import type {
  AIMessage,
  AIPart,
  NavigationSuggestion,
  ToolCallPart,
  AgentType,
} from '@/types/ai';

type AIChatRole = 'couple' | 'planner' | 'vendor';

// ── 역할별 웰컴 메시지 ──────────────────────────────────────────
const WELCOME_TEXT: Record<AIChatRole, string> = {
  couple:
    '안녕하세요! 저는 Promise Marry의 AI 웨딩 비서예요 💍\n\n' +
    '예산 분석, 문서 관리, 업체 추천, 체크리스트 등 웨딩 준비의 모든 것을 도와드릴 수 있어요.\n\n' +
    '무엇이든 편하게 물어보세요!',
  planner:
    '안녕하세요! AI 플래너 비서예요 📋\n\n' +
    '고객 관리, 일정 조율, 계약서 검토, SMS 발송 등 플래너 업무 자동화를 도와드릴 수 있어요.\n\n' +
    '무엇이든 편하게 물어보세요!',
  vendor:
    '안녕하세요! AI 업체 비서예요 🏪\n\n' +
    '예약 관리, 매출 분석, 홍보 문구 작성, 경쟁사 비교 등 업체 운영의 모든 것을 도와드릴 수 있어요.\n\n' +
    '무엇이든 편하게 물어보세요!',
};

// ── 역할별 웰컴 바로가기 링크 ───────────────────────────────────
const WELCOME_SUGGESTIONS: Record<AIChatRole, NavigationSuggestion[]> = {
  couple:  [
    { label: '예산 관리',    href: '/couple/budget' },
    { label: '문서 보관함',  href: '/couple/documents' },
    { label: '커뮤니티',     href: '/couple/community' },
  ],
  planner: [
    { label: '고객 관리',    href: '/planner/customers' },
    { label: '캘린더',       href: '/planner/calendar' },
    { label: '계약서 보관함', href: '/planner/contracts' },
  ],
  vendor:  [
    { label: '예약 관리',    href: '/vendor/reservations' },
    { label: '매출 현황',    href: '/vendor/revenue' },
    { label: '홍보 멘트',    href: '/vendor/promotions' },
  ],
};

// ── 역할별 Tool 결과 → 페이지 네비게이션 제안 ──────────────────
const NAV_SUGGESTIONS_COUPLE: Record<string, NavigationSuggestion[]> = {
  get_budget_summary: [
    { label: '예산 관리 페이지로', href: '/couple/budget', description: '예산 설정 및 지출 추가' },
  ],
  get_documents: [
    { label: '문서 보관함으로', href: '/couple/documents', description: '계약서·영수증 관리' },
  ],
  get_community_posts: [
    { label: '커뮤니티 보러가기', href: '/couple/community', description: '게시글 읽기 및 댓글' },
  ],
  get_notifications: [
    { label: '알림 확인하기', href: '/couple/notifications' },
  ],
  get_chat_rooms: [
    { label: '채팅 열기', href: '/couple/chat' },
  ],
  search_vendors: [
    { label: '업체 찾기', href: '/couple/vendors', description: '업체 검색 및 비교' },
    { label: '채팅으로 문의', href: '/couple/chat', description: '플래너·업체와 직접 소통' },
  ],
  get_wedding_checklist: [
    { label: '캘린더 보기', href: '/couple/calendar', description: '일정 관리' },
  ],
};

const NAV_SUGGESTIONS_PLANNER: Record<string, NavigationSuggestion[]> = {
  get_documents:      [{ label: '계약서 보관함', href: '/planner/contracts', description: '계약서·영수증 관리' }],
  get_notifications:  [{ label: '알림 확인', href: '/planner/notifications' }],
  get_chat_rooms:     [{ label: '채팅 열기', href: '/planner/chats' }],
  get_calendar_events:[{ label: '캘린더 보기', href: '/planner/calendar' }],
};

const NAV_SUGGESTIONS_VENDOR: Record<string, NavigationSuggestion[]> = {
  get_documents:      [{ label: '계약서 보관함', href: '/vendor/contracts', description: '계약서 관리' }],
  get_notifications:  [{ label: '알림 확인', href: '/vendor/notifications' }],
  get_chat_rooms:     [{ label: '채팅 열기', href: '/vendor/chats' }],
  get_calendar_events:[{ label: '예약 현황', href: '/vendor/reservations', description: '예약 목록 보기' }],
};

const NAV_SUGGESTIONS_BY_ROLE: Record<AIChatRole, Record<string, NavigationSuggestion[]>> = {
  couple:  NAV_SUGGESTIONS_COUPLE,
  planner: NAV_SUGGESTIONS_PLANNER,
  vendor:  NAV_SUGGESTIONS_VENDOR,
};

function createId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildWelcomeMessage(role: AIChatRole): AIMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    parts: [{ type: 'text', text: WELCOME_TEXT[role], streaming: false }],
    suggestions: WELCOME_SUGGESTIONS[role],
    createdAt: new Date().toISOString(),
  };
}

export function useAIChat(role: AIChatRole = 'couple') {
  const [messages, setMessages] = useState<AIMessage[]>(() => [buildWelcomeMessage(role)]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isStreaming) return;

    // Abort any in-progress stream
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const userMsg: AIMessage = {
      id: createId(),
      role: 'user',
      content: prompt.trim(),
      createdAt: new Date().toISOString(),
    };

    const assistantId = createId();
    const assistantMsg: AIMessage = {
      id: assistantId,
      role: 'assistant',
      parts: [],
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    // Build history for context
    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.role,
        content:
          m.role === 'user'
            ? (m.content ?? '')
            : (m.parts ?? [])
                .filter((p): p is { type: 'text'; text: string; streaming: boolean } => p.type === 'text')
                .map((p) => p.text)
                .join(''),
      }))
      .slice(-10); // last 10 for context window

    // Track tool calls for navigation suggestions
    const calledTools = new Set<string>();
    let currentTextIdx = -1;

    const updateAssistant = (updater: (parts: AIPart[]) => AIPart[]) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, parts: updater(m.parts ?? []) } : m,
        ),
      );
    };

    try {
      const stream = streamAIResponse(prompt, history, ac.signal);

      for await (const event of stream) {
        if (ac.signal.aborted) break;

        if (event.type === 'agent_switch') {
          updateAssistant((parts) => [
            ...parts,
            { type: 'agent_switch', from: event.from, to: event.to } satisfies AIPart,
          ]);
          currentTextIdx = -1;
        }

        else if (event.type === 'tool_call') {
          updateAssistant((parts) => [
            ...parts,
            {
              type: 'tool_call',
              toolCallId: event.toolCallId,
              toolName: event.toolName,
              args: event.args,
              status: 'pending',
            } satisfies AIPart,
          ]);
          currentTextIdx = -1;
        }

        else if (event.type === 'tool_result') {
          calledTools.add(event.toolName);
          updateAssistant((parts) =>
            parts.map((p) =>
              p.type === 'tool_call' && p.toolCallId === event.toolCallId
                ? ({ ...p, status: 'done', result: event.result } satisfies AIPart)
                : p,
            ),
          );
        }

        else if (event.type === 'text_chunk') {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantId) return m;
              const parts = [...(m.parts ?? [])];
              const lastPart = parts[parts.length - 1];

              if (lastPart?.type === 'text') {
                parts[parts.length - 1] = {
                  ...lastPart,
                  text: lastPart.text + event.delta,
                  streaming: true,
                };
              } else {
                parts.push({ type: 'text', text: event.delta, streaming: true });
                currentTextIdx = parts.length - 1;
              }
              return { ...m, parts };
            }),
          );
        }

        else if (event.type === 'done') {
          // Mark text as done streaming, add navigation suggestions
          const navMap = NAV_SUGGESTIONS_BY_ROLE[role];
          const suggestions: NavigationSuggestion[] = [];
          calledTools.forEach((tool) => {
            const navs = navMap[tool];
            if (navs) suggestions.push(...navs);
          });

          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantId) return m;
              const parts = (m.parts ?? []).map((p) =>
                p.type === 'text' ? { ...p, streaming: false } : p,
              );
              return {
                ...m,
                parts,
                suggestions: suggestions.length ? suggestions : undefined,
              };
            }),
          );
        }

        else if (event.type === 'error') {
          updateAssistant((parts) => [
            ...parts,
            { type: 'text', text: `⚠️ 오류가 발생했어요: ${event.message}`, streaming: false },
          ]);
        }
      }
    } catch (err) {
      if (!ac.signal.aborted) {
        updateAssistant((parts) => [
          ...parts,
          { type: 'text', text: '⚠️ 연결 오류가 발생했어요. 잠시 후 다시 시도해주세요.', streaming: false },
        ]);
      }
    } finally {
      // Ensure streaming flag ends cleanly
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                parts: (m.parts ?? []).map((p) =>
                  p.type === 'text' ? { ...p, streaming: false } : p,
                ),
              }
            : m,
        ),
      );
      setIsStreaming(false);
    }
  }, [isStreaming, messages, role]);

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([buildWelcomeMessage(role)]);
  }, [role]);

  return { messages, isStreaming, sendMessage, stopStream, clearHistory };
}
