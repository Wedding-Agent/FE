// ────────────────────────────────────────────────────────────────
// SSE Event types (ADR-011)
// ────────────────────────────────────────────────────────────────
export type SSEEventType =
  | 'text_chunk'
  | 'tool_call'
  | 'tool_result'
  | 'agent_switch'
  | 'done'
  | 'error';

export type AgentType = 'orchestrator' | 'couple' | 'planner' | 'vendor';

export const AGENT_LABEL: Record<AgentType, string> = {
  orchestrator: '오케스트레이터',
  couple:       '웨딩 비서',
  planner:      '플래너 AI',
  vendor:       '업체 AI',
};

export const AGENT_EMOJI: Record<AgentType, string> = {
  orchestrator: '🎯',
  couple:       '💍',
  planner:      '📋',
  vendor:       '🏪',
};

// ────────────────────────────────────────────────────────────────
// SSE Payload shapes
// ────────────────────────────────────────────────────────────────
export interface TextChunkEvent {
  type: 'text_chunk';
  delta: string;
}

export interface ToolCallEvent {
  type: 'tool_call';
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

export interface ToolResultEvent {
  type: 'tool_result';
  toolCallId: string;
  toolName: string;
  result: unknown;
}

export interface AgentSwitchEvent {
  type: 'agent_switch';
  from: AgentType;
  to: AgentType;
}

export interface DoneEvent {
  type: 'done';
}

export interface ErrorEvent {
  type: 'error';
  message: string;
}

export type SSEEvent =
  | TextChunkEvent
  | ToolCallEvent
  | ToolResultEvent
  | AgentSwitchEvent
  | DoneEvent
  | ErrorEvent;

// ────────────────────────────────────────────────────────────────
// Message & Part types (for rendering)
// ────────────────────────────────────────────────────────────────
export type AIMessageRole = 'user' | 'assistant';

export interface TextPart {
  type: 'text';
  text: string;
  streaming: boolean;
}

export interface ToolCallPart {
  type: 'tool_call';
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  status: 'pending' | 'done';
  result?: unknown;
}

export interface AgentSwitchPart {
  type: 'agent_switch';
  from: AgentType;
  to: AgentType;
}

export interface NavigationSuggestion {
  label: string;
  href: string;
  description?: string;
}

export type AIPart = TextPart | ToolCallPart | AgentSwitchPart;

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content?: string;            // for user messages
  parts?: AIPart[];            // for assistant messages
  suggestions?: NavigationSuggestion[];
  createdAt: string;
}

// ────────────────────────────────────────────────────────────────
// Tool definitions (MCP tools the AI can call)
// ────────────────────────────────────────────────────────────────
export type ToolName =
  | 'get_budget_summary'
  | 'get_documents'
  | 'get_community_posts'
  | 'get_notifications'
  | 'get_chat_rooms'
  | 'navigate_to'
  | 'search_vendors'
  | 'get_wedding_checklist'
  | 'get_calendar_events';

export const TOOL_LABEL: Record<ToolName, string> = {
  get_budget_summary:    '예산 현황 조회',
  get_documents:         '문서 보관함 조회',
  get_community_posts:   '커뮤니티 게시글 조회',
  get_notifications:     '알림 확인',
  get_chat_rooms:        '채팅방 목록 조회',
  navigate_to:           '페이지 이동',
  search_vendors:        '업체 검색',
  get_wedding_checklist: '웨딩 체크리스트 조회',
  get_calendar_events:   '일정 조회',
};

export const TOOL_EMOJI: Record<ToolName, string> = {
  get_budget_summary:    '💰',
  get_documents:         '📄',
  get_community_posts:   '💬',
  get_notifications:     '🔔',
  get_chat_rooms:        '💌',
  navigate_to:           '🗺️',
  search_vendors:        '🔍',
  get_wedding_checklist: '✅',
  get_calendar_events:   '📅',
};

// ────────────────────────────────────────────────────────────────
// Quick action chips
// ────────────────────────────────────────────────────────────────
export interface QuickAction {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'budget',
    label: '예산 현황',
    emoji: '💰',
    prompt: '현재 웨딩 예산 현황을 알려줘',
  },
  {
    id: 'documents',
    label: '문서 분석',
    emoji: '📄',
    prompt: '업로드된 계약서와 영수증을 분석해줘',
  },
  {
    id: 'checklist',
    label: '웨딩 체크리스트',
    emoji: '✅',
    prompt: '웨딩 준비 체크리스트를 보여줘',
  },
  {
    id: 'community',
    label: '인기 게시글',
    emoji: '💬',
    prompt: '커뮤니티 인기 게시글 알려줘',
  },
  {
    id: 'honeymoon',
    label: '신혼여행 추천',
    emoji: '✈️',
    prompt: '신혼여행지 추천해줘',
  },
  {
    id: 'vendor',
    label: '업체 찾기',
    emoji: '🔍',
    prompt: '웨딩홀 업체를 찾아줘',
  },
];

export const VENDOR_QUICK_ACTIONS: QuickAction[] = [
  { id: 'reservations', label: '예약 현황',      emoji: '📅', prompt: '오늘 이후 예약 현황을 알려줘' },
  { id: 'revenue',      label: '매출 분석',      emoji: '💰', prompt: '이번 달 매출 현황을 분석해줘' },
  { id: 'promotion',    label: '홍보 문구 초안',  emoji: '📢', prompt: '인스타그램용 업체 홍보 문구를 작성해줘' },
  { id: 'analytics',   label: '경쟁사 비교',     emoji: '📊', prompt: '같은 카테고리 경쟁 업체와 비교해줘' },
  { id: 'review',       label: '리뷰 관리',      emoji: '⭐', prompt: '최근 리뷰를 요약하고 개선점을 알려줘' },
  { id: 'contract',     label: '계약서 검토',     emoji: '📄', prompt: '업로드된 계약서를 검토해줘' },
];
