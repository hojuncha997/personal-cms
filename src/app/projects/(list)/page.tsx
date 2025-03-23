// src/app/projects/(list)/page.tsx
// 게시글 페이지

'use client'

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useGetProjectList } from '@/hooks/projects/useGetProjectList';
import { format, subMonths } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { extractTextFromContent } from '@/utils/postUtils'
import { ProjectForList, ProjectListResponse } from '@/types/projects/projectTypes';
import ProjectListSkeleton from '@/components/projects/skeletons/projectListSkeleton';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore'
import { AdminGuard } from '@/components/auth/AdminGuard';
import { logger } from '@/utils/logger';

const ProjectListContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, role, loading } = useAuthStore();
    
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

    // 두 번째 useEffect 최적화 - 한 번에 모든 로컬 상태 업데이트. 개별 상태를 객체로 묶어서 비교하여 불필요한 렌더링 방지
    useEffect(() => {
        const updates = {
            sort: searchState.sort,
            order: searchState.order,
            startDate: searchState.startDate,
            endDate: searchState.endDate,
            search: searchState.search
        };

        // 실제 변경사항이 있을 때만 상태 업데이트
        if (localSort !== updates.sort) setLocalSort(updates.sort);
        if (localOrder !== updates.order) setLocalOrder(updates.order);
        if (localStartDate !== updates.startDate) setLocalStartDate(updates.startDate);
        if (localEndDate !== updates.endDate) setLocalEndDate(updates.endDate);
        if (localSearch !== updates.search) setLocalSearch(updates.search);
    }, [searchState]);

    // useGetPostList 호출 전에 searchState 값 확인
    useEffect(() => {
        logger.info('searchState:', searchState);
    }, [searchState]);

    logger.info('useGetProjectList params:', {
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
    const { data, isLoading, error } = useGetProjectList({
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
        router.push(`/projects?${createQueryString({
            search: localSearch,
            sortBy: localSort,
            order: localOrder,
            startDate: localStartDate,
            endDate: localEndDate,
            page: '1'
        })}`);
    }, [router, createQueryString, localSearch, localSort, localOrder, localStartDate, localEndDate]);

    const handleCategoryChange = (category: string) => {
        router.push(`/projects?${createQueryString({ categorySlug: category, page: '1' })}`);
    };

    const handleSortChange = useCallback((sortBy: string) => {
        const newOrder = sortBy === localSort && localOrder === 'DESC' ? 'ASC' : 'DESC';
        setLocalSort(sortBy);
        setLocalOrder(newOrder);
    }, [localSort, localOrder]);

    const handlePageChange = (page: number) => {
        // 스크롤 위치 초기화가 필요한 경우
        // window.scrollTo(0, 0);
        router.push(`/projects?${createQueryString({ page: page.toString() })}`);
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

    if (isLoading) {
        return <ProjectListSkeleton />;
    }

    if (!data) {
        return <div className="text-center py-8">데이터를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="w-full">
            {/* <h1 className="text-3xl font-bold mb-12 border-b border-black pb-4">포스팅</h1> */}
            
            {/* 아코디언 필터 영역 */}
            <div className="mb-6 border border-gray-200 rounded-lg">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-white rounded-lg hover:bg-gray-50"
                >
                    <span className="font-medium">검색 및 정렬 옵션</span>
                    <ChevronDown 
                        className={`transform transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                        size={20}
                    />
                </button>
                
                {isFilterOpen && (
                    <div className="p-4 border-t border-gray-200">
                        {/* 정렬 옵션 */}
                        <div className="mb-4 flex gap-4">
                            <button
                                onClick={() => handleSortChange('createdAt')}
                                className={`text-sm ${localSort === 'createdAt' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                            >
                                최신순 {localSort === 'createdAt' && (localOrder === 'DESC' ? '↓' : '↑')}
                            </button>
                            <button
                                onClick={() => handleSortChange('viewCount')}
                                className={`text-sm ${localSort === 'viewCount' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                            >
                                조회순 {localSort === 'viewCount' && (localOrder === 'DESC' ? '↓' : '↑')}
                            </button>
                            <button
                                onClick={() => handleSortChange('likeCount')}
                                className={`text-sm ${localSort === 'likeCount' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                            >
                                좋아요순 {localSort === 'likeCount' && (localOrder === 'DESC' ? '↓' : '↑')}
                            </button>
                        </div>

                        {/* 검색 영역 */}
                        <div className="space-y-4">
                            {/* 날짜 선택 영역을 모바일에서 세로로 배치 */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <div className="w-full sm:w-auto">
                                    <label className="block text-sm text-gray-600 mb-1">시작일</label>
                                    <input
                                        type="date"
                                        value={localStartDate}
                                        onChange={(e) => handleDateChange(e.target.value, localEndDate)}
                                        className="w-full sm:w-auto px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <span className="hidden sm:block">~</span>
                                <div className="w-full sm:w-auto">
                                    <label className="block text-sm text-gray-600 mb-1">종료일</label>
                                    <input
                                        type="date"
                                        value={localEndDate}
                                        onChange={(e) => handleDateChange(localStartDate, e.target.value)}
                                        className="w-full sm:w-auto px-3 py-2 border rounded-md"
                                    />
                                </div>
                            </div>
                            
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                    placeholder="검색어를 입력하세요"
                                    className="flex-1 px-4 py-2 border rounded-md"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                >
                                    검색
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full">
                <div>
                    <div className='bg-white rounded-lg overflow-hidden'>
                        {data.data.length === 0 ? (
                            <div className='text-center py-20 text-gray-500'>
                                <p className='text-lg font-medium'>등록된 포스팅이 없습니다.</p>
                            </div>
                        ) : (
                            data.data.map((project: ProjectForList) => (
                                <Link 
                                    key={project.public_id}
                                    href={`/projects/${project.slug}-${project.public_id}`}
                                    className='block border-b border-b-gray-300 cursor-pointer py-4 group'
                                >
                                    <div className='flex items-center'>
                                        <div className='flex-1'>
                                            <div className='text-lg font-medium text-black group-hover:text-blue-500 flex items-center gap-2 mb-2'>
                                                {project.isSecret && (
                                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">비밀글</span>
                                                )}
                                                {project.title}
                                            </div>
                                            {/* 본문 미리보기 */}
                                            {project.excerpt && (
                                                <div className='text-sm text-gray-600 mb-2 line-clamp-2'>
                                                    {project.excerpt}
                                                </div>
                                            )}
                                            <div className='text-sm text-gray-500 flex flex-wrap gap-4'>
                                                <span 
                                                    className='px-2 py-1 bg-gray-100 text-sm rounded-md cursor-pointer hover:bg-gray-200'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleCategoryChange(project.categorySlug || '');
                                                    }}
                                                >
                                                    {project.categorySlug || 'no category'}
                                                </span>
                                                <span>{project.author_display_name.includes('@') ? project.author_display_name.split('@')[0] : project.author_display_name}</span>
                                                <span>조회 {project.viewCount}</span>
                                                <span>좋아요 {project.likeCount}</span>
                                                <span>{format(new Date(project.createdAt), 'yyyy-MM-dd')}</span>
                                            </div>
                                        </div>
                                        <div className='w-40 ml-4'>
                                            {/* 썸네일 영역 */}
                                            <div className={`w-full h-24 rounded-lg overflow-hidden ${!project.thumbnail ? 'bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-2' : ''}`}>
                                                {project.thumbnail ? (
                                                    <Image 
                                                        src={project.thumbnail} 
                                                        alt={project.title}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white text-sm font-medium text-center line-clamp-2">
                                                        {project.title}
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
                                <Link href="/projects/write">
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

const ProjectList: React.FC = () => {
    return (
        <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectListContent />
        </Suspense>
    );
};

export default ProjectList;