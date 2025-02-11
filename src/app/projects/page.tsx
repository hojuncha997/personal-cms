// src/app/projects/page.tsx

'use client'
import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Container } from '@/components/layouts/Container';
import Image from 'next/image';
import img1 from '@images/projects/markany/chainverse/img1.png';
import img2 from '@images/projects/markany/chainverse/img2.png';
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
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative aspect-video">
                                    <Image 
                                        src={img2} 
                                        alt="체인버스" 
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-gray-800">체인버스</h3>
                                        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full">Web3</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">블록체인 기반 메타버스 플랫폼</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">React</span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">TypeScript</span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Blockchain</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className={`${widthClass} group`}>
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                                <div className="relative aspect-video">
                                    <Image 
                                        src={img1} 
                                        alt="프로젝트" 
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-gray-800">프로젝트 제목</h3>
                                        <span className="text-sm px-3 py-1 bg-green-100 text-green-600 rounded-full">Coming Soon</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">프로젝트 설명이 들어갈 자리입니다.</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Next.js</span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">TypeScript</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
