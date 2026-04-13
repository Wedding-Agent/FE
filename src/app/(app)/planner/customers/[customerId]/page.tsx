'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Calendar, Users, Wallet, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useCustomerDetail, useCreateContract, useUpdateContract, useDeleteContract } from '@/features/planner-customers/hooks';
import { usePlannerCalendarEvents } from '@/features/planner-calendar/hooks';
import { usePlannerVendorContacts } from '@/features/planner-calendar/hooks';
import { VendorContractRow } from '@/components/planner-customers/VendorContractRow';
import { ContractModal } from '@/components/planner-customers/ContractModal';
import type { VendorContract, CreateContractInput } from '@/types/planner-customers';
import { calcDDay, CATEGORY_EMOJI, CATEGORY_COLOR } from '@/types/calendar';
import styles from './page.module.css';

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; contract: VendorContract }
  | null;

function formatDDay(dday: number): string {
  if (dday === 0) return 'D-Day';
  if (dday > 0) return `D-${dday}`;
  return `D+${Math.abs(dday)}`;
}

function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${Number(m)}월 ${Number(d)}일`;
}

function formatBudget(amount: number): string {
  const man = Math.floor(amount / 10_000);
  return `${man.toLocaleString()}만원`;
}

export default function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);

  const { data: customer, isLoading } = useCustomerDetail(customerId);
  const { data: vendors = [] } = usePlannerVendorContacts();

  // 이번달 + 다음달 일정
  const now = new Date();
  const nextMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
  const nextMonthYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

  const { data: thisMonthData } = usePlannerCalendarEvents(now.getFullYear(), now.getMonth() + 1);
  const { data: nextMonthData } = usePlannerCalendarEvents(nextMonthYear, nextMonth);

  const relatedEvents = useMemo(() => {
    const all = [
      ...(thisMonthData?.events ?? []),
      ...(nextMonthData?.events ?? []),
    ];
    const todayStr = now.toISOString().slice(0, 10);
    return all
      .filter((e) => e.customerId === customerId && e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
  // eslint-disable-line
  }, [thisMonthData, nextMonthData, customerId]);

  const createContract = useCreateContract(customerId);
  const updateContract = useUpdateContract(customerId);
  const deleteContract = useDeleteContract(customerId);

  const handleSave = (data: CreateContractInput) => {
    if (modal?.mode === 'edit') {
      updateContract.mutate(
        { contractId: modal.contract.id, payload: data },
        { onSuccess: () => setModal(null) },
      );
    } else {
      createContract.mutate(data, { onSuccess: () => setModal(null) });
    }
  };

  const handleDelete = (contractId: string) => {
    if (!confirm('이 계약을 삭제할까요?')) return;
    deleteContract.mutate(contractId);
  };

  if (isLoading || !customer) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button type="button" className={styles.backBtn} onClick={() => router.back()}>
            <ChevronLeft size={22} />
          </button>
        </div>
        <div className={styles.skeletonHero} />
        <div className={styles.skeletonSection} />
      </div>
    );
  }

  const dday = calcDDay(customer.weddingDate);
  const isSaving = createContract.isPending || updateContract.isPending;

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={() => router.back()}>
          <ChevronLeft size={22} />
        </button>
        <h1 className={styles.headerTitle}>{customer.name}</h1>
        <span
          className={styles.ddayBadge}
          style={{
            background: `${customer.color}18`,
            color: customer.color,
          }}
        >
          {formatDDay(dday)}
        </span>
      </div>

      {/* 기본 정보 카드 */}
      <div className={styles.infoCard}>
        <div
          className={styles.infoCardTop}
          style={{ background: `linear-gradient(135deg, ${customer.color}22, ${customer.color}10)` }}
        >
          <span className={styles.colorDot} style={{ background: customer.color }} />
          <span className={styles.infoName}>{customer.name}</span>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <Calendar size={14} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>웨딩일</div>
              <div className={styles.infoValue}>{formatFullDate(customer.weddingDate)}</div>
            </div>
          </div>
          {customer.totalBudget && (
            <div className={styles.infoItem}>
              <Wallet size={14} className={styles.infoIcon} />
              <div>
                <div className={styles.infoLabel}>총 예산</div>
                <div className={styles.infoValue}>{formatBudget(customer.totalBudget)}</div>
              </div>
            </div>
          )}
          {customer.guestCount && (
            <div className={styles.infoItem}>
              <Users size={14} className={styles.infoIcon} />
              <div>
                <div className={styles.infoLabel}>예상 하객</div>
                <div className={styles.infoValue}>{customer.guestCount.toLocaleString()}명</div>
              </div>
            </div>
          )}
          {customer.phone && (
            <div className={styles.infoItem}>
              <span className={styles.infoIconText}>📞</span>
              <div>
                <div className={styles.infoLabel}>연락처</div>
                <div className={styles.infoValue}>{customer.phone}</div>
              </div>
            </div>
          )}
        </div>
        {customer.memo && (
          <div className={styles.infoMemo}>{customer.memo}</div>
        )}
      </div>

      {/* 업체 계약 현황 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>업체 계약 현황</h2>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setModal({ mode: 'create' })}
          >
            <Plus size={14} />
            업체 추가
          </button>
        </div>
        <div className={styles.contractList}>
          {customer.vendors.length === 0 ? (
            <div className={styles.emptyContracts}>
              <p>계약된 업체가 없습니다</p>
              <button
                type="button"
                className={styles.emptyAddBtn}
                onClick={() => setModal({ mode: 'create' })}
              >
                + 첫 번째 업체 추가하기
              </button>
            </div>
          ) : (
            customer.vendors.map((contract) => (
              <VendorContractRow
                key={contract.id}
                contract={contract}
                onEdit={(c) => setModal({ mode: 'edit', contract: c })}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* 관련 일정 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>관련 일정</h2>
          <Link href="/planner/calendar" className={styles.calendarLink}>
            전체 보기 <ExternalLink size={12} />
          </Link>
        </div>

        {relatedEvents.length === 0 ? (
          <div className={styles.emptyEvents}>
            <p>예정된 일정이 없습니다</p>
          </div>
        ) : (
          <div className={styles.eventList}>
            {relatedEvents.map((ev) => (
              <div key={ev.id} className={styles.eventItem}>
                <span
                  className={styles.eventDot}
                  style={{ background: CATEGORY_COLOR[ev.category] }}
                />
                <span className={styles.eventEmoji}>{CATEGORY_EMOJI[ev.category]}</span>
                <span className={styles.eventDate}>{formatShortDate(ev.date)}</span>
                <span className={styles.eventTitle}>{ev.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ContractModal */}
      <ContractModal
        open={modal !== null}
        vendors={vendors}
        editTarget={modal?.mode === 'edit' ? modal.contract : undefined}
        isSaving={isSaving}
        onSave={handleSave}
        onClose={() => setModal(null)}
      />
    </div>
  );
}
