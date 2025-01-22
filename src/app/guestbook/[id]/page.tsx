'use client'

import React from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import { useParams } from 'next/navigation';

interface GuestbookDetail {
    id: string;
    title: string;
    content: string;
    author: string;
    views: number;
    date: string;
}

const GuestbookDetail: React.FC = () => {
    const params = useParams();
    const id = params.id as string;

    // TODO: id를 사용하여 서버에서 방명록 데이터 fetch
    // const [guestbook, setGuestbook] = useState<GuestbookDetail | null>(null);
    
    // 임시 더미 데이터
    const dummyDetail: GuestbookDetail = {
        id: id,
        title: "정말 멋진 포트폴리오네요!",
        content: "프로젝트들이 매우 인상적입니다. 특히 React를 활용한 프로젝트가 눈에 띄네요.",
        author: "김방문",
        views: 42,
        date: "2024-03-15"
    };

    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
            <Container>
                <div className="max-w-4xl w-full mx-auto py-8">
                    <div className="w-full">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h1 className="text-2xl font-bold mb-2">{dummyDetail.title}</h1>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>작성자: {dummyDetail.author}</span>
                                    <span>조회수: {dummyDetail.views}</span>
                                    <span>작성일: {dummyDetail.date}</span>
                                </div>
                            </div>
                            <div className="mt-6 whitespace-pre-wrap">
                                {dummyDetail.content}
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
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default GuestbookDetail; 