export type BoardTag =
  | '웨딩홀'
  | '스드메'
  | '신혼여행'
  | '예물'
  | '하객패션'
  | '후기'
  | '웨딩준비'
  | '기타'

export type BoardSortType = 'LATEST' | 'POPULAR' | 'FOLLOWING'

export interface BoardAuthor {
  id: number
  nickname: string
  profileImageUrl?: string | null
}

export interface BoardAttachment {
  id: number
  originalFileName: string
  fileUrl: string
  fileType: string
  fileSize: number
}

export interface BoardPost {
  id: number
  title: string
  content: string
  tag: BoardTag
  author: BoardAuthor
  likeCount: number
  commentCount: number
  viewCount: number
  liked: boolean
  attachments: BoardAttachment[]
  createdAt: string
  updatedAt: string
}

export interface BoardPostSummary {
  id: number
  title: string
  contentPreview: string
  tag: BoardTag
  author: BoardAuthor
  likeCount: number
  commentCount: number
  viewCount: number
  liked: boolean
  thumbnailUrl?: string | null
  createdAt: string
}

export interface BoardComment {
  id: number
  content: string
  author: BoardAuthor
  likeCount: number
  liked: boolean
  replies?: BoardReply[]
  createdAt: string
  updatedAt: string
}

export interface BoardReply {
  id: number
  content: string
  author: BoardAuthor
  likeCount: number
  liked: boolean
  createdAt: string
  updatedAt: string
}

export const BOARD_TAGS: BoardTag[] = [
  '웨딩홀',
  '스드메',
  '신혼여행',
  '예물',
  '하객패션',
  '후기',
  '웨딩준비',
  '기타',
]

export const BOARD_TAG_COLORS: Record<BoardTag, string> = {
  '웨딩홀': 'bg-rose-100 text-rose-700',
  '스드메': 'bg-pink-100 text-pink-700',
  '신혼여행': 'bg-blue-100 text-blue-700',
  '예물': 'bg-yellow-100 text-yellow-700',
  '하객패션': 'bg-purple-100 text-purple-700',
  '후기': 'bg-green-100 text-green-700',
  '웨딩준비': 'bg-orange-100 text-orange-700',
  '기타': 'bg-gray-100 text-gray-700',
}
