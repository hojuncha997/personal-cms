'use client'

import { Container } from '@/components/layouts/Container'          
import Link from 'next/link'
import { colors } from '@/constants/styles'
import Image from 'next/image'
import { useWindowSize } from '@/hooks/layout'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AboutPageSkeleton from '@/components/about/skeletons/AboutPageSkeleton'

export default function AboutPage() {
    const [isMounted, setIsMounted] = useState(false);
    const { isMobile } = useWindowSize();

    // const { data: { publicUrl: meImageUrl } } = supabase.storage
    //     .from('media-storage')
    //     .getPublicUrl('images/project-images/1739875903567-89smburkkwm.webp');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <AboutPageSkeleton />;
    }

    // 초기 레이아웃을 위한 기본값 설정
    // const imageWidth = isMounted ? (isMobile ? 'w-full' : 'w-[200px]') : 'w-[200px]';

    return (
        // <div className="min-h-screen bg-[colors.primary.main]">
        // <div className="min-h-screen bg-[#fcd0b1]">
        
        <div className="min-h-screen bg-[#CBCBCB]">
            <Container>
                <section className="py-12 max-w-4xl mx-auto">
                    <div className={`mb-12 ${isMobile ? 'flex flex-col' : 'flex flex-row'} gap-8`}>
                        {isMounted ? (
                            <>
                                {/* 사진 */}
                                {/* <div className={`${isMobile ? 'w-full' : 'w-[200px]'}`}>
                                    <div className="border-[1px] border-gray-300 rounded-xl">
                                        <Image 
                                            src={meImageUrl} 
                                            alt="프로필 이미지" 
                                            width={200} 
                                            height={200}
                                            className="rounded-xl w-full h-auto object-cover"                                        />
                                    </div>
                                </div> */}
                                
                                {/* 소개 정보 */}
                                <div className="flex flex-col text-gray-700 flex-1">
                                    {/* 이름과 직함 */}
                                    <div className="mb-4">
                                        <h1 className="text-2xl mb-2">차호준</h1>
                                        <p className="text-lg ">웹 개발자</p>
                                    </div>

                                    {/* 연락처 링크 */}
                                    <div className={`mb-6 ${isMobile ? 'flex flex-col gap-2' : 'flex gap-4'}`}>
                                        {/* <p>📧 hojun.cha997@gmail.com</p> */}
                                        <p>📧 <Link href="mailto:hojun.cha997@gmail.com">hojun.cha997@gmail.com</Link></p>

                                        <p>🔗 <Link href="https://github.com/hojuncha997" target="_blank" rel="noopener noreferrer">github</Link></p>
                                        <p>🔗 <Link href="https://catnails.tistory.com" target="_blank" rel="noopener noreferrer">blog</Link></p>
                                    </div>

                                    {/* 소개 텍스트 */}
                                    <div>
                                        <p className="leading-relaxed">
                                            백엔드, 프론트엔드, 인프라 등 여러 영역을 경험하며 문제 해결 능력을 키워왔습니다.
                                            서비스 운영을 통해 실제 사용자를 위한 개발의 중요성을 이해하고 있습니다.
                                            기술의 깊이와 함께 전체적인 개발 프로세스를 이해하는 개발을 하고 싶습니다.
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* 스켈레톤 UI */}
                                <div className={`${isMobile ? 'w-full' : 'w-[200px]'}`}>
                                    <div className="border-[1px] border-gray-200 rounded-xl">
                                        <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-xl" />
                                    </div>
                                </div>
                                
                                <div className="flex flex-col flex-1 gap-4">
                                    {/* 이름과 직함 스켈레톤 */}
                                    <div className="space-y-2">
                                        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
                                        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
                                    </div>
                                    
                                    {/* 연락처 링크 스켈레톤 */}
                                    <div className="space-y-2">
                                        <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
                                        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                                        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                                    </div>
                                    
                                    {/* 소개 텍스트 스켈레톤 */}
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>


                    <div className="mb-12 text-gray-700">
                        <h2 className="text-xl mb-6 border-b-[1px] border-gray-600"><span className="bg-gray-600 text-white px-2 inline-flex items-center">사용 가능한 기술</span></h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">프론트엔드</h3>
                                <p className="">React(JS/TS), Next.js(TS), Tailwind CSS, MUI, Styled-Components, Redux Toolkit, Zustand  </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">백엔드</h3>
                                <p className="">Spring Boot, NestJS, PostgreSQL, MariaDB, Promox, Docker, centos7, RockyLinux9 </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12 text-gray-700">
                        <h2 className="text-xl mb-6 border-b-[1px] border-gray-700">
                            <span className="bg-gray-700 text-white px-2 inline-flex items-center">경력</span>
                        </h2>
                        <div className="space-y-8">
                            {isMounted ? (
                                <>
                                    <div>
                                        <div className={`flex mb-2 ${isMobile ? 'flex-col items-start' : 'justify-between items-center'}`}>
                                            <h3 className="text-xl font-semibold">마크애니</h3>
                                            <span className="">2021.5.10 - 2024.12.30 (총 3년 8개월)</span>
                                        </div>
                                        <p className="font-medium mb-2">웹 개발자</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>화물차 면허 거래 플랫폼 어드민 개발 및 운영</li>
                                            <li>서비스 및 운영을 위한 온프레미스 가상환경 구축</li>
                                            <li>학습이력증명 서비스 유지보수</li>
                                            <li>DID(탈중앙화 신원증명, Decentralized Identity) 관리 어드민 GS인증 작업</li>
                                            <li>DID 관리자 어드민 유지보수 및 기능개발</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <div className={`flex mb-2 ${isMobile ? 'flex-col items-start' : 'justify-between items-center'}`}>
                                            <h3 className="text-xl font-semibold">COS</h3>
                                            <span className="">2016.4.10 - 2019.4.10 (총 3년)</span>
                                        </div>
                                        <p className="font-medium mb-2">재고관리</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>재고관리</li>
                                            <li>매장 내 재고 관리 자료 작성 및 교육</li>
                                        </ul>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>

                    <div className="mb-12 text-gray-700">
                        <h2 className="text-xl mb-6 border-b-[1px] border-gray-600"><span className="bg-gray-600 text-white px-2 inline-flex items-center">프로젝트</span></h2>
                        <div className="space-y-8">

                    <div>
                        <h3 className="text-xl font-semibold mb-2">커뮤니티 기능이 추가된 개인 블로그(개인 프로젝트)</h3>
                            <p className="mb-2">2024.12.19 ~ 진행중</p>
                            <ul className=" mb-2">
                                <li className="list-disc list-inside">Next.js(TS)와 Tailwind CSS, Zustand, Tanstack Query를 사용하여 프론트 개발</li>
                                <li className="list-disc list-inside">NestJS(TS)와 TypeORM, PostgreSQL을 사용하여 백엔드 개발</li>
                                <li className="list-disc list-inside">JWT기반 인증방식 채택, refresh token rotation, 멀티 디바이스 로그아웃을 위한 토큰 버전 사용</li>
                                <li className="list-disc list-inside">로컬 회원가입 시 이메일 인증, 소셜로그인 기능 구현</li>
                                <li className="list-disc list-inside">포스팅 및 댓글 작성 기능 추가 예정</li>
                            </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">🔗<Link href="https://dermatographiac.vercel.app/" target="_blank" rel="noopener noreferrer">포트폴리오 목적 사이트</Link>(개인 프로젝트)</h3>
                            <p className="mb-2">2024.09 ~ 2024.10</p>
                            <ul className=" mb-2">
                                <li className="list-disc list-inside">Supabase와 Vercel을 경험해 보기 위한 목적의 정적 사이트</li>
                                <li className="list-disc list-inside">Next.js(TS)와 Tailwind CSS, Supabase Storage, Supabase Database를 사용</li>
                                <li className="list-disc list-inside">Quill(React-Quill)를 사용해 포스팅 작성 기능 구현(현재 supabase storage 기한 만료로 인해 사용 불가)</li>
                            </ul>
                    </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">🔗<Link href="https://nambawon.com" target="_blank" rel="noopener noreferrer">남바원</Link> 어드민 개발 및 운영</h3>
                                <p className="mb-2">2024.01 ~ 2024.10</p>
                                <ul className=" mb-2">
                                    <li className="list-disc list-inside">화물차 면허 거래 플랫폼 어드민 개발 및 운영</li>
                                    <li className="list-disc list-inside">React(JS)와 Spring Boot를 사용하여 개발</li>
                                    <li className="list-disc list-inside">AWS EC2(RockyLinux9.1) 사용해 환경구성 및 운영</li>
                                    <li className="list-disc list-inside">현재 남바원은 마크애니와의 계약 종료로 인해 별도 시스템 운영</li>
                                </ul>
                                {/* <p className="">
                                    기술 스택: React, TypeScript, Socket.io, Express
                                </p> */}
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">하이퍼바이저(proxmox)를 사용한 가상환경 구축</h3>
                                <p className="mb-2">2023.03 ~ 2024.04</p>
                                <ul className=" mb-2">
                                    <li className="list-disc list-inside">기존 정부과제 프로젝트의 환경인 VMware ESxi의 라이선스 미연장으로 인해 대체 환경 구축</li>
                                    <li className="list-disc list-inside">오픈소스 하이퍼바이저인 Proxmox를 사용해 온프레미스 블록체인 운영환경 구축</li>
                                    <li className="list-disc list-inside">Synology NAS를 사용한 스토리지&깃랩 구축</li>
                                    <li className="list-disc list-inside">가비아를 통한 DNS 설정, 사설망 간 통신 연결, Haproxy(SSL인증서 적용 및 포트포워딩, 라운드로빈 설정), Nginx, Docker, 설정하여 개발/테스트서버 구축</li>
                                </ul>
                                {/* <p className="">
                                    기술 스택: React, TypeScript, Socket.io, Express
                                </p> */}
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">몰리다 운영 및 유지보수</h3>
                                <p className="mb-2">2022.12.01 ~ 2024.02</p>
                                <ul className=" mb-2">
                                    <li className="list-disc list-inside">학습이력증명 서비스 몰리다 운영 및 고객요청 대응</li>
                                    <li className="list-disc list-inside">ISMS-P 인증 기준에 따른 증적자료 작성</li>
                                    <li className="list-disc list-inside">Promox를 사용한 온프레미스 운영환경 구축(초기)</li>
                                    <li className="list-disc list-inside">2021년 9월부터 24년 2월까지 운영 후 서비스 종료</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">AnyblockDID 관리자 어드민 개발 & GS인증 작업</h3>
                                <p className="mb-2">2021.05.10 ~ 2022.11.30</p>
                                <ul className=" mb-2">
                                    <li className="list-disc list-inside">마크애니의 블록체인 솔루션인 AnyblockDID 관리자 어드민 개발: DID생성을 위한 입력폼 작업</li>
                                    <li className="list-disc list-inside">GS인증을 위한 보안 작업  (XSS, CSRF, CORS, SQL Injection)</li>
                                    <li className="list-disc list-inside">JSP, Spring Boot, Tomcat9, MyBatis, MariaDB, AWS EC2 환경</li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    

                    

                    <div className="mb-12 text-gray-700">
                    <h2 className="text-xl mb-6 border-b-[1px] border-gray-600">
                        <span className="bg-gray-600 text-white px-2 inline-flex items-center">교육</span>
                    </h2>
                    <div>
                            <h3 className="text-xl font-semibold mb-2">국민대학교</h3>
                            <p className="">경영정보학(Management Information System) 학사</p>
                        </div>
                    </div>

                    <div className="mb-12 text-gray-700">
                    <h2 className="text-xl mb-6 border-b-[1px] border-gray-600"><span className="bg-gray-600 text-white px-2 inline-flex items-center ">자격증</span></h2>
                        {/* <div className="grid grid-cols-2 gap-4"> */}
                        <div className="">

                            <ul className="list-disc list-inside  space-y-1">
                                <li>AWS Certified Cloud Practitioner</li>
                                <li>북미생산재고관리사(CPIM,Certified Professional in Supply Management)</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    )
}