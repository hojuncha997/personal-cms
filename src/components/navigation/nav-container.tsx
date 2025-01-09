'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { NavProfile } from './nav-profile'
import Link from 'next/link'


interface NavContainerProps {
  onOpenDrawer: () => void;
  onOpenLogin: () => void;
}

export function NavContainer({ onOpenDrawer, onOpenLogin }: NavContainerProps) {

  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const email = useAuthStore(state => state.email)
  const loading = useAuthStore(state => state.loading)

  return (
    <nav className="fixed w-full bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* 로고 */}
          <div className="flex items-center">
            <a href="/" className="text-xl text-gray-600">
              {/* Logo */}
              블로그
            </a>
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">홈</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">소개</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">서비스</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">문의하기</Link>

            {/* 만약 로그인 되어 있다면 프로필 버튼을 보여주고, 아니면 로그인 버튼을 보여준다. 그리고 
            로그인 되어 있는 경우 클릭하면 팝오버를 보여주고, 로그인 돼 있지 않다면 로그인 모달을 보여줘야 한다
            

            */}

            {/* {isAuthenticated ? (
                <div className=" border-[1px] border-gray-300 rounded-md p-1 flex items-center">
                  <NavProfile />
                </div>
              ) : (
                <button onClick={onOpenLogin} className=" border-[1px] border-gray-300 rounded-md p-1 text-gray-700 hover:text-gray-700">
                  로그인
                </button>
                
              )} */}

            {isAuthenticated ? (
              <div className=" border-[1px] border-gray-300 rounded-md p-1 flex items-center">
                <NavProfile />
              </div>
            ) : (
              loading ? (
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
              ) : (
                <button onClick={onOpenLogin} className=" border-[1px] border-gray-300 rounded-md p-1 text-gray-700 hover:text-gray-700">
                  로그인
                </button>
              )
            )}

          </div>

          {/* 모바일 우측 버튼들 */}
          <div className="flex items-center space-x-4 lg:hidden">
            {/* 검색 버튼 */}
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* 프로필 버튼 */}
            {isAuthenticated ? (
              <button
                onClick={onOpenLogin}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-gray-500 hover:text-gray-700"
              >
                로그인
              </button>
            )}

            {/* 햄버거 메뉴 버튼 */}
            <button
              onClick={onOpenDrawer}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 