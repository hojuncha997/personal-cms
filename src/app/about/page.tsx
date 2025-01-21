import { Container } from '@/components/layouts/Container'          
import Link from 'next/link'
import { colors } from '@/constants/styles'

export default function AboutPage() {
    return (
        // <div className="min-h-screen bg-[colors.primary.main]">
        // <div className="min-h-screen bg-[#fcd0b1]">
        <div className={`min-h-screen bg-[${colors.primary.main}]`}>
            <Container>
                <section className="py-12 max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-2xl  text-gray-800 mb-4">차호준</h1>
                        <p className="text-lg text-gray-600 mb-4">웹 개발자</p>
                        <div className="flex gap-4 text-gray-600">
                            <p>📧 hojun.cha997@gmail.com</p>
                            <p>🔗 <Link href="https://github.com/hojuncha997" target="_blank" rel="noopener noreferrer">github</Link></p>
                            <p>🔗 <Link href="https://catnails.tistory.com" target="_blank" rel="noopener noreferrer">blog</Link></p>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl text-gray-800 mb-6 pb-2 border-b-2">소개</h2>
                        <p className="text-gray-600 leading-relaxed">

                            백엔드, 프론트엔드, 인프라 등 여러 영역을 경험하며 문제 해결 능력을 키워왔습니다.
                            서비스 운영을 통해 실제 사용자를 위한 개발의 중요성을 이해하고 있습니다.
                            기술의 깊이와 함께 전체적인 개발 프로세스를 이해하는 개발을 하고 싶습니다.
                            
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2">기술 스택</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-gray-800">프론트엔드</h3>
                                <p className="text-gray-600">React, TypeScript, Next.js, Tailwind CSS</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-gray-800">백엔드</h3>
                                <p className="text-gray-600">Node.js, Express, NestJS, PostgreSQL</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl  text-gray-800 mb-6 pb-2 border-b-2">경력</h2>
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-semibold text-gray-800">마크애니</h3>
                                    <span className="text-gray-600">2021.5.10 - 2024.12.30 (총 3년 8개월)</span>
                                </div>
                                <p className="text-gray-700 font-medium mb-2">풀스택 개발자</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>대규모 커머스 플랫폼 개발 및 유지보수</li>
                                    <li>마이크로서비스 아키텍처 설계 및 구현</li>
                                    <li>팀 내 코드 리뷰 문화 정착</li>
                                </ul>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-semibold text-gray-800">COS</h3>
                                    <span className="text-gray-600">2016.4.10 - 2019.4.10 (총 3년)</span>
                                </div>
                                <p className="text-gray-700 font-medium mb-2">재고관리 및 매장관리</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>매장 내 재고 관리</li>
                                </ul>
                            </div>
{/* 
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-semibold">XYZ 스타트업</h3>
                                    <span className="text-gray-600">2020 - 2022</span>
                                </div>
                                <p className="text-gray-700 font-medium mb-2">풀스택 개발자</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>소셜 네트워크 서비스 개발</li>
                                    <li>실시간 채팅 기능 구현</li>
                                    <li>서비스 성능 최적화</li>
                                </ul>
                            </div> */}
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl text-gray-800 mb-6 pb-2 border-b-2">프로젝트</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">실시간 협업 툴</h3>
                                <p className="text-gray-600 mb-2">
                                    WebSocket을 활용한 실시간 문서 공동 편집 기능 구현
                                </p>
                                <p className="text-gray-600">
                                    기술 스택: React, TypeScript, Socket.io, Express
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl text-gray-800 mb-6 pb-2 border-b-2">교육</h2>
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">국민대학교</h3>
                            <p className="text-gray-600">경영정보학(Management Information System) 학사 (2008 - 2015)</p>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl text-gray-800 mb-6 pb-2 border-b-2">자격증</h2>
                        {/* <div className="grid grid-cols-2 gap-4"> */}
                        <div className="">

                            <ul className="list-disc list-inside text-gray-600 space-y-1">
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
