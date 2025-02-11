'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
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

// 카테고리 네비게이션 컴포넌트
const CategoryNav = ({ pathname, onItemClick }: { pathname: string, onItemClick?: () => void }) => (
    <nav className="p-6">
        <ul className="space-y-3">
            {categories.map((category) => (
                <li key={category.id} onClick={onItemClick}>
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
);

export default function PostLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pathname = usePathname();
    const { isMobile, isTablet, isDesktop } = useWindowSize();

    const showDrawer = isMobile || isTablet;

    return (
        <div className='min-h-screen bg-[#ffffff] relative'>
            {/* 모바일/태블릿에서만 보이는 햄버거 버튼 */}
            {showDrawer && (
                <button
                    className="fixed bottom-20 left-0 z-50 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_4px_25px_rgba(59,130,246,0.3)]"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                >
                    <Menu 
                        size={22} 
                        color='white' 
                        strokeWidth={2.5}
                        className={`transition-transform duration-300 ${isDrawerOpen ? 'rotate-90' : ''}`}
                    />
                </button>
            )}

            <Container>
                <div className="flex">
                    {/* 데스크탑 고정 사이드바 
                        - Container의 기본 패딩(좌우 1.5rem)만큼 왼쪽으로 이동시키기 위해 -ml-6 추가
                        - 이를 통해 전체 레이아웃의 좌측 한계선에 맞춤
                        - sticky로 스크롤 시에도 고정
                    */}
                    {!showDrawer && (
                        <div className="w-64 border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16 -ml-6">
                            <CategoryNav pathname={pathname} />
                        </div>
                    )}

                    {/* 메인 컨텐츠 영역 */}
                    <div className={`
                        flex-1
                        transition-all
                        duration-300
                        ${showDrawer ? 'w-full py-6' : 'w-[calc(100%-16rem)] p-6'}
                    `}>
                        <div id="posts-root" />
                        <div className="max-w-4xl mx-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </Container>

            {/* 모바일/태블릿용 드로어 
                - Container 밖에 배치하여 전체 화면 너비 사용
                - 화면 전체를 덮는 오버레이와 함께 표시
            */}
            {showDrawer && (
                <CommonDrawer
                    portalTo='posts-root'
                    drawerWidth='100vw'
                    drawerHeight='100vh'
                    position='left'
                    title='카테고리'
                    trigger={<div />}
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    hasOverlay={true}
                    className="border-r border-gray-200"
                >
                    <CategoryNav 
                        pathname={pathname} 
                        onItemClick={() => setIsDrawerOpen(false)}
                    />
                </CommonDrawer>
            )}
        </div>
    );
} 
