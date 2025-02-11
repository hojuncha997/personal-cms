'use client'

import { Container } from '@/components/layouts/Container';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use } from 'react';

type Props = {
    params: Promise<{
        id: string
    }>
}

export default function ProjectDetail({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* 모바일 헤더 */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10">
                <div className="flex items-center h-full px-4">
                    <button 
                        onClick={() => router.back()} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 19l-7-7 7-7" 
                            />
                        </svg>
                    </button>
                    <h1 className="flex-1 text-center text-lg font-medium">
                        {id === 'chainverse' ? '체인버스' : '프로젝트 제목'}
                    </h1>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <Container>
                <div className="max-w-4xl mx-auto py-12 lg:py-16 mt-16 lg:mt-0">
                    <div className="hidden lg:block mb-8">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => router.back()}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                ← 프로젝트 목록
                            </button>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-6 hidden lg:block text-gray-800">
                        {id === 'chainverse' ? '체인버스' : '프로젝트 제목'}
                    </h1>
                    <div className="prose max-w-none">
                        {/* 프로젝트 상세 내용 */}
                        <p className="text-gray-600">프로젝트 상세 설명...</p>
                    </div>
                </div>
            </Container>
        </div>
    );
} 