'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/layouts/Container';
import { CommonDrawer } from '@components/common/common-drawer'
import { useWindowSize } from '@/hooks/layout';

const categories = [
    { name: '전체', id: '' },
    { name: '프로그래밍', id: '프로그래밍' },
    { name: '일반', id: '일반' },
    { name: '리뷰', id: '리뷰' },
    { name: '여행', id: '여행' },
    { name: '취미', id: '취미' }
];

export default function PostLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    // const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const { isMobile, isTablet, isDesktop } = useWindowSize();

    useEffect(() => {
        const handleResize = () => {
            setIsDrawerOpen(!isMobile && !isTablet);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='min-h-screen bg-[#f5f5f5] relative '>
            {/* 모바일/태블릿 햄버거 버튼 */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
                {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Container>
                <div className={`flex ${isDesktop ? 'relative' : ''}`}>
                    <CommonDrawer
                        portalTo='posts-root'
                        drawerWidth={isDesktop ? '16rem' : '100vw'}
                        drawerHeight={isDesktop ? 'calc(100vh - 4rem)' : '100vh'}
                        position='left'
                        title='카테고리'
                        trigger={<div />}
                        isOpen={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                        hasOverlay={false}
                        className={`border-[1px] border-black ${isDesktop ? 'absolute left-0 overflow-y-auto' : ''}`}
                        preventScroll={false}
                    >
                        <nav className="p-6">
                            <ul className="space-y-3">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/posts${category.id ? `?category=${category.id}` : ''}`}
                                            className={`block p-2 rounded-md transition-colors
                                                ${pathname === '/posts' && !category.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}
                                            `}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </CommonDrawer>

                    {/* 메인 컨텐츠 */}
                    <div className={`
                        flex-1
                        transition-all
                        duration-300
                        ${isDesktop ? 'p-6' : 'py-6'}
                        ${isDrawerOpen ? 'md:ml-64' : 'ml-0'}
                        overflow-y-auto
                    `}>
                        <div id="posts-root" />
                        <div className="max-w-4xl mx-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </Container>

            {/* 모바일 오버레이 */}
            {/* {isMobile  && isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )} */}
        </div>
    );
} 
