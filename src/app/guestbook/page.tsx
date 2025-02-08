// src/app/guestbook/page.tsx
// 방명록 페이지

'use client'

import Link from 'next/link';
import { useGetGuestbookList } from '@/hooks/guestbooks/useGetGuestbookList';
import { format } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Guestbook() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    
    const { data, isLoading, error } = useGetGuestbookList({
        page: currentPage,
        limit: 10
    });

    const handlePageChange = (page: number) => {
        router.push(`/guestbook?page=${page}`);
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