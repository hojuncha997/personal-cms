'use client'

import Carousel from '@/components/Carousel'
import PostSection from '@/components/PostSection'
import { Container } from '@/components/layouts/Container'

export default function Home() {
  return (
    <div className="bg-white">
      {/* <Carousel /> */}
      <Container>
        {/* <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6"> */}
        <div className="mx-auto  py-6">

          {/* TODAY'S PICKS 전체 섹션 */}
          <h2 className="text-sm font-bold tracking-wider uppercase mb-6">TODAY'S PICKS</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* 메인 아티클 - 모바일에서는 최상단, 데스크탑에서는 중앙 */}
            <div className="lg:col-span-6 lg:order-2 order-first group cursor-pointer">
              <div className="h-full flex flex-col">
                <div className="aspect-[16/10] bg-gray-100 rounded-lg relative overflow-hidden mb-4">
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="flex-grow">
                  <span className="text-sm text-blue-600 font-medium">인터뷰</span>
                  <h1 className="text-3xl font-semibold mt-2 group-hover:text-blue-600">"AI 시대, 인문학의 가치는 더욱 빛날 것"</h1>
                  <p className="text-lg text-gray-600 mt-2">김철수 서울대 철학과 교수 인터뷰</p>
                  <p className="text-gray-600 mt-3 line-clamp-3">4차 산업혁명과 AI 시대를 맞아 인문학의 역할이 더욱 중요해지고 있다. 20년간 인문학과 기술의 접점을 연구해온 김철수 교수를 만나 미래 교육의 방향성에 대해 이야기를 나눴다.</p>
                </div>
              </div>
            </div>

            {/* 좌측 2개 아티클 - 모바일에서는 메인 아래, 데스크탑에서는 왼쪽 */}
            <div className="lg:col-span-3 lg:order-1 space-y-6">
              <div className="group cursor-pointer">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3"></div>
                <span className="text-sm text-blue-600 font-medium">프로그래밍</span>
                <h3 className="text-lg font-semibold mt-1 group-hover:text-blue-600">TypeScript 5.0의 새로운 기능들</h3>
                <p className="text-sm text-gray-600 mt-1">김태크 에디터</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3"></div>
                <span className="text-sm text-blue-600 font-medium">리뷰</span>
                <h3 className="text-lg font-semibold mt-1 group-hover:text-blue-600">VS Code 필수 익스텐션 TOP 10</h3>
                <p className="text-sm text-gray-600 mt-1">박코드 에디터</p>
              </div>
            </div>

            {/* 최신 포스팅 - 우측, 모바일에서는 가장 아래 */}
            <div className="lg:col-span-3 lg:order-3">
              <h3 className="text-sm font-bold tracking-wider uppercase mb-4">최신 포스팅</h3>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div>
                        <span className="text-xs text-gray-500">2024.03.{14 + i}</span>
                        <h3 className="text-base font-medium mt-1 group-hover:text-blue-600">Docker 컨테이너 보안 강화하기</h3>
                        <p className="text-xs text-gray-600">최컨테이너</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 기존 PostSection */}
          <PostSection />
        </div>
      </Container>
    </div>
  )
}
