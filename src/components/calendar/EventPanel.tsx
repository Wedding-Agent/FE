'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { CalendarEvent } from '@/types/calendar';
import {
  CATEGORY_COLOR,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatDateLabel,
} from '@/types/calendar';
import styles from './EventPanel.module.css';

interface EventPanelProps {
  dateKey: string | null;
  events: CalendarEvent[];
  isDeleting: boolean;
  onAdd: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export function EventPanel({
  dateKey,
  events,
  isDeleting,
  onAdd,
  onEdit,
  onDelete,
}: EventPanelProps) {
  if (!dateKey) return null;

  return (
    <div className={styles.panel}>
      {/* 패널 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.dateLabel}>{formatDateLabel(dateKey)}</h3>
          <span className={styles.count}>
            {events.length > 0 ? `일정 ${events.length}개` : '일정 없음'}
          </span>
        </div>
        <button type="button" className={styles.addBtn} onClick={onAdd} aria-label="일정 추가">
          <Plus size={16} />
          <span>추가</span>
        </button>
      </div>

      {/* 이벤트 목록 */}
      {events.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyEmoji} aria-hidden="true">📅</span>
          <p className={styles.emptyText}>이 날 일정이 없어요</p>
          <button type="button" className={styles.emptyAddBtn} onClick={onAdd}>
            일정 추가하기
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {events.map((ev) => (
            <li key={ev.id} className={styles.item}>
              <span
                className={styles.categoryBar}
                style={{ background: CATEGORY_COLOR[ev.category] }}
                aria-hidden="true"
              />
              <div className={styles.itemBody}>
                <div className={styles.itemTop}>
                  <span className={styles.categoryEmoji} aria-hidden="true">
                    {CATEGORY_EMOJI[ev.category]}
                  </span>
                  <span className={styles.title}>{ev.title}</span>
                  <span
                    className={styles.categoryChip}
                    style={{
                      background: `${CATEGORY_COLOR[ev.category]}18`,
                      color: CATEGORY_COLOR[ev.category],
                    }}
                  >
                    {CATEGORY_LABEL[ev.category]}
                  </span>
                </div>
                {ev.note && <p className={styles.note}>{ev.note}</p>}
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => onEdit(ev)}
                  aria-label="수정"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => onDelete(ev.id)}
                  disabled={isDeleting}
                  aria-label="삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
