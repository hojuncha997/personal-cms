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
import { theme } from '@/constants/styles/theme'

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
    <div className={`${theme.button.secondary.bg} ${theme.button.secondary.text} min-h-screen`}>
      <Container className="">
        <div className="py-6">
          {/* 메인 섹션 */}
          <section className={`mb-12 ${theme.card.border} rounded-lg p-0 overflow-hidden`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* 메인 뉴스 영역 */}
              {featuredPost && (
                <div className="lg:col-span-8 lg:border-r lg:border-black p-6">
                  <Link href={`/posts/${featuredPost.slug}-${featuredPost.public_id}`}>
                    <div className="group cursor-pointer">
                      <Heading level={1} className="mb-4 group-hover:text-gray-700 leading-tight">
                        {featuredPost.title}
                      </Heading>
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-6">
                          <p className={`${theme.button.secondary.text} text-base leading-relaxed line-clamp-4 mb-3`}>
                            {featuredPost.description || featuredPost.excerpt}
                          </p>
                          <div className={`text-sm text-${theme.colors.gray[500]}`}>
                            {featuredPost.current_author_name} • {featuredPost.readingTime}분 읽기
                          </div>
                        </div>
                        {featuredPost.thumbnail ? (
                          <div className="col-span-6">
                            <div className={`aspect-[4/3] bg-${theme.colors.gray[100]} rounded-sm overflow-hidden ${theme.card.border}`}>
                              <Image 
                                src={featuredPost.thumbnail} 
                                alt={featuredPost.title}
                                width={800}
                                height={600}
                                className={themeClasses.image}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="col-span-6">
                            <div className={`aspect-[4/3] bg-${theme.colors.gray[100]} rounded-sm ${theme.card.border}`} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* 우측 서브 뉴스 영역 */}
              <div className="lg:col-span-4 flex flex-col">
                <div className={`${theme.button.primary.bg} ${theme.button.primary.text} p-4 lg:pr-6`}>
                  <Heading level={2} className={`m-0 ${theme.button.primary.text}`}>최신 포스트</Heading>
                </div>
                <div className="space-y-6 p-4 lg:p-6">
                  {recentPosts?.data.slice(1, 3).map((post: PostForList) => (
                    <Link key={post.public_id} href={`/posts/${post.slug}-${post.public_id}`}>
                      {/* 카드 컴포넌트 사용 : border-0 추가하여 기본 속성 오버라이드 -> 테두리 제거 */}
                      <Card className="cursor-pointer pb-6 border-b border-black last:border-0 shadow-none hover:shadow-none border-0">
                        <CardContent className="p-0">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <CardTitle className={`hover:text-${theme.colors.gray[700]} line-clamp-2 mb-2`}>
                                {post.title}
                              </CardTitle>
                              <p className={`text-sm text-${theme.colors.gray[700]} line-clamp-2 mb-1`}>
                                {post.excerpt}
                              </p>
                              <span className={`text-xs text-${theme.colors.gray[500]}`}>{post.current_author_name}</span>
                            </div>
                            {post.thumbnail ? (
                              <div className={`w-20 h-20 flex-shrink-0 bg-${theme.colors.gray[100]} rounded-sm overflow-hidden ${theme.card.border}`}>
                                <Image 
                                  src={post.thumbnail} 
                                  alt={post.title}
                                  width={80}
                                  height={80}
                                  className={themeClasses.image}
                                />
                              </div>
                            ) : (
                              <div className={`w-20 h-20 flex-shrink-0 bg-${theme.colors.gray[100]} rounded-sm ${theme.card.border}`} />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 프로젝트 섹션 */}
          <section className={`${theme.card.border} rounded-lg p-0 overflow-hidden`}>
            <div className={`${theme.button.primary.bg} ${theme.button.primary.text} p-4 lg:p-6`}>
              <Heading level={2} className={`m-0 ${theme.button.primary.text}`}>프로젝트</Heading>
            </div>
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects?.data.map((project: ProjectForList, index) => (
                  <Link key={project.public_id} href={`/projects/${project.slug}-${project.public_id}`}>
                    <Card className={`cursor-pointer shadow-none ${theme.card.hover} border-0`}>
                      <CardContent className="p-0">
                        {project.thumbnail ? (
                          <div className={`aspect-[16/10] bg-${theme.colors.gray[100]} rounded-sm overflow-hidden mb-3 ${theme.card.border}`}>
                            <Image 
                              src={project.thumbnail} 
                              alt={project.title}
                              width={400}
                              height={250}
                              className={themeClasses.image}
                            />
                          </div>
                        ) : (
                          <div className={`aspect-[16/10] bg-${theme.colors.gray[100]} rounded-sm mb-3 ${theme.card.border}`} />
                        )}
                        <CardTitle className={`hover:text-${theme.colors.gray[700]} line-clamp-2 mb-2`}>
                          {project.title}
                        </CardTitle>
                        <p className={`text-sm text-${theme.colors.gray[700]} line-clamp-2 mb-1`}>
                          {project.excerpt}
                        </p>
                        <span className={`text-xs text-${theme.colors.gray[500]}`}>{project.current_author_name}</span>
                        {/* 마지막 아이템이 아닐 경우에만 우측 구분선 추가 */}
                        {index !== projects.data.length - 1 && (
                          <div className={`hidden md:block absolute top-0 right-0 h-full border-r ${theme.card.border.split(' ')[1]}`} />
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  )
}
