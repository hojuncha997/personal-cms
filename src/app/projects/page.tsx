// src/app/projects/page.tsx

'use client'
import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Container } from '@/components/layouts/Container';
import Link from 'next/link';
import { useWindowSize } from '@/hooks/layout/useWindowSize';
import { colors } from '@/constants/styles';

export default function Projects() {
    const [mounted, setMounted] = useState(false);
    const { isMobile } = useWindowSize();

    useEffect(() => {
        setMounted(true);
    }, []);

    // 기본 레이아웃을 데스크톱 버전으로 설정
    const layoutClass = mounted ? (isMobile ? 'flex-col' : 'flex-row') : 'flex-row';
    const widthClass = mounted ? (isMobile ? 'w-full' : 'w-1/2') : 'w-1/2';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Container>
                <div className="py-16">
                    <h1 className="text-4xl font-bold mb-4 text-gray-800">Projects</h1>
                    <p className="text-gray-600 mb-12 text-lg">주요 프로젝트들을 소개합니다</p>
                    
                    <div className={`flex ${layoutClass} gap-8 justify-center`}>
                        <Link href="/projects/chainverse" className={`${widthClass} group`}>
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">체인버스 프로젝트</h3>
                                    <p className="text-gray-600 mt-2">블록체인 기반 디지털 자격증명 시스템</p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">React</span>
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">Spring Boot</span>
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">Blockchain</span>
                                </div>
                            </div>
                        </Link>

                        <div className={`${widthClass} group`}>
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md p-6">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">Coming Soon</h3>
                                    <p className="text-gray-600 mt-2">새로운 프로젝트가 준비중입니다</p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Next.js</span>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">TypeScript</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
