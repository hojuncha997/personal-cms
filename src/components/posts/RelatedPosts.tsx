import Link from 'next/link';
import { useGetRelatedPosts } from '@/hooks/posts/useGetRelatedPosts';
import { format } from 'date-fns';
import { PostForList } from '@/types/posts/postTypes';

interface RelatedPostsProps {
    publicId: string;
}

const PostList = ({ posts, title }: { posts: PostForList[], title: string }) => (
    <div className="space-y-3">
        <h4 className="text-sm text-gray-500 font-medium">{title}</h4>
        {posts.map((post) => (
            <Link 
                key={post.public_id}
                href={`/posts/${post.slug}-${post.public_id}`}
                className="block border rounded-lg hover:bg-gray-50 transition-colors"
            >
                <div className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-gray-100 text-xs rounded">
                            {post.category}
                        </span>
                        <span className="text-xs text-gray-500">
                            {format(new Date(post.createdAt), 'yyyy.MM.dd')}
                        </span>
                    </div>
                    <h5 className="font-medium text-sm line-clamp-2 text-gray-900">{post.title}</h5>
                </div>
            </Link>
        ))}
    </div>
);

export const RelatedPosts = ({ publicId }: RelatedPostsProps) => {
    const { data: relatedPosts, isLoading } = useGetRelatedPosts(publicId);
    
    if (isLoading || !relatedPosts) return null;

    return (
        <div>
            <h3 className="text-lg font-semibold mb-6">관련 포스트</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.manual.length > 0 && (
                    <PostList 
                        posts={relatedPosts.manual} 
                        title="추천 포스트" 
                    />
                )}
                
                {relatedPosts.auto.length > 0 && (
                    <PostList 
                        posts={relatedPosts.auto} 
                        title="비슷한 주제의 글" 
                    />
                )}
            </div>
        </div>
    );
}; 