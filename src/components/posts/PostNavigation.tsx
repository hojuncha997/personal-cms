import Link from 'next/link';
import { useGetPostNavigation } from '@/hooks/posts/useGetPostNavigation';
import { format } from 'date-fns';

interface PostNavigationProps {
    publicId: string;
}

export const PostNavigation = ({ publicId }: PostNavigationProps) => {
    const { data: navigation, isLoading, error } = useGetPostNavigation(publicId);
    
    console.log('Navigation data:', { publicId, navigation, isLoading, error }); // 디버깅용
    
    if (isLoading || !navigation) return null;

    return (
        <div className="border-t border-gray-200 mt-12 pt-8">
            <h3 className="text-lg font-semibold mb-4">같은 주제의 글</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 이전 포스트 */}
                <div className="space-y-4">
                    <h4 className="text-sm text-gray-500">이전 글</h4>
                    {navigation.prev.map((post) => (
                        <Link 
                            key={post.public_id}
                            href={`/posts/${post.slug}-${post.public_id}`}
                            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                                    {post.category}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {format(new Date(post.createdAt), 'yyyy.MM.dd')}
                                </span>
                            </div>
                            <h5 className="font-medium line-clamp-2">{post.title}</h5>
                        </Link>
                    ))}
                </div>

                {/* 다음 포스트 */}
                <div className="space-y-4">
                    <h4 className="text-sm text-gray-500">다음 글</h4>
                    {navigation.next.map((post) => (
                        <Link 
                            key={post.public_id}
                            href={`/posts/${post.slug}-${post.public_id}`}
                            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                                    {post.category}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {format(new Date(post.createdAt), 'yyyy.MM.dd')}
                                </span>
                            </div>
                            <h5 className="font-medium line-clamp-2">{post.title}</h5>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}; 