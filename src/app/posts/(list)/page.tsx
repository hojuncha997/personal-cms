// src/app/posts/page.tsx
// 게시글 페이지

'use client'

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useGetPostList } from '@/hooks/posts/useGetPostList';
import { format, subMonths } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { extractTextFromContent } from '@/utils/postUtils'
import { PostForList, PostListResponse } from '@/types/posts/postTypes';
import PostListSkeleton from '@/components/posts/skeletons/PostListSkeleton';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore'
import { AdminGuard } from '@/components/auth/AdminGuard';
import { logger } from '@/utils/logger';
import { User } from 'lucide-react';
import Accordion from '@/components/common/Accordion';
import FilterContent from '@/components/common/FilterContent';
import { useGetPostCategories, PostCategory } from '@/hooks/posts/useGetPostCategories';

const PostContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, role, loading } = useAuthStore();
    const { data: rawCategories } = useGetPostCategories();
    
    // searchState를 useMemo로 최적화
    const searchState = useMemo(() => ({
        page: Number(searchParams.get('page')) || 1,
        search: searchParams.get('search') || '',
        categorySlug: searchParams.get('categorySlug') || '',
        sort: searchParams.get('sortBy') || 'createdAt',
        order: searchParams.get('order') || 'DESC',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || ''
    }), [searchParams]);

    // createQueryString 함수를 useCallback으로 최적화
    const createQueryString = useCallback((updates: Record<string, string>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                current.set(key, value);
            } else {
                current.delete(key);
            }
        });

        return current.toString();
    }, [searchParams]);

    // 로컬 상태도 URL 파라미터에서 초기값을 가져오도록 수정
    const [localSort, setLocalSort] = useState(searchParams.get('sortBy') || 'createdAt');
    const [localOrder, setLocalOrder] = useState(searchParams.get('order') || 'DESC');
    const [localStartDate, setLocalStartDate] = useState(searchParams.get('startDate') || '');
    const [localEndDate, setLocalEndDate] = useState(searchParams.get('endDate') || '');
    const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
    const [localCategory, setLocalCategory] = useState(searchParams.get('categorySlug') || '');

    // 두 번째 useEffect 최적화 - 한 번에 모든 로컬 상태 업데이트
    useEffect(() => {
        const updates = {
            sort: searchState.sort,
            order: searchState.order,
            startDate: searchState.startDate,
            endDate: searchState.endDate,
            search: searchState.search,
            categorySlug: searchState.categorySlug
        };

        // 실제 변경사항이 있을 때만 상태 업데이트
        if (localSort !== updates.sort) setLocalSort(updates.sort);
        if (localOrder !== updates.order) setLocalOrder(updates.order);
        if (localStartDate !== updates.startDate) setLocalStartDate(updates.startDate);
        if (localEndDate !== updates.endDate) setLocalEndDate(updates.endDate);
        if (localSearch !== updates.search) setLocalSearch(updates.search);
        if (localCategory !== updates.categorySlug) setLocalCategory(updates.categorySlug);
    }, [searchState]);

    // useGetPostList 호출 전에 searchState 값 확인
    useEffect(() => {
        logger.info('searchState:', searchState);
    }, [searchState]);

    logger.info('useGetPostList params:', {
        page: searchState.page,
        limit: 10,
        search: searchState.search,
        categorySlug: searchState.categorySlug,
        sortBy: searchState.sort,
        order: searchState.order,
        startDate: searchState.startDate,
        endDate: searchState.endDate,
    });

    // useGetPostList 직접 호출
    const { data, isLoading, error } = useGetPostList({
        page: searchState.page,
        limit: 10,
        search: searchState.search,
        categorySlug: searchState.categorySlug,
        sortBy: searchState.sort as 'createdAt' | 'viewCount' | 'likeCount',
        order: searchState.order as 'ASC' | 'DESC',
        startDate: searchState.startDate,
        endDate: searchState.endDate,
    });

    // 데이터 처리 결과를 useMemo로 최적화
    const processedData = useMemo(() => {
        if (!data) return null;
        return {
            data: data.data,
            meta: data.meta
        };
    }, [data]);

    // 핸들러 함수들을 useCallback으로 최적화
    const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // 모든 필터 옵션을 한 번에 적용
        router.push(`/posts?${createQueryString({
            search: localSearch,
            sortBy: localSort,
            order: localOrder,
            startDate: localStartDate,
            endDate: localEndDate,
            categorySlug: localCategory,
            page: '1'
        })}`);
    }, [router, createQueryString, localSearch, localSort, localOrder, localStartDate, localEndDate, localCategory]);

    const handleCategoryChange = (category: string) => {
        setLocalCategory(category);
    };

    const handleSortChange = useCallback((sortBy: string) => {
        const newOrder = sortBy === localSort && localOrder === 'DESC' ? 'ASC' : 'DESC';
        setLocalSort(sortBy);
        setLocalOrder(newOrder);
    }, [localSort, localOrder]);

    const handlePageChange = (page: number) => {
        // 스크롤 위치 초기화가 필요한 경우
        // window.scrollTo(0, 0);
        router.push(`/posts?${createQueryString({ page: page.toString() })}`);
    };

    const handleDateChange = (startDate: string, endDate: string) => {
        setLocalStartDate(startDate);
        setLocalEndDate(endDate);
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // useEffect를 사용하여 데이터가 실제로 변경될 때만 로그 출력
    useEffect(() => {
        logger.info('포스팅 데이터 업데이트:', data);
        logger.info('로딩 상태 변경:', isLoading);
        logger.info('에러 상태:', error);
    }, [data, isLoading, error]);

    // 카테고리 데이터 가공
    const processCategories = (categories: PostCategory[] = []): Array<{ value: string; label: string }> => {
        const result: Array<{ value: string; label: string }> = [];
        
        const processCategory = (category: PostCategory, parentPath?: string) => {
            if (!category.children?.length) {
                // 자식이 없는 경우 현재 카테고리만 추가
                result.push({
                    value: category.slug,
                    label: parentPath ? `${parentPath}/${category.name}` : category.name
                });
                return;
            }
            
            // 자식이 있는 경우 각 자식에 대해 처리
            category.children.forEach(child => {
                const currentPath = parentPath ? `${parentPath}/${category.name}` : category.name;
                processCategory(child, currentPath);
            });
        };

        categories.forEach(category => processCategory(category));
        return result;
    };

    const processedCategories = useMemo(() => {
        return processCategories(rawCategories);
    }, [rawCategories]);

    if (isLoading) {
        return <PostListSkeleton />;
    }

    if (!data) {
        return <div className="text-center py-8">데이터를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="w-full">
            {/* <h1 className="text-3xl font-bold mb-12 border-b border-black pb-4">포스팅</h1> */}
            
            {/* 아코디언 필터 영역 */}
            <Accordion title="검색 및 정렬 옵션">
                <FilterContent
                    searchValue={localSearch}
                    onSearchChange={setLocalSearch}
                    onSearchSubmit={handleSearch}
                    sortValue={localSort}
                    orderValue={localOrder}
                    onSortChange={handleSortChange}
                    startDate={localStartDate}
                    endDate={localEndDate}
                    onDateChange={handleDateChange}
                    categoryValue={localCategory}
                    onCategoryChange={handleCategoryChange}
                    categories={processedCategories}
                />
            </Accordion>

            <div className="w-full">
                <div>
                    <div className='bg-white rounded-lg overflow-hidden'>
                        {data.data.length === 0 ? (
                            <div className='text-center py-20 text-gray-500'>
                                <p className='text-lg font-medium'>등록된 포스팅이 없습니다.</p>
                            </div>
                        ) : (
                            data.data.map((post: PostForList) => (
                                <Link 
                                    key={post.public_id}
                                    href={`/posts/${post.slug}-${post.public_id}`}
                                    className='block border-b border-b-gray-300 cursor-pointer py-4 group'
                                >
                                    <div className='flex items-center'>
                                        <div className='flex-1'>
                                            <div className='text-lg font-medium text-black group-hover:text-blue-500 flex items-center gap-2 mb-2'>
                                                {post.isSecret && (
                                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">비밀글</span>
                                                )}
                                                {post.title}
                                            </div>
                                            {/* 본문 미리보기 */}
                                            {post.excerpt && (
                                                <div className='text-sm text-gray-600 mb-2 line-clamp-2'>
                                                    {post.excerpt}
                                                </div>
                                            )}
                                            <div className='text-sm text-gray-500 flex flex-wrap gap-4'>
                                                <span className='px-2 py-1 bg-gray-100 text-sm rounded-md'>{post.categorySlug || 'no category'}</span>
                                                <div className="flex items-center gap-2">
                                                    {post.author_profile_image ? (
                                                        <Image
                                                            src={post.author_profile_image}
                                                            alt="작성자 프로필"
                                                            width={20}
                                                            height={20}
                                                            className="rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="w-3 h-3 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <span>{post.current_author_name?.includes('@') ? post.current_author_name.split('@')[0] : post.current_author_name}</span>
                                                </div>
                                                <span>조회 {post.viewCount}</span>
                                                <span>좋아요 {post.likeCount}</span>
                                                <span>{format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
                                            </div>
                                        </div>
                                        <div className='w-40 ml-4'>
                                            {/* 썸네일 영역 */}
                                            <div className={`w-full h-24 rounded-lg overflow-hidden ${!post.thumbnail ? 'bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-2' : ''}`}>
                                                {post.thumbnail ? (
                                                    <Image 
                                                        src={post.thumbnail} 
                                                        alt={post.title}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white text-sm font-medium text-center line-clamp-2">
                                                        {post.title}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* 페이지네이션 */}
                    {data.meta && (
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-md ${
                                        searchState.page === page 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 flex justify-end">
                        {!loading && (  // 로딩이 완료된 후에만 AdminGuard를 렌더링
                            <AdminGuard>
                                <Link href="/posts/write">
                                    <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-600 transition-colors">
                                        게시글 작성
                                    </button>
                                </Link>
                            </AdminGuard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Post: React.FC = () => {
    return (
        <Suspense fallback={<PostListSkeleton />}>
            <PostContent />
        </Suspense>
    );
};

export default Post;