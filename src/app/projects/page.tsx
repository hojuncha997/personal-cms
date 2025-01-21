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
        <div className={`min-h-screen`} style={{ backgroundColor: colors.primary.main }}>
            <Container>
                <div className={`bg-[${colors.primary.main}] text-black`}>
                    <h1>Projects</h1>
                    <div className={`flex ${layoutClass} gap-4 justify-center`}>
                        <Link href="/projects/chainverse" className={widthClass}>
                            <div className="border-[1px] border-black rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative aspect-video">
                                    <Image 
                                        src={img2} 
                                        alt="img2" 
                                        fill
                                        className="object-cover"
                                    />    
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold mb-2">체인버스</h3>
                                    <p className="text-gray-600">블록체인 기반 메타버스 플랫폼</p>
                                </div>
                            </div>
                        </Link>
                        <div className={`${widthClass} border-[1px] border-black rounded-xl overflow-hidden`}>
                            <div className="relative aspect-video">
                                <Image 
                                    src={img1} 
                                    alt="img1" 
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">프로젝트 제목</h3>
                                <p className="text-gray-600">프로젝트 설명이 들어갈 자리입니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
