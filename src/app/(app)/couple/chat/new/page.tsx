'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContacts, useCreateChatRoom } from '@/features/chat/hooks';
import type { ChatContact } from '@/types/chat';
import styles from './page.module.css';

const ROLE_LABEL: Record<string, string> = { planner: '플래너', vendor: '업체' };
const ROLE_EMOJI: Record<string, string> = { planner: '📋', vendor: '🏪' };

export default function NewChatPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data, isLoading } = useContacts(query);
  const createRoom = useCreateChatRoom();

  const contacts = data?.contacts ?? [];
  const planners = contacts.filter((c) => c.role === 'planner');
  const vendors  = contacts.filter((c) => c.role === 'vendor');

  const handleSelect = async (contact: ChatContact) => {
    if (createRoom.isPending) return;
    const result = await createRoom.mutateAsync(contact.userId);
    router.push(`/couple/chat/${result.roomId}`);
  };

  const renderContact = (contact: ChatContact) => (
    <button
      key={contact.userId}
      type="button"
      className={styles.contactItem}
      onClick={() => handleSelect(contact)}
      disabled={createRoom.isPending}
    >
      <div className={styles.contactAvatar} aria-hidden="true">
        {ROLE_EMOJI[contact.role] ?? '💬'}
      </div>
      <div className={styles.contactInfo}>
        <p className={styles.contactName}>{contact.nickname}</p>
        <p className={styles.contactMeta}>{ROLE_LABEL[contact.role]}</p>
      </div>
      <span className={`${styles.rolePill} ${styles[`role-${contact.role}`]}`}>
        {ROLE_LABEL[contact.role]}
      </span>
      {contact.existingRoomId && (
        <span className={styles.existingBadge}>대화 중</span>
      )}
    </button>
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => router.back()}
            aria-label="뒤로 가기"
          >
            ←
          </button>
          <div className={styles.headerText}>
            <h1 className={styles.pageTitle}>새 대화</h1>
            <p className={styles.subTitle}>대화할 플래너 또는 업체를 선택하세요</p>
          </div>
        </div>

        {/* 검색 */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="이름으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="연락처 검색"
          />
        </div>

        {isLoading ? (
          <div className={styles.loadingRow}>
            <div className={styles.spinner} aria-label="로딩 중" />
          </div>
        ) : contacts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyTitle}>검색 결과가 없어요</p>
            <p className={styles.emptyDesc}>다른 이름으로 검색해보세요</p>
          </div>
        ) : (
          <>
            {planners.length > 0 && (
              <section>
                <p className={styles.sectionTitle}>플래너</p>
                <div className={styles.list}>{planners.map(renderContact)}</div>
              </section>
            )}
            {vendors.length > 0 && (
              <section>
                <p className={styles.sectionTitle}>업체</p>
                <div className={styles.list}>{vendors.map(renderContact)}</div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
