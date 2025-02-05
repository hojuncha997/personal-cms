'use client'

import React, { useState } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetGuestbookDetail } from '@/hooks/guestbooks/useGetGuestbookDetail';
import { format } from 'date-fns';
import Tiptap from '@/components/editor/tiptap/Tiptap';


interface Comment {
    id: string;
    author: string;
    content: string;
    date: string;
    parentId?: string;  // 부모 댓글 ID
    replies?: Comment[]; // 답글 목록
}

interface GuestbookDetail {
    id: string;
    title: string;
    content: string;
    author: string;
    views: number;
    date: string;
    like: number;
    category: string;
    comments: Comment[];
}

const GuestbookDetail: React.FC = () => {
    const params = useParams();
    const uuid = params.id as string;
    const { data: post, isLoading, error } = useGetGuestbookDetail(uuid);
    const [isLiked, setIsLiked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [replyContent, setReplyContent] = useState('');

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error || !post) {
        return <div>에러가 발생했습니다.</div>;
    }

    const handleLike = () => {
        setIsLiked(!isLiked);
        // TODO: API 연동
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API 연동
        console.log('새 댓글:', newComment);
        setNewComment('');
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyTo) return;
        
        // TODO: API 연동
        console.log('새 답글:', { parentId: replyTo.id, content: replyContent });
        
        setReplyContent('');
        setReplyTo(null);
    };

    // 댓글 컴포넌트를 별도 함수로 분리
    const renderComment = (comment: Comment, isReply: boolean = false) => (
        <div key={comment.id} className={`${isReply ? 'ml-8' : ''} bg-gray-50 p-4 rounded-md`}>
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{comment.author}</span>
                <span className="text-sm text-gray-500">{comment.date}</span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
            
            {/* 답글 작성 버튼 */}
            <div className="mt-2 flex justify-end">
                <button
                    onClick={() => setReplyTo(comment)}
                    className="text-sm text-blue-500 hover:text-blue-600"
                >
                    답글 달기
                </button>
            </div>

            {/* 답글 목록 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map(reply => renderComment(reply, true))}
                </div>
            )}

            {/* 답글 작성 폼 */}
            {replyTo?.id === comment.id && (
                <form onSubmit={handleReplySubmit} className="mt-4 ml-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>@{replyTo.author}</span>
                        <button 
                            type="button" 
                            onClick={() => setReplyTo(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="답글을 입력하세요"
                            rows={1}
                        />
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            답글 작성
                        </button>
                    </div>
                </form>
            )}
        </div>
    );

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
                                    {/* {post.commentCount > 0 && (
                                        <span className="text-blue-500">[{post.commentCount}]</span>
                                    )} */}
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>작성자: {post.author_display_name}</span>
                                    <span>조회수: {post.viewCount}</span>
                                    <span>작성일: {format(new Date(post.createdAt), 'yyyy-MM-dd')}</span>
                                </div>
                            </div>
                            {/* <div className="mt-6 whitespace-pre-wrap prose"> */}
                            <div className="mt-6 whitespace-pre-wrap">

                                {/* TODO: TipTap 뷰어로 교체 */}
                                {/* {JSON.stringify(post.content, null, 2)} */}

                                {/* </label>
                        <Tiptap
                            initialContent={watch('content')}
                            onChange={(content) => setValue('content', content)}
                            toolbarStyle="border-b bg-gray-50 p-2 flex flex-wrap gap-1"
                            // prose설정을 넣어줬음에 유의
                            contentStyle="p-4 min-h-[200px] bg-white prose-sm"
                        /> */}
                                
                                <Tiptap
                                    initialContent={post.content}
                                    contentStyle="min-h-[200px] bg-transparent prose-sm"
                                    wrapperStyle="overflow-hidden"
                                    editable={false}
                                    // onChange={() => {}}
                                />

                            </div>
                            <div className="mt-8 border-t pt-4">
                                <div className="flex justify-center mb-8">
                                    <button 
                                        onClick={handleLike}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                                            ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        <span className="text-lg">❤️</span>
                                        <span>좋아요 {post.likeCount + (isLiked ? 1 : 0)}</span>
                                    </button>
                                </div>
                                
                                {/* 댓글 섹션 - 추후 구현 */}
                                {/* <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">댓글 {post.comments.length}개</h3>
                                    
                                    <form onSubmit={handleCommentSubmit} className="space-y-2">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="댓글을 입력하세요"
                                            rows={3}
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                댓글 작성
                                            </button>
                                        </div>
                                    </form>

                                    <div className="space-y-4">
                                        {post.comments.map((comment) => renderComment(comment))}
                                    </div>
                                </div> */}
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
