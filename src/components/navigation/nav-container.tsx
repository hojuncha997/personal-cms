'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { NavProfile } from './nav-profile'
import Link from 'next/link'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { Container } from '@/components/layouts/Container'

interface NavContainerProps {
  onOpenDrawer: () => void;
  onOpenLogin: () => void;
}

export function NavContainer({ onOpenDrawer, onOpenLogin }: NavContainerProps) {
  const isScrollingDown = useScrollDirection()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const email = useAuthStore(state => state.email)
  const loading = useAuthStore(state => state.loading)

  const renderAuthButton = () => {
    if (isAuthenticated) {
      return (
        <div className="border-[1px] border-gray-300 rounded-md p-1 flex items-center">
          <NavProfile />
        </div>
      )
    }

    if (loading) {
      return <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
    }

    return (
      <button 
        onClick={onOpenLogin} 
        className="border-[1px] border-gray-300 rounded-md p-1 text-gray-700 hover:text-gray-700"
      >
        로그인
      </button>
    )
  }

  return (
    <nav className={`fixed w-full bg-white shadow-md z-10 transition-transform duration-200 ${
      isScrollingDown ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <Container>
        <div className="flex justify-between h-16 items-center">
          {/* 로고 */}
          <div className="flex items-center">
            <a href="/" className="text-xl text-gray-600">블로그</a>
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">홈</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">소개</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">서비스</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">문의하기</Link>
            {renderAuthButton()}
          </div>

          {/* 모바일 메뉴 */}
          <div className="flex lg:hidden items-center space-x-4">
            {renderAuthButton()}
            <button 
              onClick={onOpenDrawer}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </nav>
  )
} 