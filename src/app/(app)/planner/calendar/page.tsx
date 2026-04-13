'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import type { PlannerCalendarEvent, PlannerFilterType } from '@/types/planner-calendar';
import type { CalendarEvent } from '@/types/calendar';
import { toDateKey } from '@/types/calendar';
import {
  usePlannerCustomers,
  usePlannerVendorContacts,
  usePlannerCalendarEvents,
  useCreatePlannerEvent,
  useUpdatePlannerEvent,
  useDeletePlannerEvent,
} from '@/features/planner-calendar/hooks';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { PlannerFilterBar } from '@/components/planner-calendar/PlannerFilterBar';
import { PlannerEventPanel } from '@/components/planner-calendar/PlannerEventPanel';
import { PlannerEventModal } from '@/components/planner-calendar/PlannerEventModal';
import type { CreatePlannerEventInput } from '@/types/planner-calendar';
import styles from './page.module.css';

export default function PlannerCalendarPage() {
  // ── 현재 보고 있는 연/월 ──────────────────────────────────────────────────
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // ── 선택된 날짜 ───────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<string | null>(toDateKey(now));

  // ── 필터 상태 ─────────────────────────────────────────────────────────────
  const [filterType, setFilterType] = useState<PlannerFilterType>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── 모달 상태 ─────────────────────────────────────────────────────────────
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<PlannerCalendarEvent | undefined>(undefined);

  // ── 쿼리 / 뮤테이션 ──────────────────────────────────────────────────────
  const { data: customersData } = usePlannerCustomers();
  const { data: vendorsData }   = usePlannerVendorContacts();
  const { data: eventsData, isLoading, isError, refetch } = usePlannerCalendarEvents(year, month);

  const createMutation = useCreatePlannerEvent(year, month);
  const updateMutation = useUpdatePlannerEvent(year, month);
  const deleteMutation = useDeletePlannerEvent(year, month);

  const customers = customersData ?? [];
  const vendors   = vendorsData   ?? [];
  const events: PlannerCalendarEvent[] = eventsData?.events ?? [];

  // ── 필터링 ────────────────────────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return events;
    if (filterType === 'customer') {
      return selectedId
        ? events.filter((e) => e.customerId === selectedId)
        : events.filter((e) => !!e.customerId);
    }
    // vendor
    return selectedId
      ? events.filter((e) => e.vendorId === selectedId)
      : events.filter((e) => !!e.vendorId);
  }, [events, filterType, selectedId]);

  // 선택된 날짜의 이벤트
  const selectedEvents = useMemo(
    () => (selectedDate ? filteredEvents.filter((e) => e.date === selectedDate) : []),
    [filteredEvents, selectedDate],
  );

  // ── filterType 변경 시 selectedId 리셋 ───────────────────────────────────
  const handleFilterType = (t: PlannerFilterType) => {
    setFilterType(t);
    setSelectedId(null);
  };

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
  const handleSave = (data: CreatePlannerEventInput) => {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, payload: data },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditTarget(undefined);
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
  const openEdit = (event: PlannerCalendarEvent) => {
    setEditTarget(event);
    setModalOpen(true);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className={styles.page}>
      {/* 필터 바 — sticky */}
      <PlannerFilterBar
        filterType={filterType}
        onFilterType={handleFilterType}
        customers={customers}
        vendors={vendors}
        selectedId={selectedId}
        onSelectId={setSelectedId}
      />

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
              events={filteredEvents as CalendarEvent[]}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPrevMonth={goPrev}
              onNextMonth={goNext}
            />
          </div>
        )}

        {/* 선택 날짜 이벤트 패널 */}
        {selectedDate && (
          <PlannerEventPanel
            dateKey={selectedDate}
            events={selectedEvents}
            customers={customers}
            vendors={vendors}
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
      <PlannerEventModal
        open={modalOpen}
        initialDate={selectedDate ?? toDateKey(new Date())}
        editTarget={editTarget}
        customers={customers}
        vendors={vendors}
        isSaving={isSaving}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setEditTarget(undefined); }}
      />
    </div>
  );
}
