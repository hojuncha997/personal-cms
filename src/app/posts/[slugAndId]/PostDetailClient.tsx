// src/app/posts/[slugAndId]/PostDetailClient.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import Link from 'next/link';
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail';
import { format } from 'date-fns';
import Tiptap from '@/components/editor/tiptap/Tiptap';
import { notFound } from 'next/navigation';
import { PostDetail } from '@/types/posts/postTypes';
import PostDetailSkeleton from '@/components/posts/skeletons/PostDetailSkeleton';
import { PostNavigation } from '@/components/posts/PostNavigation';
import { RelatedPosts } from '@/components/posts/RelatedPosts';
import { useGetRelatedPosts } from '@/hooks/posts/useGetRelatedPosts';
import { useGetPostNavigation } from '@/hooks/posts/useGetPostNavigation';
import { CommonPopover } from '@/components/common/common-popover';
import { MoreVertical } from 'lucide-react';
import { useDeletePost } from '@/hooks/posts/useDeletePost';
import { useRouter } from 'next/navigation';
import { useIsAuthor } from '@/hooks/auth/useIsAuthor';
import { logger } from '@/utils/logger';

interface PostDetailClientProps {
    publicId: string;
    prefetch?: boolean;
}

const PostDetailClient: React.FC<PostDetailClientProps> = ({ publicId, prefetch = true }) => {
    const { data: post, isLoading: postLoading, error: postError } = useGetPostDetail(publicId, {enabled: prefetch}); // prefetch가 false일 경우 쿼리 실행
    const { data: relatedPosts, isLoading: relatedLoading } = useGetRelatedPosts(publicId);
    const { data: navigationPosts, isLoading: navigationLoading } = useGetPostNavigation(publicId);
    const [isLiked, setIsLiked] = useState(false);
    const [showRelated, setShowRelated] = useState(false);
    // const deletePost = useDeletePost();
    const { mutate: deletePost, mutateAsync: deletePostAsync, isPending, isError } = useDeletePost();
    const router = useRouter();
    const isAuthor = useIsAuthor(post?.author_uuid);

    useEffect(() => {
        if (post) {
            const timer = setTimeout(() => setShowRelated(true), 100);
            return () => clearTimeout(timer);
        }
    }, [post]);

    const handleDeletePost = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                // await deletePost.mutateAsync(publicId);
                // deletePost.isPending
                // await deletePostAsync(publicId); 프로미스를 반환함. 성공하면 then 또는 await 이후 다음 코드로 진행.
                // router.push('/posts');  // 삭제 성공 후 목록 페이지로 이동
                // 실패하면 catch로 이동. 따라서 이걸로도 괜찮지만, 아래처럼 명시적으로 써주는 게 좋음. 더욱 안전하고 명확함

                // const result = await deletePostAsync(publicId);
                // 서버 응답 구조에 따라 결과 형식이 다를 수 있음. 예를 들어 다음과 같은 형식이 가능함.
                // { success: true }
                // { success: false, error: '게시글 삭제에 실패했습니다.' }

                // if(result.success) {
                //     router.push('/posts');  // 삭제 성공 후 목록 페이지로 이동
                 // } else {
                //     alert('게시글 삭제에 실패했습니다.');
                // }
                // 우선은 간편한 방법을 써서 삭제 후 목록 페이지로 이동. 추후 서버 응답 구조에 따라 수정 필요.
                const result = await deletePostAsync(publicId);
                logger.info('게시글 삭제 결과:', await result.json());
                router.push('/posts');
               
            } catch (error) {
                logger.error('게시글 삭제 실패:', error);
                alert('게시글 삭제에 실패했습니다.');
            }
        }
    };

    if (postLoading) {
        return <PostDetailSkeleton />;
    }

    if (postError || !post) {
        notFound();
    }

    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
            <Container className="px-0 sm:px-4">
                <div className="max-w-4xl w-full mx-auto py-4 sm:py-8">
                    <div className="w-full space-y-6">
                        {/* 본문 컨테이너 */}
                        <div className="bg-white rounded-lg sm:border-none">
                            <div className="p-0 sm:p-6">
                                {/* 헤더 */}
                                <div className="border-b border-gray-300 pb-4">
                                    <div className="mb-2">
                                        <span className="px-2 py-1 bg-gray-100 text-xs rounded-md">{post.categorySlug || 'no category'}</span>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-bold mb-2">{post.title}</h1>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                            <span>작성자: {post.author_display_name.includes('@') ? post.author_display_name.split('@')[0] : post.author_display_name}</span>
                                            <span>조회수: {post.viewCount}</span>
                                            <span>작성일: {format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
                                        </div>
                                        {isAuthor && (
                                            <CommonPopover
                                                trigger={
                                                    <button className="p-1 hover:bg-gray-100 rounded-full">
                                                        <MoreVertical className="w-5 h-5 text-gray-500" />
                                                    </button>
                                                }
                                                placement="bottom"
                                                className="w-32"
                                                offset={4}
                                                placementOffset="0"
                                            >
                                                <div className="py-1 text-black">
                                                    <button 
                                                        className="w-full px-4 py-2 text-xs text-left hover:bg-gray-50"
                                                        onClick={() => router.push(`/posts/${post.slug}-${publicId}/edit`)}
                                                    >
                                                        수정하기
                                                    </button>
                                                    <button 
                                                        className="w-full px-4 py-2 text-xs text-left hover:bg-gray-50"
                                                        onClick={() => {/* 비공개 로직 */}}
                                                    >
                                                        비공개로 전환
                                                    </button>
                                                    <button 
                                                        className="w-full px-4 py-2 text-xs text-left text-red-500 hover:bg-red-50"
                                                        onClick={handleDeletePost}
                                                    >
                                                        삭제하기
                                                    </button>
                                                </div>
                                            </CommonPopover>
                                        )}
                                    </div>
                                </div>

                                {/* 본문 내용 */}
                                <div className="mt-6 whitespace-pre-wrap">
                                    <Tiptap
                                        initialContent={post.content}
                                        contentStyle="min-h-[200px] bg-transparent prose-sm"
                                        wrapperStyle="overflow-hidden"
                                        editable={false}
                                    />
                                </div>

                                {/* 좋아요 버튼 */}
                                <div className="mt-8 border-t border-gray-300 pt-4">
                                    <div className="flex justify-center mb-8">
                                        <button 
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                                                ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                        >
                                            <span className="text-lg">❤️</span>
                                            <span>좋아요 {post.likeCount + (isLiked ? 1 : 0)}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 border border-gray-300 rounded-lg">
                                    <div className="text-gray-500 text-center py-4">
                                        댓글 기능 준비 중...
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 관련 포스트와 네비게이션 섹션 */}
                        {showRelated && (
                            <>
                                <div className="bg-white border border-gray-300 rounded-lg">
                                    <div className="p-4 sm:p-6">
                                        <RelatedPosts publicId={publicId} />
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-300 rounded-lg">
                                    <div className="p-4 sm:p-6">
                                        <PostNavigation publicId={publicId} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 목록으로 버튼 */}
                        <div className="px-4 sm:px-0">
                            <div className="flex justify-end">
                                <Link 
                                    href="/posts" 
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    목록으로
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default PostDetailClient; 