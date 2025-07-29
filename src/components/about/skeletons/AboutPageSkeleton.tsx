import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles';

const ProfileSkeleton = () => (
    <div className="flex flex-col md:flex-row gap-8">
        {/* 프로필 이미지 */}
        <div className="w-full md:w-[200px]">
            <div className="border-[1px] border-gray-200 rounded-xl">
                <div className="w-full h-[200px] bg-gray-200 animate-pulse rounded-xl"></div>
            </div>
        </div>

        {/* 소개 정보 */}
        <div className="flex flex-col flex-1">
            <div className="mb-4 space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>

            <div className="mb-6 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
        </div>
    </div>
);

const SectionSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-4">
        <div className="h-7 bg-gray-200 rounded animate-pulse w-40"></div>
        <div className="space-y-2">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 rounded animate-pulse w-full"></div>
            ))}
        </div>
    </div>
);

const AboutPageSkeleton = () => {
    return (
        <div className={`min-h-screen bg-[${colors.primary.main}]`} style={{backgroundColor: colors.primary.main}}>
            <Container>
                <section className="py-12 max-w-4xl mx-auto">
                    {/* 프로필 섹션 */}
                    <div className="mb-12">
                        <ProfileSkeleton />
                    </div>

                    {/* 기술 스택 섹션 */}
                    <div className="mb-12">
                        <SectionSkeleton count={4} />
                    </div>

                    {/* 경력 섹션 */}
                    <div className="mb-12">
                        <SectionSkeleton count={5} />
                    </div>

                    {/* 프로젝트 섹션 */}
                    <div className="mb-12">
                        <SectionSkeleton count={6} />
                    </div>

                    {/* 교육 섹션 */}
                    <div className="mb-12">
                        <SectionSkeleton count={2} />
                    </div>

                    {/* 자격증 섹션 */}
                    <div className="mb-12">
                        <SectionSkeleton count={2} />
                    </div>
                </section>
            </Container>
        </div>
    );
};

export default AboutPageSkeleton; 