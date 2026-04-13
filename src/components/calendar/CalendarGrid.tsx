'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent } from '@/types/calendar';
import { CATEGORY_COLOR, toDateKey } from '@/types/calendar';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  selectedDate: string | null;
  onSelectDate: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarGrid({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const todayKey = toDateKey(new Date());

  // 날짜별 이벤트 맵 (YYYY-MM-DD → CalendarEvent[])
  const eventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((e) => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [events]);

  // 달력 그리드 계산
  const { cells } = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    const cells: Array<{
      dateKey: string;
      day: number;
      isCurrentMonth: boolean;
    }> = [];

    // 앞 공백 (이전 달 날짜)
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = month - 1 === 0 ? 12 : month - 1;
      const y = month - 1 === 0 ? year - 1 : year;
      cells.push({
        dateKey: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        isCurrentMonth: false,
      });
    }

    // 이번 달 날짜
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        dateKey: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        isCurrentMonth: true,
      });
    }

    // 뒤 공백 (다음 달 날짜) — 6주 고정
    const total = Math.ceil(cells.length / 7) * 7;
    let nextDay = 1;
    while (cells.length < total) {
      const m = month + 1 === 13 ? 1 : month + 1;
      const y = month + 1 === 13 ? year + 1 : year;
      cells.push({
        dateKey: `${y}-${String(m).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`,
        day: nextDay++,
        isCurrentMonth: false,
      });
    }

    return { cells };
  }, [year, month]);

  return (
    <div className={styles.wrap}>
      {/* 월 네비게이션 */}
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onPrevMonth}
          aria-label="이전 달"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.monthLabel}>
          {year}년 {month}월
        </h2>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onNextMonth}
          aria-label="다음 달"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className={styles.dayHeader}>
        {DAYS_KO.map((d, i) => (
          <span
            key={d}
            className={`${styles.dayName} ${i === 0 ? styles.sun : ''} ${i === 6 ? styles.sat : ''}`}
          >
            {d}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className={styles.grid}>
        {cells.map(({ dateKey, day, isCurrentMonth }) => {
          const cellEvents = eventMap.get(dateKey) ?? [];
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;

          return (
            <button
              key={dateKey}
              type="button"
              className={[
                styles.cell,
                !isCurrentMonth && styles.otherMonth,
                isToday && styles.today,
                isSelected && styles.selected,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(dateKey)}
              aria-label={`${dateKey} ${cellEvents.length}개 일정`}
            >
              <span className={styles.dayNum}>{day}</span>

              {/* 이벤트 도트 (최대 3개) */}
              {cellEvents.length > 0 && (
                <span className={styles.dots}>
                  {cellEvents.slice(0, 3).map((ev, idx) => (
                    <span
                      key={idx}
                      className={styles.dot}
                      style={{ background: CATEGORY_COLOR[ev.category] }}
                    />
                  ))}
                  {cellEvents.length > 3 && (
                    <span className={styles.dotMore}>+</span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
