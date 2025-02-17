// src/app/guestbook/page.tsx
// 방명록 페이지

'use client'

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useGetGuestbookList } from '@/hooks/guestbooks/useGetGuestbookList';
import { format, subMonths } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';

const GuestbookContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const currentSearch = searchParams.get('search') || '';
    const currentCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sortBy') || 'createdAt';
    const currentOrder = searchParams.get('order') || 'DESC';
    const currentStartDate = searchParams.get('startDate') || '';
    const currentEndDate = searchParams.get('endDate') || '';
    
    const { data, isLoading, error } = useGetGuestbookList({
        page: currentPage,
        limit: 10,
        search: currentSearch,
        category: currentCategory,
        sortBy: currentSort as 'createdAt' | 'viewCount' | 'likeCount',
        order: currentOrder as 'ASC' | 'DESC',
        startDate: currentStartDate,
        endDate: currentEndDate,
    });

    const createQueryString = (updates: Record<string, string>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        
        // 업데이트할 파라미터 적용
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                current.set(key, value);
            } else {
                current.delete(key);
            }
        });

        return current.toString();
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.push(`/guestbook?${createQueryString({ search, page: '1' })}`);
    };

    const handleCategoryChange = (category: string) => {
        router.push(`/guestbook?${createQueryString({ category, page: '1' })}`);
    };

    const handleSortChange = (sortBy: string) => {
        const newOrder = sortBy === currentSort && currentOrder === 'DESC' ? 'ASC' : 'DESC';
        router.push(`/guestbook?${createQueryString({ sortBy, order: newOrder })}`);
    };

    const handlePageChange = (page: number) => {
        // 스크롤 위치 초기화가 필요한 경우
        // window.scrollTo(0, 0);
        router.push(`/guestbook?${createQueryString({ page: page.toString() })}`);
    };

    const handleDateChange = (startDate: string, endDate: string) => {
        router.push(`/guestbook?${createQueryString({ startDate, endDate, page: '1' })}`);
    };

    console.log('방명록 데이터:', data);
    console.log('로딩 상태:', isLoading);
    console.log('에러:', error);
    
    if (error) {
        return <div>에러가 발생했습니다: {error.message}</div>;
    }
    
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-12 border-b border-black pb-4">방명록</h1>
            
            {/* 검색 및 필터 영역 */}
            <div className="mb-6 flex flex-wrap gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="search"
                            defaultValue={currentSearch}
                            placeholder="검색어를 입력하세요"
                            className="flex-1 px-4 py-2 border rounded-md"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                        >
                            검색
                        </button>
                    </div>
                </form>

                {/* 기간 검색 추가 */}
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={currentStartDate}
                        onChange={(e) => handleDateChange(e.target.value, currentEndDate)}
                        className="px-3 py-2 border rounded-md"
                    />
                    <span>~</span>
                    <input
                        type="date"
                        value={currentEndDate}
                        onChange={(e) => handleDateChange(currentStartDate, e.target.value)}
                        className="px-3 py-2 border rounded-md"
                    />
                    {/* 기간 단축 버튼 */}
                    <div className="flex gap-2 ml-2">
                        <button
                            onClick={() => {
                                const end = new Date();
                                const start = subMonths(end, 1);
                                handleDateChange(
                                    format(start, 'yyyy-MM-dd'),
                                    format(end, 'yyyy-MM-dd')
                                );
                            }}
                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        >
                            1개월
                        </button>
                        <button
                            onClick={() => {
                                const end = new Date();
                                const start = subMonths(end, 3);
                                handleDateChange(
                                    format(start, 'yyyy-MM-dd'),
                                    format(end, 'yyyy-MM-dd')
                                );
                            }}
                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        >
                            3개월
                        </button>
                    </div>
                </div>

                <select
                    value={currentCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                >
                    <option value="">전체 카테고리</option>
                    <option value="일반">일반</option>
                    <option value="문의">문의</option>
                    <option value="칭찬">칭찬</option>
                    <option value="제안">제안</option>
                </select>
            </div>

            {/* 정렬 옵션 */}
            <div className="mb-4 flex gap-4">
                <button
                    onClick={() => handleSortChange('createdAt')}
                    className={`text-sm ${currentSort === 'createdAt' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                >
                    최신순 {currentSort === 'createdAt' && (currentOrder === 'DESC' ? '↓' : '↑')}
                </button>
                <button
                    onClick={() => handleSortChange('viewCount')}
                    className={`text-sm ${currentSort === 'viewCount' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                >
                    조회순 {currentSort === 'viewCount' && (currentOrder === 'DESC' ? '↓' : '↑')}
                </button>
                <button
                    onClick={() => handleSortChange('likeCount')}
                    className={`text-sm ${currentSort === 'likeCount' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                >
                    좋아요순 {currentSort === 'likeCount' && (currentOrder === 'DESC' ? '↓' : '↑')}
                </button>
            </div>

            <div className="w-full">
                {isLoading ? (
                    <div className="text-center py-8">로딩중...</div>
                ) : (
                    <div>
                        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                            <div className='border-b border-gray-200 bg-gray-50 hidden md:flex justify-between px-6 py-3 font-medium text-gray-600'>
                                <div className='flex-1'>제목</div>
                                <div className='w-24 text-center'>작성자</div>
                                <div className='w-20 text-center'>조회수</div>
                                <div className='w-20 text-center'>좋아요</div>
                                <div className='w-28 text-center'>일자</div>
                            </div>
                            
                            {data?.posts.map((post) => (
                                <div 
                                    key={post.public_id} 
                                    className='border-b border-gray-100 hover:bg-gray-50 cursor-pointer'
                                >
                                    {/* 데스크톱 뷰 */}
                                    <div className='hidden md:flex justify-between px-6 py-4'>
                                        <div className='flex-1'>
                                            <Link 
                                                // href={`/guestbook/${encodeURIComponent(post.title)}-${post.public_id}`}
                                                href={`/guestbook/${post.slug}-${post.public_id}`}
                                                className='text-blue-600 hover:underline flex items-center gap-2'
                                            >
                                                {post.isSecret && (
                                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">비밀글</span>
                                                )}
                                                {post.title}
                                            </Link>
                                        </div>
                                        <div className='w-24 text-center text-gray-600'>{post.author_display_name}</div>
                                        <div className='w-20 text-center text-gray-600'>{post.viewCount}</div>
                                        <div className='w-20 text-center text-gray-600'>{post.likeCount}</div>
                                        <div className='w-28 text-center text-gray-600'>
                                            {format(new Date(post.createdAt), 'yyyy-MM-dd')}
                                        </div>
                                    </div>

                                    {/* 모바일 뷰 */}
                                    <div className='md:hidden p-4'>
                                        <Link 
                                            href={`/guestbook/${post.slug}-${post.public_id}`}
                                            className='block'
                                        >
                                            <div className='text-blue-600 font-medium hover:underline flex items-center gap-2'>
                                                {post.isSecret && (
                                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">비밀글</span>
                                                )}
                                                {post.title}
                                            </div>
                                            <div className='mt-1 text-sm text-gray-500 flex gap-3'>
                                                <span>{post.author_display_name}</span>
                                                <span>조회 {post.viewCount}</span>
                                                <span>좋아요 {post.likeCount}</span>
                                                <span>{format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link href="/guestbook/write">
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-600 transition-colors">
                                    방명록 작성
                                </button>
                            </Link>
                        </div>

                        {/* 페이지네이션 */}
                        {data?.meta && (
                            <div className="mt-6 flex justify-center gap-2">
                                {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-md ${
                                            currentPage === page 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

const Guestbook: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GuestbookContent />
        </Suspense>
    );
};

export default Guestbook;