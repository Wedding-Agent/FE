import { cn } from '@/lib/utils'
import type { BoardSortType } from '@/types/board'

const OPTIONS: { key: BoardSortType; label: string }[] = [
  { key: 'LATEST', label: '최신' },
  { key: 'POPULAR', label: '인기' },
  { key: 'FOLLOWING', label: '팔로잉' },
]

type Props = {
  value: BoardSortType
  onChange: (v: BoardSortType) => void
}

export default function BoardSortTabs({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-semibold transition',
            value === opt.key
              ? 'bg-rose-500 text-white'
              : 'border border-rose-200 bg-white text-rose-500 hover:bg-rose-50',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
