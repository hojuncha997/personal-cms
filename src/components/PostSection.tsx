'use client'

import PostCard from './PostCard'
import { Container } from './layouts/Container'
import { useGetPostList } from '@/hooks/posts/useGetPostList'
import { extractTextFromContent } from '@/utils/postUtils'
import { PostForList } from '@/types/posts/postTypes'

export default function PostSection() {
  const { data, isLoading } = useGetPostList({
    page: 1,
    limit: 3,
    sortBy: 'createdAt',
    order: 'DESC',
    status: 'published'
  });

  if (isLoading) {
    return (
      <Container>
        <section className="py-12">
          <h2 className="text-gray-600 text-3xl font-bold mb-8">최신 포스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="py-12">
        <h2 className="text-gray-600 text-3xl font-bold mb-8">최신 포스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((post: PostForList) => (
            <PostCard
              key={post.public_id}
              title={post.title}
              description={post.excerpt || ''}
              date={new Date(post.createdAt).toLocaleDateString()}
              category={post.category || '일반'}
              imageUrl={post.thumbnail || ''}
              slug={`${post.slug}-${post.public_id}`}
            />
          ))}
        </div>
      </section>
    </Container>
  )
} 