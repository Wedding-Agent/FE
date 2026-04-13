export type LlmMessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM'

export interface LlmRoom {
  id: number
  title: string
  lastMessage?: string | null
  createdAt: string
  updatedAt: string
}

export interface LlmMessage {
  id: number
  roomId: number
  role: LlmMessageRole
  content: string
  createdAt: string
}

export interface LlmChatPayload {
  message: string
  roomId?: number
}
