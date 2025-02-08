'use client'

import React, { useState } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetGuestbookDetail } from '@/hooks/guestbooks/useGetGuestbookDetail';
import { format } from 'date-fns';
import Tiptap from '@/components/editor/tiptap/Tiptap';
import { notFound } from 'next/navigation';

interface Comment {
    id: string;
    author: string;
    content: string;
    date: string;
    parentId?: string;
    replies?: Comment[];
}

const GuestbookDetail: React.FC = () => {
    const params = useParams();
    const publicId = params.slugAndId?.toString().split('-').pop() || '';
    const { data: post, isLoading, error } = useGetGuestbookDetail(publicId);
    const [isLiked, setIsLiked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [replyContent, setReplyContent] = useState('');

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error || !post) {
        notFound();
    }

    // ... handleLike, handleCommentSubmit, handleReplySubmit, renderComment 함수들은 동일하게 유지

    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
            <Container>
                <div className="max-w-4xl w-full mx-auto py-8">
                    <div className="w-full">
                        {/* 방명록 상세 컨테이너 */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            {/* 방명록 상세 헤더 */}
                            <div className="border-b border-gray-200 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">{post.category}</span>
                                    <h1 className="text-2xl font-bold">{post.title}</h1>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>작성자: {post.author_display_name}</span>
                                    <span>조회수: {post.viewCount}</span>
                                    <span>작성일: {format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
                                </div>
                            </div>
                            <div className="mt-6 whitespace-pre-wrap">
                                <Tiptap
                                    initialContent={post.content}
                                    contentStyle="min-h-[200px] bg-transparent prose-sm"
                                    wrapperStyle="overflow-hidden"
                                    editable={false}
                                />
                            </div>
                            <div className="mt-8 border-t pt-4">
                                <div className="flex justify-center mb-8">
                                    <button 
                                        // onClick={handleLike}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                                            ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        <span className="text-lg">❤️</span>
                                        <span>좋아요 {post.likeCount + (isLiked ? 1 : 0)}</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <Link 
                                    href="/guestbook"
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

export default GuestbookDetail; 