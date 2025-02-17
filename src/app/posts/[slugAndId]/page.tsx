'use client'

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail';
import { format } from 'date-fns';
import Tiptap from '@/components/editor/tiptap/Tiptap';
import { notFound } from 'next/navigation';
import { PostNavigation } from '@/components/posts/PostNavigation';
import { RelatedPosts } from '@/components/posts/RelatedPosts';
import PostDetailSkeleton from '@/components/posts/skeletons/PostDetailSkeleton';
import { useGetRelatedPosts } from '@/hooks/posts/useGetRelatedPosts';
import { useGetPostNavigation } from '@/hooks/posts/useGetPostNavigation';

interface Comment {
    id: string;
    author: string;
    content: string;
    date: string;
    parentId?: string;
    replies?: Comment[];
}

const PostDetail: React.FC = () => {
    const params = useParams();
    const publicId = params.slugAndId?.toString().split('-').pop() || '';
    
    console.log('publicId:', publicId); // 디버깅용
    
    const { data: post, isLoading: postLoading, error: postError } = useGetPostDetail(publicId);
    const { data: relatedPosts, isLoading: relatedLoading } = useGetRelatedPosts(publicId);
    const { data: navigationPosts, isLoading: navigationLoading } = useGetPostNavigation(publicId);
    const [isLiked, setIsLiked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [showRelated, setShowRelated] = useState(false);

    useEffect(() => {
        if (post) {
            // 메인 컨텐츠가 로드된 후 일정 시간 뒤에 관련 컨텐츠 표시
            const timer = setTimeout(() => setShowRelated(true), 100);
            return () => clearTimeout(timer);
        }
    }, [post]);

    if (postLoading) {
        return <PostDetailSkeleton />;
    }

    if (postError || !post) {
        notFound();
    }

    // ... handleLike, handleCommentSubmit, handleReplySubmit, renderComment 함수들은 동일하게 유지

    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
            <Container className="px-0 sm:px-4">
                <div className="max-w-4xl w-full mx-auto py-4 sm:py-8">
                    <div className="w-full space-y-6">
                        {/* 본문 컨테이너 */}
                        <div className="bg-white  rounded-lg sm: border-none">
                            <div className="p-0 sm:p-6">
                                {/* 헤더 */}
                                <div className="border-b border-gray-300 pb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-2xl font-bold">{post.title}</h1>
                                    </div>
                                    <div className="flex gap-4 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">{post.category}</span>
                                        <span>작성자: {post.author_display_name.includes('@') ? post.author_display_name.split('@')[0] : post.author_display_name}</span>
                                        <span>조회수: {post.viewCount}</span>
                                        <span>작성일: {format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
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

                        {/* 댓글 섹션 */}
                        {/* <div className="bg-white shadow-md">
                            <div className="p-4 sm:p-6">
                                <div className="text-gray-500 text-center py-4">
                                    댓글 기능 준비 중...
                                </div>
                            </div>
                        </div> */}

                        {/* 관련 포스트와 네비게이션 섹션 */}
                        {showRelated && (
                            <>
                                {/* 관련 포스트 */}
                                <div className="bg-white border border-gray-300 rounded-lg">
                                    <div className="p-4 sm:p-6">
                                        <RelatedPosts publicId={publicId} />
                                    </div>
                                </div>

                                {/* 이전/다음 포스트 네비게이션 */}
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

export default PostDetail; 