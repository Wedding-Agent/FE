'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, PenSquare } from 'lucide-react';
import { usePostList, usePostSearch } from '@/features/community/hooks';
import { PostCard } from '@/components/community/PostCard';
import { SortTabs } from '@/components/community/SortTabs';
import { TagFilter } from '@/components/community/TagFilter';
import type { CommunitySort, CommunityTag } from '@/types/community';
import styles from './page.module.css';

const MAX_RECENT = 10;
const STORAGE_KEY = 'community_recent_searches';

function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}
function saveRecent(list: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
}

export default function CommunityPage() {
  const router = useRouter();
  const [sort, setSort]               = useState<CommunitySort>('LATEST');
  const [tags, setTags]               = useState<CommunityTag[]>([]);
  const [showSearch, setShowSearch]   = useState(false);
  const [searchKw, setSearchKw]       = useState('');
  const [recentSearches, setRecent]   = useState<string[]>([]);
  const sentinelRef                    = useRef<HTMLDivElement>(null);
  const searchInputRef                 = useRef<HTMLInputElement>(null);

  // ── List query ──────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostList(sort, tags);

  // ── Search query ────────────────────────────────────────────────
  const { data: searchData, isFetching: isSearching } = usePostSearch(searchKw);

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];
  const searchPosts = searchData?.pages.flatMap((p) => p.posts) ?? [];

  // ── Infinite scroll sentinel ────────────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Search open ─────────────────────────────────────────────────
  const openSearch = () => {
    setRecent(loadRecent());
    setShowSearch(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchKw('');
  };

  const handleSearchSubmit = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    setSearchKw(trimmed);
    const updated = [trimmed, ...recentSearches.filter((r) => r !== trimmed)];
    setRecent(updated);
    saveRecent(updated);
  };

  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          {/* Header */}
          <div className={styles.headerBar}>
            <div className={styles.titleArea}>
              <h1 className={styles.pageTitle}>웨딩 커뮤니티</h1>
              <p className={styles.pageSub}>커플들의 이야기를 나눠요</p>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.searchBtn}
                onClick={openSearch}
                aria-label="검색"
              >
                <Search size={15} />
              </button>
              <button
                type="button"
                className={styles.writeBtn}
                onClick={() => router.push('/couple/community/new')}
              >
                <PenSquare size={15} />
                글쓰기
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.controlRow}>
              <SortTabs value={sort} onChange={setSort} />
            </div>
            <TagFilter selected={tags} onChange={setTags} />
          </div>

          {/* Post list */}
          {isLoading && (
            <div className={styles.list}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          )}

          {isError && (
            <div className={styles.errorWrap}>
              <p className={styles.errorText}>게시글을 불러오지 못했어요.</p>
              <button type="button" className={styles.retryBtn} onClick={() => refetch()}>
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>💬</div>
              <p className={styles.emptyTitle}>아직 게시글이 없어요</p>
              <p className={styles.emptyDesc}>
                {tags.length > 0
                  ? '선택한 태그의 게시글이 없습니다.'
                  : '첫 번째 게시글을 작성해보세요!'}
              </p>
              <button
                type="button"
                className={styles.emptyBtn}
                onClick={() => router.push('/couple/community/new')}
              >
                글쓰기
              </button>
            </div>
          )}

          {posts.length > 0 && (
            <div className={styles.list}>
              {posts.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} />
              {isFetchingNextPage && (
                <div className={styles.skeletonCard} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Search overlay */}
      {showSearch && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchBar}>
            <input
              ref={searchInputRef}
              type="search"
              className={styles.searchInput}
              placeholder="제목 또는 내용으로 검색..."
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchKw)}
            />
            <button type="button" className={styles.searchClose} onClick={closeSearch}>
              취소
            </button>
          </div>

          {searchKw.length < 2 ? (
            <div className={styles.recentSearches}>
              <p className={styles.recentTitle}>최근 검색어</p>
              <div className={styles.recentList}>
                {recentSearches.length === 0 && (
                  <span className={styles.searchEmpty}>최근 검색어가 없습니다.</span>
                )}
                {recentSearches.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    className={styles.recentChip}
                    onClick={() => { setSearchKw(kw); handleSearchSubmit(kw); }}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.searchResults}>
              {isSearching && <div className={styles.skeletonCard} />}
              {!isSearching && searchPosts.length === 0 && (
                <p className={styles.searchEmpty}>검색 결과가 없습니다.</p>
              )}
              {searchPosts.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
