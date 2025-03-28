import { Container } from '@/components/layouts/Container';

const FeaturedPostSkeleton = () => (
    <div className="lg:col-span-8 lg:border-r lg:border-gray-200 lg:pr-8">
        <div className="group">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-3"></div>
                </div>
                <div className="col-span-6">
                    <div className="aspect-[4/3] bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
);

const RecentPostItemSkeleton = () => (
    <div className="pb-6 border-b border-gray-200 last:border-0">
        <div className="flex gap-4">
            <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </div>
            <div className="w-20 h-20 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
        </div>
    </div>
);

const GridPostItemSkeleton = () => (
    <div>
        <div className="aspect-[16/10] bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
        </div>
    </div>
);

const HomePageSkeleton = () => {
    return (
        <div className="bg-white text-gray-200">
            <Container>
                <div className="py-6">
                    {/* 메인 섹션 */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 border-gray-200">
                        <FeaturedPostSkeleton />
                        
                        {/* 우측 서브 뉴스 영역 */}
                        <div className="lg:col-span-4">
                            <div className="h-7 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <RecentPostItemSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 하단 뉴스 그리드 */}
                    <div>
                        <div className="h-7 bg-gray-200 rounded animate-pulse w-32 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <GridPostItemSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default HomePageSkeleton; 