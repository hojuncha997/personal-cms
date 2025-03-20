import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';

const ProjectHeaderSkeleton = () => (
    <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-16 h-7 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-md animate-pulse flex-1"></div>
        </div>
        <div className="flex gap-4">
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-28 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
    </div>
);

const ProjectContentSkeleton = () => (
    <div className="mt-6 space-y-4">
        {[...Array(5)].map((_, i) => (
            <div 
                key={i} 
                className={`h-4 bg-gray-200 rounded animate-pulse ${
                    i % 2 ? 'w-3/4' : i % 3 ? 'w-1/2' : 'w-full'
                }`}
            ></div>
        ))}
    </div>
);

const RelatedProjectItemSkeleton = () => (
    <div className="flex items-center gap-4 p-2 rounded hover:bg-gray-50">
        <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
        <div className="w-40 ml-4">
            {/* 썸네일 스켈레톤 - 그라데이션 적용 */}
            <div className="w-full h-24 rounded-lg overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-blue-500/30 to-purple-500/30"></div>
            </div>
        </div>
    </div>
);

const ProjectDetailSkeleton = () => {
    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
            <Container className="px-0 sm:px-4">
                <div className="max-w-4xl w-full mx-auto py-4 sm:py-8">
                    <div className="w-full space-y-6">
                        {/* 본문 스켈레톤 */}
                        <div className="bg-white shadow-md">
                            <div className="p-4 sm:p-6">
                                <ProjectHeaderSkeleton />
                                <ProjectContentSkeleton />
                                
                                {/* 좋아요 버튼 스켈레톤 */}
                                <div className="mt-8 border-t pt-4">
                                    <div className="flex justify-center mb-8">
                                        <div className="w-28 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 댓글 섹션 스켈레톤 */}
                        <div className="bg-white shadow-md">
                            <div className="p-4 sm:p-6">
                                <div className="space-y-4">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 관련 포스트 섹션 스켈레톤 */}
                        <div className="bg-white shadow-md">
                            <div className="p-4 sm:p-6">
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <RelatedProjectItemSkeleton key={i} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 네비게이션 섹션 스켈레톤 */}
                        <div className="bg-white shadow-md">
                            <div className="p-4 sm:p-6">
                                <div className="space-y-3">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ProjectDetailSkeleton; 