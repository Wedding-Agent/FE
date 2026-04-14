'use client';

import { useState } from 'react';
import { useProfile, useUpdateNickname, useLogout, useDeleteAccount } from '@/features/profile/hooks';
import { ProviderBadge } from '@/components/profile/ProviderBadge';
import { ROLE_LABEL } from '@/types/auth';
import styles from './page.module.css';

// 업체 전용 Mock 추가 정보
const VENDOR_EXTRA = {
  businessName: '스튜디오 루나',
  category: '사진·영상 촬영',
  location: '서울 강남구',
  description: '자연스럽고 감성적인 웨딩 사진·영상을 담아드립니다.',
};

export default function VendorProfilePage() {
  const { data: profile, isLoading } = useProfile('vendor');
  const updateNickname = useUpdateNickname();
  const logout = useLogout();
  const deleteAccount = useDeleteAccount();

  const [nicknameInput, setNicknameInput] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const handleNicknameSave = () => {
    if (!nicknameInput.trim()) return;
    updateNickname.mutate(nicknameInput.trim(), {
      onSuccess: () => {
        setIsEditingNickname(false);
        setNicknameInput('');
      },
    });
  };

  const handleDeleteAccount = () => {
    if (!confirm('정말로 탈퇴하시겠어요?\n모든 데이터가 삭제되며 복구할 수 없어요.')) return;
    deleteAccount.mutate();
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonWrap}>
          {[1, 2, 3].map((i) => <div key={i} className={styles.skeleton} />)}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '알 수 없음';

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* 프로필 카드 */}
        <section className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {profile.nickname.slice(0, 1)}
            </div>
          </div>
          <div className={styles.nameRow}>
            <h1 className={styles.nickname}>{profile.nickname}</h1>
            {profile.provider && <ProviderBadge provider={profile.provider} />}
          </div>
          <span className={styles.roleChip}>{ROLE_LABEL[profile.role]}</span>
        </section>

        {/* 계정 정보 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>계정 정보</h2>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>이메일</span>
              <span className={styles.infoValue}>{profile.email ?? '—'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>가입일</span>
              <span className={styles.infoValue}>{joinedDate}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>가입 방식</span>
              <span className={styles.infoValue}>
                {profile.provider && <ProviderBadge provider={profile.provider} />}
              </span>
            </div>
          </div>
        </section>

        {/* 업체 전용 정보 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>업체 정보</h2>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>업체명</span>
              <span className={styles.infoValue}>{VENDOR_EXTRA.businessName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>서비스 카테고리</span>
              <span className={styles.infoValue}>{VENDOR_EXTRA.category}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>위치</span>
              <span className={styles.infoValue}>{VENDOR_EXTRA.location}</span>
            </div>
          </div>
          <p className={styles.vendorDesc}>{VENDOR_EXTRA.description}</p>
        </section>

        {/* 닉네임 변경 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>닉네임 변경</h2>
          {isEditingNickname ? (
            <div className={styles.editRow}>
              <input
                type="text"
                className={styles.nicknameInput}
                placeholder={profile.nickname}
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNicknameSave()}
                autoFocus
                maxLength={20}
              />
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleNicknameSave}
                disabled={updateNickname.isPending || !nicknameInput.trim()}
              >
                {updateNickname.isPending ? '저장 중…' : '저장'}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => { setIsEditingNickname(false); setNicknameInput(''); }}
              >
                취소
              </button>
            </div>
          ) : (
            <div className={styles.editRow}>
              <span className={styles.currentNickname}>{profile.nickname}</span>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => setIsEditingNickname(true)}
              >
                변경
              </button>
            </div>
          )}
        </section>

        {/* 로그아웃 / 회원 탈퇴 */}
        <div className={styles.actionGroup}>
          <button type="button" className={styles.logoutBtn} onClick={logout}>
            로그아웃
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDeleteAccount}
            disabled={deleteAccount.isPending}
          >
            {deleteAccount.isPending ? '탈퇴 처리 중…' : '회원 탈퇴'}
          </button>
        </div>

      </main>
    </div>
  );
}
