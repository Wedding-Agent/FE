export interface CursorPage<T> {
  content: T[]
  nextCursor: string | null
  hasNext: boolean
  size: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  last: boolean
}
