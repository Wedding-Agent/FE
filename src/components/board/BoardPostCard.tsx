import { Heart, MessageCircle } from 'lucide-react'
import type { BoardPostSummary } from '@/types/board'
import { BOARD_TAG_COLORS } from '@/types/board'

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return '방금 전'
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}일 전`
  return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

type Props = {
  post: BoardPostSummary
  onClick?: (id: number) => void
  onAuthorClick?: (userId: number) => void
}

export default function BoardPostCard({ post, onClick, onAuthorClick }: Props) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(post.id)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(post.id)}
      className="rounded-2xl bg-white px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)] transition-all cursor-pointer"
    >
      {/* 작성자 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAuthorClick?.(post.author.id) }}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-gray-600 overflow-hidden"
        >
          {post.author.profileImageUrl ? (
            <img src={post.author.profileImageUrl} alt={post.author.nickname} className="w-full h-full object-cover" />
          ) : (
            <span>{post.author.nickname.slice(0, 1)}</span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAuthorClick?.(post.author.id) }}
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            {post.author.nickname}
          </button>
          <p className="text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</p>
        </div>
      </div>

      {/* 내용 */}
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{post.contentPreview}</p>
      </div>

      {/* 태그 */}
      <div className="mt-2">
        <span className={`text-[11px] rounded-md px-2 py-0.5 font-medium ${BOARD_TAG_COLORS[post.tag] || 'bg-gray-100 text-gray-600'}`}>
          {post.tag}
        </span>
      </div>

      {/* 통계 */}
      <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-400">
        <div className="flex items-center gap-1">
          <Heart size={13} className={post.liked ? 'fill-rose-400 text-rose-400' : ''} />
          <span>{formatCount(post.likeCount)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={13} />
          <span>{formatCount(post.commentCount)}</span>
        </div>
        <span>{post.viewCount.toLocaleString()} 조회</span>
      </div>
    </article>
  )
}
