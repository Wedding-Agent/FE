'use client';

import { useMemo, useState } from 'react';
import { Search, X, Users } from 'lucide-react';
import { useCustomerList } from '@/features/planner-customers/hooks';
import { usePlannerCalendarEvents } from '@/features/planner-calendar/hooks';
import { CustomerCard } from '@/components/planner-customers/CustomerCard';
import type { CustomerFilter } from '@/types/planner-customers';
import { CUSTOMER_FILTER_LABEL } from '@/types/planner-customers';
import type { PlannerCalendarEvent } from '@/types/planner-calendar';
import styles from './page.module.css';

const FILTERS: CustomerFilter[] = ['all', 'active', 'done'];

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function PlannerCustomersPage() {
  const [filter, setFilter]   = useState<CustomerFilter>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery]     = useState('');

  const { data: customers = [], isLoading } = useCustomerList();

  // 이번달 + 다음달 일정 가져오기
  const now = new Date();
  const nextMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
  const nextMonthYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

  const { data: thisMonthData } = usePlannerCalendarEvents(now.getFullYear(), now.getMonth() + 1);
  const { data: nextMonthData } = usePlannerCalendarEvents(nextMonthYear, nextMonth);

  const allEvents: PlannerCalendarEvent[] = useMemo(() => [
    ...(thisMonthData?.events ?? []),
    ...(nextMonthData?.events ?? []),
  ], [thisMonthData, nextMonthData]);

  // 고객별 다음 일정 계산
  const nextEventMap = useMemo(() => {
    const map: Record<string, PlannerCalendarEvent> = {};
    const todayStr = today.toISOString().slice(0, 10);
    const upcoming = allEvents
      .filter((e) => e.customerId && e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    for (const ev of upcoming) {
      if (ev.customerId && !map[ev.customerId]) {
        map[ev.customerId] = ev;
      }
    }
    return map;
  }, [allEvents]);

  // 필터링
  const filtered = useMemo(() => {
    const todayStr = today.toISOString().slice(0, 10);
    let result = customers;

    if (filter === 'active') {
      result = result.filter((c) => c.weddingDate >= todayStr);
    } else if (filter === 'done') {
      result = result.filter((c) => c.weddingDate < todayStr);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    return result;
  }, [customers, filter, query]);

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>고객 예약 관리</h1>
        <button
          type="button"
          className={styles.searchToggle}
          onClick={() => {
            setShowSearch((p) => !p);
            if (showSearch) setQuery('');
          }}
          aria-label="검색"
        >
          {showSearch ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* 검색바 */}
      {showSearch && (
        <div className={styles.searchBar}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="고객 이름으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button type="button" className={styles.clearBtn} onClick={() => setQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* 필터 탭 */}
      <div className={styles.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={[styles.filterTab, filter === f && styles.filterTabActive].filter(Boolean).join(' ')}
            onClick={() => setFilter(f)}
          >
            {CUSTOMER_FILTER_LABEL[f]}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className={styles.list}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <Users size={36} strokeWidth={1.5} />
            <p>
              {query ? `"${query}" 검색 결과가 없습니다` : '담당 고객이 없습니다'}
            </p>
          </div>
        ) : (
          filtered.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              nextEvent={nextEventMap[customer.id]}
            />
          ))
        )}
      </div>
    </div>
  );
}
