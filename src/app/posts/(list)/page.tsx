// src/app/posts/page.tsx
// 게시글 페이지

'use client'

import Link from 'next/link';
import { useGetPostList } from '@/hooks/posts/useGetPostList';
import { format, subMonths } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// content에서 텍스트만 추출하는 헬퍼 함수 수정
const extractTextFromContent = (content: any) => {
    if (!content?.content) return '';
    
    const fullText = content.content
        .map((block: any) => {
            if (block.type === 'paragraph' && block.content) {
                return block.content
                    .map((item: any) => item.text || '')
                    .join('')
            }
            return '';
        })
        .join('\n')
        .trim();

    const maxLength = 100;
    if (fullText.length <= maxLength) return fullText;
    
    return fullText.slice(0, maxLength).trim() + '...';
};

export default function Post() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // useEffect를 사용하여 클라이언트 사이드에서만 상태를 업데이트
    const [searchState, setSearchState] = useState({
        page: 1,
        search: '',
        category: '',
        sort: 'createdAt',
        order: 'DESC',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        setSearchState({
            page: Number(searchParams.get('page')) || 1,
            search: searchParams.get('search') || '',
            category: searchParams.get('category') || '',
            sort: searchParams.get('sortBy') || 'createdAt',
            order: searchParams.get('order') || 'DESC',
            startDate: searchParams.get('startDate') || '',
            endDate: searchParams.get('endDate') || ''
        });
    }, [searchParams]);

    // 로컬 상태도 searchState에서 가져오도록 수정
    const [localSort, setLocalSort] = useState(searchState.sort);
    const [localOrder, setLocalOrder] = useState(searchState.order);
    const [localStartDate, setLocalStartDate] = useState(searchState.startDate);
    const [localEndDate, setLocalEndDate] = useState(searchState.endDate);
    const [localSearch, setLocalSearch] = useState(searchState.search);

    // useEffect를 사용하여 로컬 상태 업데이트
    useEffect(() => {
        setLocalSort(searchState.sort);
        setLocalOrder(searchState.order);
        setLocalStartDate(searchState.startDate);
        setLocalEndDate(searchState.endDate);
        setLocalSearch(searchState.search);
    }, [searchState]);

    const { data, isLoading, error } = useGetPostList({
        page: searchState.page,
        limit: 10,
        search: searchState.search,
        category: searchState.category,
        sortBy: searchState.sort as 'createdAt' | 'viewCount' | 'likeCount',
        order: searchState.order as 'ASC' | 'DESC',
        startDate: searchState.startDate,
        endDate: searchState.endDate,
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
        
        // 모든 필터 옵션을 한 번에 적용
        router.push(`/posts?${createQueryString({
            search: localSearch,
            sortBy: localSort,
            order: localOrder,
            startDate: localStartDate,
            endDate: localEndDate,
            page: '1'
        })}`);
    };

    const handleCategoryChange = (category: string) => {
        router.push(`/posts?${createQueryString({ category, page: '1' })}`);
    };

    const handleSortChange = (sortBy: string) => {
        const newOrder = sortBy === localSort && localOrder === 'DESC' ? 'ASC' : 'DESC';
        setLocalSort(sortBy);
        setLocalOrder(newOrder);
    };

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

    console.log('방명록 데이터:', data);
    console.log('로딩 상태:', isLoading);
    console.log('에러:', error);
    
    if (error) {
        return <div>에러가 발생했습니다: {error.message}</div>;
    }
    
    return (
        <div className="w-full ">
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
                {isLoading ? (
                    <div className="text-center py-8">로딩중...</div>
                ) : (
                    <div>
                        <div className='bg-white rounded-lg overflow-hidden'>
                            {data?.posts.length === 0 ? (
                                <div className='text-center py-20 text-gray-500'>
                                    <p className='text-lg font-medium'>등록된 포스팅이 없습니다.</p>
                                </div>
                            ) : (
                                data?.posts.map((post) => (
                                    <div 
                                        key={post.public_id} 
                                        className='border-b border-black cursor-pointer py-4 group'
                                    >
                                        <div className='flex items-center'>
                                            <div className='flex-1'>
                                                <Link 
                                                    href={`/posts/${post.slug}-${post.public_id}`}
                                                    className='block'
                                                >
                                                    <div className='text-lg font-medium text-black group-hover:text-blue-500 flex items-center gap-2 mb-2'>
                                                        {post.isSecret && (
                                                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">비밀글</span>
                                                        )}
                                                        {post.title}
                                                    </div>
                                                    {/* 본문 미리보기 추가 */}
                                                    <div className='text-sm text-gray-600 mb-2 line-clamp-2'>
                                                        {extractTextFromContent(post.content)}
                                                    </div>
                                                    <div className='text-sm text-gray-500 flex flex-wrap gap-4'>
                                                        <span>{post.author_display_name.includes('@') ? post.author_display_name.split('@')[0] : post.author_display_name}</span>
                                                        <span>조회 {post.viewCount}</span>
                                                        <span>좋아요 {post.likeCount}</span>
                                                        <span>{format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className='w-40 ml-4'>
                                                {/* 썸네일 영역 */}
                                                <div className='bg-gray-100 w-full h-24 border border-black rounded-lg'>
                                                    {/* 썸네일 이미지가 들어갈 공간 */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* 페이지네이션 */}
                        {data?.meta && (
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
                            <Link href="/posts/write">
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-600 transition-colors">
                                    게시글 작성
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}