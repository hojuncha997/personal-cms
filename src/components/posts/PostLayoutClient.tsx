'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Menu, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layouts/Container';
import { CommonDrawer } from '@components/common/common-drawer'
import { useWindowSize } from '@/hooks/layout';
import { useGetPostCategories, PostCategory } from '@/hooks/posts/useGetPostCategories';
import { useCategoryStore } from '@/store/useCategoryStore';
import { CategorySkeleton } from '@/components/ui';
import { theme } from '@/constants/styles/theme';

// CategoryNav 컴포넌트 수정
const CategoryNav = ({ pathname, onItemClick }: { pathname: string, onItemClick?: () => void }) => {
    const { data: categories, isLoading } = useGetPostCategories();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('categorySlug');
    const { expandedCategories, toggleCategory } = useCategoryStore();
    
    if (isLoading) {
        return (
            <nav className="p-6">
                <ul className="space-y-3">
                    <CategorySkeleton count={4} />
                </ul>
            </nav>
        );
    }

    // path 길이가 1인 것이 최상위 카테고리 (예: "1", "4", "5" 등)
    const rootCategories = categories?.filter(cat => cat.path.split('/').length === 1) || [];

    const renderCategory = (category: PostCategory) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.includes(category.id);

        return (
            <li key={category.id}>
                <div className="flex items-center">
                    {hasChildren ? (
                        // 하위 카테고리가 있는 경우: 펼치기/접기 버튼
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className={`flex-1 block p-2 transition-colors text-left
                                ${currentCategory === category.slug ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}
                            `}
                        >
                            <span className="flex items-center gap-2">
                                {category.name}
                                <ChevronRight
                                    size={16}
                                    className={`transform transition-transform duration-200
                                        ${isExpanded ? 'rotate-90' : ''}
                                    `}
                                />
                            </span>
                        </button>
                    ) : (
                        // 하위 카테고리가 없는 경우: 링크로 처리
                        <Link
                            href={`/posts?categorySlug=${category.slug}`}
                            className={`flex-1 block p-2 transition-colors
                                ${currentCategory === category.slug ? 'bg-gray-700 text-white' : 'hover:bg-gray-100'}
                            `}
                            onClick={onItemClick}
                        >
                            {category.name}
                        </Link>
                    )}
                </div>
                {hasChildren && isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-gray-300 pl-2">
                        {category.children?.map((child: PostCategory) => renderCategory(child))}
                    </ul>
                )}
            </li>
        );
    };
    
    return (
        <nav className="p-6">
            <ul className="space-y-3">
                {rootCategories.length === 0 ? (
                    <CategorySkeleton count={3} />
                ) : (
                    <>
                        <li onClick={onItemClick}>
                            <Link
                                href="/posts"
                                className={`block p-2 transition-colors
                                    ${!currentCategory ? 'bg-gray-700 text-white' : 'hover:bg-gray-100'}
                                `}
                            >
                                all
                            </Link>
                        </li>
                        {rootCategories.map(category => renderCategory(category))}
                    </>
                )}
            </ul>
        </nav>
    );
};

export default function PostLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pathname = usePathname();
    const { isMobile, isTablet, isDesktop } = useWindowSize();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 초기 렌더링 시에는 아무것도 보여주지 않음
    if (!mounted) {
        return <div className={`min-h-screen ${theme.card.bg}`}>{children}</div>;
    }

    const showDrawer = isMobile || isTablet;

    return (
        <div className={`min-h-screen ${theme.card.bg} relative`}>
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
                        <div className="w-64 border-r border-gray-700 min-h-[calc(100vh-4rem)] sticky top-16 -ml-6">
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
                    className="border-r border-gray-700"
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
