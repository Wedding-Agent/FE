import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BOARD_TAGS, BOARD_TAG_COLORS } from '@/types/board'
import type { BoardTag } from '@/types/board'

type Props = {
  open: boolean
  onToggleOpen: () => void
  selected: BoardTag[]
  onChangeSelected: (next: BoardTag[]) => void
  max?: number
}

export default function BoardTagFilter({ open, onToggleOpen, selected, onChangeSelected, max = 3 }: Props) {
  const handleToggle = (tag: BoardTag) => {
    if (selected.includes(tag)) {
      onChangeSelected(selected.filter((t) => t !== tag))
    } else if (selected.length < max) {
      onChangeSelected([...selected, tag])
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-3 py-2">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-700"
      >
        <span>
          태그 필터
          {selected.length > 0 && (
            <span className="ml-2 text-xs font-normal text-rose-500">({selected.length}개 선택)</span>
          )}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {BOARD_TAGS.map((tag) => {
              const active = selected.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggle(tag)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium border transition',
                    active
                      ? BOARD_TAG_COLORS[tag] + ' border-transparent'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
                  )}
                >
                  {tag}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-gray-400">최대 {max}개까지 선택할 수 있어요.</p>
        </div>
      )}
    </section>
  )
}
