'use client'

import { Container } from '@/components/layouts/Container'
import { useGetPostList } from '@/hooks/posts/useGetPostList'
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail'
import Link from 'next/link'
import { PostForList } from '@/types/posts/postTypes'
import Image from 'next/image'

export default function Home() {
  const { data: latestPosts } = useGetPostList({ 
    limit: 1, 
    sortBy: 'createdAt', 
    order: 'DESC' 
  });
  
  const latestPost = latestPosts?.data[0];
  const { data: featuredPost } = useGetPostDetail(
    latestPost?.public_id || '', 
    { enabled: !!latestPost }
  );

  const { data: recentPosts } = useGetPostList({
    limit: 7,
    page: 1,
    sortBy: 'createdAt',
    order: 'DESC'
  });

  return (
    <div className="bg-white text-black ">
      <Container className="">
        <div className="py-6">
          {/* 메인 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6  border-black">
            {/* 메인 뉴스 영역 */}
            {featuredPost && (
              <div className="lg:col-span-8 lg:border-r lg:border-black lg:pr-8">
                <Link href={`/posts/${featuredPost.slug}-${featuredPost.public_id}`}>
                  <div className="group cursor-pointer">
                    <h1 className="text-3xl font-bold mb-4 group-hover:text-blue-600 leading-tight">
                      {featuredPost.title}
                    </h1>
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-6">
                        <p className="text-gray-700 text-base leading-relaxed line-clamp-4 mb-3">
                          {featuredPost.description || featuredPost.excerpt}
                        </p>
                        <div className="text-sm text-gray-500">
                          {featuredPost.current_author_name} • {featuredPost.readingTime}분 읽기
                        </div>
                      </div>
                      {featuredPost.thumbnail ? (
                        <div className="col-span-6">
                          <div className="aspect-[4/3] bg-gray-100 rounded-sm overflow-hidden">
                            <Image 
                              src={featuredPost.thumbnail} 
                              alt={featuredPost.title}
                              width={800}
                              height={600}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="col-span-6">
                          <div className="aspect-[4/3] bg-gray-100 rounded-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* 우측 서브 뉴스 영역 */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b border-black">최신 포스트</h2>
              <div className="space-y-6">
                {recentPosts?.data.slice(1, 3).map((post: PostForList) => (
                  <Link key={post.public_id} href={`/posts/${post.slug}-${post.public_id}`}>
                    <div className="group cursor-pointer pb-6 border-b border-black last:border-0">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-bold group-hover:text-blue-600 line-clamp-2 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                            {post.excerpt}
                          </p>
                          <span className="text-xs text-gray-500">{post.current_author_name}</span>
                        </div>
                        {post.thumbnail ? (
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                            <Image 
                              src={post.thumbnail} 
                              alt={post.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-sm" />
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 뉴스 그리드 */}
          <div>
            <h2 className="text-lg font-bold mb-6 pb-2 border-b border-black">추천 포스트</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts?.data.slice(4).map((post: PostForList, index) => (
                <Link key={post.public_id} href={`/posts/${post.slug}-${post.public_id}`}>
                  <div className="group cursor-pointer">
                    {post.thumbnail ? (
                      <div className="aspect-[16/10] bg-gray-100 rounded-sm overflow-hidden mb-3">
                        <Image 
                          src={post.thumbnail} 
                          alt={post.title}
                          width={400}
                          height={250}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gray-100 rounded-sm mb-3" />
                    )}
                    <h3 className="text-base font-bold group-hover:text-blue-600 line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                      {post.excerpt}
                    </p>
                    <span className="text-xs text-gray-500">{post.current_author_name}</span>
                    {/* 마지막 아이템이 아닐 경우에만 우측 구분선 추가 */}
                    {index !== recentPosts.data.slice(4).length - 1 && (
                      <div className="hidden md:block absolute top-0 right-0 h-full border-r border-black" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
