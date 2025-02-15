import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';

const PostItemSkeleton = () => (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
        <div className="flex-1">
            <div className="flex gap-2 mb-2">
                <div className="w-16 h-6 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-md animate-pulse w-1/4"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-3"></div>
            <div className="flex gap-3">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
        <div className="w-40 ml-4">
            <div className="w-full h-24 rounded-lg overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-blue-500/30 to-purple-500/30"></div>
            </div>
        </div>
    </div>
);

const PostListSkeleton = () => {
    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen`} style={{backgroundColor: colors.primary.main}}>
            <Container>
                <div className="bg-white rounded-lg shadow-md">
                    {[...Array(5)].map((_, i) => (
                        <PostItemSkeleton key={i} />
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default PostListSkeleton; 