'use client'

import React, { useState } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
    const id = params.id as string;
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [replyContent, setReplyContent] = useState('');

    // 임시 더미 데이터 리스트
    const dummyList = [
        {
            id: "1",
            title: "첫 번째 방명록입니다",
            author: "이방문",
            views: 35,
            date: "2024-03-14",
            like: 8,
            category: "일반",
            comments: [],
        },
        {
            id: "2",
            title: "두 번째 방명록이에요",
            author: "박방문",
            views: 38,
            date: "2024-03-14",
            like: 9,
            category: "문의",
            comments: [
                { id: '1', author: '김댓글', content: '반갑습니다!', date: '2024-03-14' }
            ],
        },
        {
            id: "3",
            title: "정말 멋진 포트폴리오네요!",
            content: "프로젝트들이 매우 인상적입니다. 특히 React를 활용한 프로젝트가 눈에 띄네요.",
            author: "김방문",
            views: 42,
            date: "2024-03-15",
            like: 10,
            category: "칭찬",
            comments: [
                {
                    id: '1',
                    author: '이댓글',
                    content: '저도 동의합니다!',
                    date: '2024-03-15',
                    replies: [
                        {
                            id: '1-1',
                            author: '김답글',
                            content: '감사합니다 :)',
                            date: '2024-03-15',
                            parentId: '1'
                        }
                    ]
                },
                { id: '2', author: '박댓글', content: '정말 멋져요~', date: '2024-03-15' }
            ],
        },
        {
            id: "4",
            title: "네 번째 방명록입니다",
            author: "최방문",
            views: 30,
            date: "2024-03-16",
            like: 7,
            category: "일반",
            comments: [],
        },
        {
            id: "5",
            title: "다섯 번째 방명록이에요",
            author: "정방문",
            views: 25,
            date: "2024-03-16",
            like: 5,
            category: "일반",
            comments: [],
        },
    ];

    const currentPost = dummyList.find(post => post.id === id) || dummyList[2];

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
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <div className="border-b border-gray-200 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">{currentPost.category}</span>
                                    <h1 className="text-2xl font-bold">{currentPost.title}</h1>
                                    {currentPost.comments.length > 0 && (
                                        <span className="text-blue-500">[{currentPost.comments.length}]</span>
                                    )}
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>작성자: {currentPost.author}</span>
                                    <span>조회수: {currentPost.views}</span>
                                    <span>작성일: {currentPost.date}</span>
                                </div>
                            </div>
                            <div className="mt-6 whitespace-pre-wrap">
                                {currentPost.content}
                            </div>
                            <div className="mt-8 border-t pt-4">
                                <div className="flex justify-center mb-8">
                                    <button 
                                        onClick={handleLike}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                                            ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        <span className="text-lg">❤️</span>
                                        <span>좋아요 {currentPost.like + (isLiked ? 1 : 0)}</span>
                                    </button>
                                </div>
                                
                                {/* 댓글 섹션 */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">댓글 {currentPost.comments.length}개</h3>
                                    
                                    {/* 댓글 작성 폼 */}
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

                                    {/* 댓글 목록 */}
                                    <div className="space-y-4">
                                        {currentPost.comments.map((comment) => renderComment(comment))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button 
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    목록으로
                                </button>
                            </div>
                        </div>

                        {/* 하단 목록 (기존 코드) */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {dummyList.map((post) => (
                                <Link href={`/guestbook/${post.id}`} key={post.id}>
                                    <div className={`border-b border-gray-100 px-6 py-4 hover:bg-gray-50 cursor-pointer
                                        ${post.id === id ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">[{post.category}]</span>
                                                    <span className="text-blue-600">{post.title}</span>
                                                    {post.comments.length > 0 && (
                                                        <span className="text-blue-500">[{post.comments.length}]</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span>{post.author}</span>
                                                <span>{post.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default GuestbookDetail; 