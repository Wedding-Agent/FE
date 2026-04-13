'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import {
  useCalendarEvents,
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent,
  useWeddingInfo,
} from '@/features/calendar/hooks';
import type { CalendarEvent } from '@/types/calendar';
import { toDateKey } from '@/types/calendar';
import { DDayBanner } from '@/components/calendar/DDayBanner';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventPanel } from '@/components/calendar/EventPanel';
import { EventModal } from '@/components/calendar/EventModal';
import styles from './page.module.css';

export default function CalendarPage() {
  // ── 현재 보고 있는 연/월 ──────────────────────────────────────────────────
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // ── 선택된 날짜 ───────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<string | null>(toDateKey(now));

  // ── 모달 상태 ─────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState<CalendarEvent | undefined>(undefined);

  // ── 쿼리 / 뮤테이션 ──────────────────────────────────────────────────────
  const { data: weddingData }          = useWeddingInfo();
  const { data: eventsData, isLoading, isError, refetch } = useCalendarEvents(year, month);

  const createMutation = useCreateEvent(year, month);
  const updateMutation = useUpdateEvent(year, month);
  const deleteMutation = useDeleteEvent(year, month);

  const events: CalendarEvent[] = eventsData?.events ?? [];

  // 선택된 날짜의 이벤트
  const selectedEvents = useMemo(
    () => (selectedDate ? events.filter((e) => e.date === selectedDate) : []),
    [events, selectedDate],
  );

  // ── 월 이동 ───────────────────────────────────────────────────────────────
  const goPrev = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else              setMonth((m) => m - 1);
  };
  const goNext = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else               setMonth((m) => m + 1);
  };

  // ── 오늘로 이동 ───────────────────────────────────────────────────────────
  const goToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth() + 1);
    setSelectedDate(toDateKey(t));
  };

  // ── 이벤트 저장 (추가 or 수정) ───────────────────────────────────────────
  const handleSave = (data: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, payload: data },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditTarget(undefined);
            // 날짜가 바뀐 경우 → 새 날짜 선택
            if (data.date !== selectedDate) setSelectedDate(data.date);
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setModalOpen(false);
          setSelectedDate(data.date);
        },
      });
    }
  };

  // ── 이벤트 삭제 ───────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    if (!confirm('이 일정을 삭제할까요?')) return;
    deleteMutation.mutate(id);
  };

  // ── 추가 모달 열기 ────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(undefined);
    setModalOpen(true);
  };

  // ── 수정 모달 열기 ────────────────────────────────────────────────────────
  const openEdit = (event: CalendarEvent) => {
    setEditTarget(event);
    setModalOpen(true);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className={styles.page}>
      {/* D-Day 배너 */}
      <DDayBanner weddingInfo={weddingData} />

      <div className={styles.scroll}>
        {/* 오늘 버튼 */}
        <div className={styles.todayRow}>
          <button type="button" className={styles.todayBtn} onClick={goToday}>
            <CalendarDays size={13} />
            오늘
          </button>
        </div>

        {/* 캘린더 그리드 */}
        {isError ? (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>일정을 불러오는 데 실패했습니다.</p>
            <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        ) : (
          <div className={isLoading ? styles.loading : ''}>
            <CalendarGrid
              year={year}
              month={month}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPrevMonth={goPrev}
              onNextMonth={goNext}
            />
          </div>
        )}

        {/* 선택 날짜 이벤트 패널 */}
        {selectedDate && (
          <EventPanel
            dateKey={selectedDate}
            events={selectedEvents}
            isDeleting={deleteMutation.isPending}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* FAB */}
      <button type="button" className={styles.fab} onClick={openAdd} aria-label="일정 추가">
        <Plus size={22} />
      </button>

      {/* 이벤트 추가/수정 모달 */}
      <EventModal
        open={modalOpen}
        initialDate={selectedDate ?? toDateKey(new Date())}
        editTarget={editTarget}
        isSaving={isSaving}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setEditTarget(undefined); }}
      />
    </div>
  );
}
