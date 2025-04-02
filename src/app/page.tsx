'use client'

import { Container } from '@/components/layouts/Container'
import { useGetPostList } from '@/hooks/posts/useGetPostList'
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail'
import { useGetProjectList } from '@/hooks/projects/useGetProjectList'
import Link from 'next/link'
import { PostForList } from '@/types/posts/postTypes'
import { ProjectForList } from '@/types/projects/projectTypes'
import Image from 'next/image'
import HomePageSkeleton from '@/components/home/skeletons/HomePageSkeleton'
import { Card, CardContent, CardTitle, Heading } from '@/components/ui'
import { themeClasses } from '@/styles/theme-classes'

export default function Home() {
  const { data: latestPosts, isLoading: isLatestPostsLoading } = useGetPostList({ 
    limit: 1, 
    sortBy: 'createdAt', 
    order: 'DESC' 
  });
  
  const latestPost = latestPosts?.data[0];
  const { data: featuredPost, isLoading: isFeaturedPostLoading } = useGetPostDetail(
    latestPost?.public_id || '', 
    { enabled: !!latestPost }
  );

  const { data: recentPosts, isLoading: isRecentPostsLoading } = useGetPostList({
    limit: 7,
    page: 1,
    sortBy: 'createdAt',
    order: 'DESC'
  });

  const { data: projects, isLoading: isProjectsLoading } = useGetProjectList({
    limit: 3,
    page: 1,
    sortBy: 'createdAt',
    order: 'DESC'
  });

  if (isLatestPostsLoading || isFeaturedPostLoading || isRecentPostsLoading || isProjectsLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="bg-white text-black min-h-screen">
      <Container className="">
        <div className="py-6">
          {/* 메인 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 border-black">
            {/* 메인 뉴스 영역 */}
            {featuredPost && (
              <div className="lg:col-span-8 lg:border-r lg:border-black lg:pr-8">
                <Link href={`/posts/${featuredPost.slug}-${featuredPost.public_id}`}>
                  <div className="group cursor-pointer">
                    <Heading level={1} className="mb-4 group-hover:text-gray-700 leading-tight">
                      {featuredPost.title}
                    </Heading>
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-6">
                        <p className="text-black text-base leading-relaxed line-clamp-4 mb-3">
                          {featuredPost.description || featuredPost.excerpt}
                        </p>
                        <div className="text-sm text-gray-700">
                          {featuredPost.current_author_name} • {featuredPost.readingTime}분 읽기
                        </div>
                      </div>
                      {featuredPost.thumbnail ? (
                        <div className="col-span-6">
                          <div className="aspect-[4/3] bg-gray-100 rounded-sm overflow-hidden border border-black">
                            <Image 
                              src={featuredPost.thumbnail} 
                              alt={featuredPost.title}
                              width={800}
                              height={600}
                              className={`object-cover w-full h-full grayscale-100`}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="col-span-6">
                          <div className="aspect-[4/3] bg-gray-100 rounded-sm border border-black" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* 우측 서브 뉴스 영역 */}
            <div className="lg:col-span-4">
              <Heading level={2} className="mb-4 pb-2 border-b border-black">최신 포스트</Heading>
              <div className="space-y-6">
                {recentPosts?.data.slice(1, 3).map((post: PostForList) => (
                  <Link key={post.public_id} href={`/posts/${post.slug}-${post.public_id}`}>
                    {/* 카드 컴포넌트 사용 : border-0 추가하여 기본 속성 오버라이드 -> 테두리 제거 */}
                    <Card className="cursor-pointer pb-6 border-b border-black last:border-0 shadow-none hover:shadow-none border-0">
                      <CardContent className="p-0">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <CardTitle className="hover:text-gray-700 line-clamp-2 mb-2">
                              {post.title}
                            </CardTitle>
                            <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                              {post.excerpt}
                            </p>
                            <span className="text-xs text-gray-500">{post.current_author_name}</span>
                          </div>
                          {post.thumbnail ? (
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden border border-black">
                              <Image 
                                src={post.thumbnail} 
                                alt={post.title}
                                width={80}
                                height={80}
                                className={`w-full h-full object-cover grayscale-100`}
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-sm border border-black" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 프로젝트 섹션 */}
          <div>
            <Heading level={2} className="mb-6 pb-2 border-b border-black">프로젝트</Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects?.data.map((project: ProjectForList, index) => (
                <Link key={project.public_id} href={`/projects/${project.slug}-${project.public_id}`}>
                  <Card className="cursor-pointer shadow-none hover:shadow-none border-0">
                    <CardContent className="p-0">
                      {project.thumbnail ? (
                        <div className="aspect-[16/10] bg-gray-100 rounded-sm overflow-hidden mb-3 border border-black">
                          <Image 
                            src={project.thumbnail} 
                            alt={project.title}
                            width={400}
                            height={250}
                            className={`object-cover w-full h-full grayscale-100`}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] bg-gray-100 rounded-sm mb-3 border border-black" />
                      )}
                      <CardTitle className="hover:text-gray-700 line-clamp-2 mb-2">
                        {project.title}
                      </CardTitle>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                        {project.excerpt}
                      </p>
                      <span className="text-xs text-gray-500">{project.current_author_name}</span>
                      {/* 마지막 아이템이 아닐 경우에만 우측 구분선 추가 */}
                      {index !== projects.data.length - 1 && (
                        <div className="hidden md:block absolute top-0 right-0 h-full border-r border-black" />
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
