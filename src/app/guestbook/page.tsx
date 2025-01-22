// src/app/guestbook/page.tsx
// 방명록 페이지

'use client'

import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import Link from 'next/link';

const dummyGuestbooks = [
    {
        id: 1,
        title: '정말 멋진 포트폴리오네요!',
        author: '김방문',
        views: 42,
        date: '2024-03-15',
    },
    {
        id: 2,
        title: '프로젝트들이 인상적입니다',
        author: '이개발',
        views: 38,
        date: '2024-03-14',
    },
    {
        id: 3,
        title: '연락드리고 싶습니다',
        author: '박채용',
        views: 56,
        date: '2024-03-13',
    },
];

export default function Guestbook() {
    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
            <Container>
                <div className="max-w-4xl w-full mx-auto py-8">
                    <div className="w-full">
                        <h1 className="text-3xl font-bold mb-12 border-b border-black pb-4">방명록</h1>
                        <div className="w-full">
                            <div>
                                <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                                    <div className='border-b border-gray-200 bg-gray-50 hidden md:flex justify-between px-6 py-3 font-medium text-gray-600'>
                                        <div className='w-12 text-center'><input type='checkbox' className='rounded'/></div>
                                        <div className='w-16 text-center'>순번</div>
                                        <div className='flex-1'>제목</div>
                                        <div className='w-24 text-center'>작성자</div>
                                        <div className='w-20 text-center'>조회수</div>
                                        <div className='w-28 text-center'>일자</div>
                                    </div>
                                    
                                    {dummyGuestbooks.map((guestbook) => (
                                        <div 
                                            key={guestbook.id} 
                                            className='border-b border-gray-100 hover:bg-gray-50 cursor-pointer'
                                        >
                                            {/* 데스크톱 뷰 */}
                                            <div className='hidden md:flex justify-between px-6 py-4'>
                                                <div className='w-12 text-center'><input type='checkbox' className='rounded'/></div>
                                                <div className='w-16 text-center text-gray-600'>{guestbook.id}</div>
                                                <div className='flex-1'>
                                                    <Link 
                                                        href={`/guestbook/${guestbook.id}`} 
                                                        className='text-blue-600 hover:underline'
                                                    >
                                                        {guestbook.title}
                                                    </Link>
                                                </div>
                                                <div className='w-24 text-center text-gray-600'>{guestbook.author}</div>
                                                <div className='w-20 text-center text-gray-600'>{guestbook.views}</div>
                                                <div className='w-28 text-center text-gray-600'>{guestbook.date}</div>
                                            </div>

                                            {/* 모바일 뷰 */}
                                            <div className='md:hidden p-4'>
                                                <div className='flex items-center gap-2'>
                                                    <input type='checkbox' className='rounded'/>
                                                    <span className='text-gray-600'>#{guestbook.id}</span>
                                                </div>
                                                <div className='mt-2'>
                                                    <Link 
                                                        href={`/guestbook/${guestbook.id}`} 
                                                        className='block'
                                                    >
                                                        <div className='text-blue-600 font-medium hover:underline'>{guestbook.title}</div>
                                                        <div className='mt-1 text-sm text-gray-500 flex gap-3'>
                                                            <span>{guestbook.author}</span>
                                                            <span>조회 {guestbook.views}</span>
                                                            <span>{guestbook.date}</span>
                                                        </div>
                                                    </Link>
                                                </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}