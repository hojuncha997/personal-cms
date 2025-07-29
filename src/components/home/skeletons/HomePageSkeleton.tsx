import { Container } from '@/components/layouts/Container';
import { theme } from '@/constants/styles/theme';
import { themeClasses } from '@/styles/theme-classes';

const FeaturedPostSkeleton = () => (
    <div className="lg:col-span-8 lg:border-r lg:border-gray-300 lg:pr-8">
        <div className="group">
            <div className={`h-10 w-3/4 mb-4 ${themeClasses.skeleton.base}`}></div>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`h-4 ${themeClasses.skeleton.base}`}></div>
                    ))}
                    <div className={`h-4 w-1/2 mt-3 ${themeClasses.skeleton.base}`}></div>
                </div>
                <div className="col-span-6">
                    <div className={`aspect-[4/3] overflow-hidden ${themeClasses.skeleton.base} ${themeClasses.skeleton.border}`}></div>
                </div>
            </div>
        </div>
    </div>
);

const RecentPostItemSkeleton = () => (
    <div className="pb-6 border-b border-gray-300 last:border-0">
        <div className="flex gap-4">
            <div className="flex-1 space-y-2">
                <div className={`h-5 w-3/4 ${themeClasses.skeleton.base}`}></div>
                <div className={`h-4 w-full ${themeClasses.skeleton.base}`}></div>
                <div className={`h-3 w-1/4 ${themeClasses.skeleton.base}`}></div>
            </div>
            <div className={`w-20 h-20 flex-shrink-0 overflow-hidden ${themeClasses.skeleton.base} ${themeClasses.skeleton.border}`}></div>
        </div>
    </div>
);

const GridPostItemSkeleton = () => (
    <div>
        <div className={`aspect-[16/10] mb-3 overflow-hidden ${themeClasses.skeleton.base} ${themeClasses.skeleton.border}`}></div>
        <div className="space-y-2">
            <div className={`h-5 w-3/4 ${themeClasses.skeleton.base}`}></div>
            <div className={`h-4 w-full ${themeClasses.skeleton.base}`}></div>
            <div className={`h-3 w-1/4 ${themeClasses.skeleton.base}`}></div>
        </div>
    </div>
);

const HomePageSkeleton = () => {
    return (
        <div className="bg-white text-black">
            <Container>
                <div className="py-6">
                    {/* 메인 섹션 */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
                        <FeaturedPostSkeleton />
                        
                        {/* 우측 서브 뉴스 영역 */}
                        <div className="lg:col-span-4">
                            <div className={`h-7 w-32 mb-4 border-b border-gray-300 pb-2 ${themeClasses.skeleton.base}`}></div>
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <RecentPostItemSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 하단 뉴스 그리드 */}
                    <div>
                        <div className={`h-7 w-32 mb-6 border-b border-gray-300 pb-2 ${themeClasses.skeleton.base}`}></div>
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