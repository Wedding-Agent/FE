'use client';

import { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import {
  useBudgetSummary,
  useUpdateBudgetPlan,
  useAddBudgetItem,
  useDeleteBudgetItem,
  useImportFromDocuments,
} from '@/features/budget/hooks';
import { formatKRW } from '@/types/budget';
import { BudgetOverviewCard } from '@/components/budget/BudgetOverviewCard';
import { CategoryBudgetList } from '@/components/budget/CategoryBudgetList';
import { ExpenseTable } from '@/components/budget/ExpenseTable';
import { AddExpenseModal } from '@/components/budget/AddExpenseModal';
import { SetBudgetModal } from '@/components/budget/SetBudgetModal';
import { ImportDocumentModal } from '@/components/budget/ImportDocumentModal';
import styles from './page.module.css';

export default function BudgetPage() {
  const { data: summary, isLoading, isError, refetch } = useBudgetSummary();
  const updatePlanMutation    = useUpdateBudgetPlan();
  const addItemMutation       = useAddBudgetItem();
  const deleteItemMutation    = useDeleteBudgetItem();
  const importMutation        = useImportFromDocuments();

  const [showSetBudget,  setShowSetBudget]  = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showImportDoc,  setShowImportDoc]  = useState(false);

  const unexpected = useMemo(
    () => (summary?.items ?? []).filter((i) => i.isUnexpected),
    [summary?.items],
  );
  const unexpectedTotal = useMemo(
    () => unexpected.reduce((sum, i) => sum + i.amount, 0),
    [unexpected],
  );

  const linkedDocumentIds = useMemo(
    () => new Set((summary?.items ?? []).map((i) => i.documentId).filter(Boolean) as string[]),
    [summary?.items],
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Loading state */}
        {isLoading && (
          <div className={styles.skeleton}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonList} />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className={styles.errorWrap}>
            <p className={styles.errorText}>예산 정보를 불러오지 못했어요.</p>
            <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        )}

        {/* Main content */}
        {summary && (
          <>
            {/* Total overview */}
            <BudgetOverviewCard
              summary={summary}
              onEditBudget={() => setShowSetBudget(true)}
            />

            {/* Category breakdown */}
            <CategoryBudgetList summary={summary} />

            {/* Unexpected expense warning */}
            {unexpected.length > 0 && (
              <div className={styles.alertCard} role="alert">
                <span className={styles.alertIcon}>⚠️</span>
                <div className={styles.alertBody}>
                  <p className={styles.alertTitle}>
                    예상치 못한 지출 {unexpected.length}건
                  </p>
                  <p className={styles.alertDesc}>
                    계획 외 지출이 발생했어요. 총 {formatKRW(unexpectedTotal)} 초과됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* Expense table */}
            <section className={styles.tableSection}>
              <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>지출 내역</h2>
                <button
                  type="button"
                  className={styles.importBtn}
                  onClick={() => setShowImportDoc(true)}
                >
                  <FileText size={13} />
                  문서에서 가져오기
                </button>
              </div>
              <ExpenseTable
                items={summary.items}
                onDelete={(id) => deleteItemMutation.mutate(id)}
                isPendingDelete={deleteItemMutation.isPending}
              />
            </section>

            {/* Modals */}
            <SetBudgetModal
              open={showSetBudget}
              onClose={() => setShowSetBudget(false)}
              currentPlan={summary.plan}
              onSubmit={(plan) => {
                updatePlanMutation.mutate(plan);
                setShowSetBudget(false);
              }}
              isPending={updatePlanMutation.isPending}
            />

            <AddExpenseModal
              open={showAddExpense}
              onClose={() => setShowAddExpense(false)}
              onSubmit={(payload) => {
                addItemMutation.mutate(payload);
                setShowAddExpense(false);
              }}
              isPending={addItemMutation.isPending}
            />

            <ImportDocumentModal
              open={showImportDoc}
              onClose={() => setShowImportDoc(false)}
              onImport={(sel) => {
                importMutation.mutate(sel);
                setShowImportDoc(false);
              }}
              isPending={importMutation.isPending}
              linkedDocumentIds={linkedDocumentIds}
            />
          </>
        )}
      </main>

      {/* FAB — add expense */}
      <button
        type="button"
        className={styles.fab}
        onClick={() => setShowAddExpense(true)}
        disabled={!summary}
        aria-label="지출 추가"
        title="지출 추가"
      >
        +
      </button>
    </div>
  );
}
