'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { NavProfile } from './nav-profile'
import Link from 'next/link'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { Container } from '@/components/layouts/Container'
import { CommonDrawer } from '@components/common/common-drawer'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { colors } from '@/constants/styles'

interface NavContainerProps {
  onOpenDrawer: () => void;
  onOpenLogin: () => void;
}

const NavMenuContent = [
  {
    id: 'home',
    label: '홈',
    path: '/'
  },
  {
    id: 'about',
    label: '소개',
    path: '/about'
  },
  {
    id: 'service',
    label: '서비스',
    path: '/service'
  },
  {
    id: 'posts',
    label: '포스팅',
    path: '/posts'
  },
  {
    id: 'projects',
    label: '프로젝트',
    path: '/projects'
  },

  {
    id: 'contact',
    label: '문의하기',
    path: '/contact'
  },
  {
    id: 'guestbook',
    label: '방명록',
    path: '/guestbook'
  }
]

export function NavContainer({ onOpenDrawer, onOpenLogin }: NavContainerProps) {
  const isScrollingDown = useScrollDirection()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const email = useAuthStore(state => state.email)
  const loading = useAuthStore(state => state.loading)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLinkClick = (path: string) => {
    router.push(path)
    setIsDrawerOpen(false)
  }

  const renderAuthButton = () => {
    if (isAuthenticated) {
      return (
        <div className="border-[1px] border-black rounded-md p-1 flex items-center text-black hover:bg-black hover:text-white group">
          <div className="group-hover:text-white cursor-pointer">
            <NavProfile />
          </div>
        </div>
      )
    }

    if (loading) {
      return <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
    }

    return (
      <button 
        onClick={onOpenLogin} 
        className="border-[1px] border-black p-1 text-black hover:text-gray-700"
      >
        로그인
      </button>
    )
  }

  return (
    // <nav className={`fixed w-full bg-white shadow-md z-10 transition-transform duration-200 ${
    //   isScrollingDown ? '-translate-y-full' : 'translate-y-0'
    // }`}>
    <nav style={{backgroundColor: colors.primary.main}} className={`fixed w-full bg-[${colors.primary.main}] border-b-[1px] border-black z-10 transition-transform duration-200 ${
      isScrollingDown ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <Container>
        <div className="flex justify-between h-16 items-center">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="text-xl text-black">차호준의 블로그</Link>
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
           {NavMenuContent.map((item) => {
             return (
              <Link href={item.path} key={item.id} className="text-black hover:text-gray-900">
                {item.label}
              </Link>
             )
           })}
            {renderAuthButton()}
          </div>

          {/* 모바일 메뉴 */}
          <div className="flex lg:hidden items-center space-x-4">
            {renderAuthButton()}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6 text-black" fill="none" strokeWidth="1" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <CommonDrawer 
              trigger={null}
              isOpen={isDrawerOpen} 
              onClose={() => setIsDrawerOpen(false)}
              portalTo="drawer-root"
              drawerWidth={10}
              hasBlur={false}
              position='right'
              title={`메뉴`}
            >
              <div className="flex flex-col">
                {NavMenuContent.map((item) => {
                  return (
                    <div key={item.id} className="p-4">
                    <span className="text-gray-600 hover:text-orange-500" onClick={() => handleLinkClick(item.path)}> 
                      {item.label}
                    </span>
                  </div>
                  )
                })}
              </div>
            </CommonDrawer>
          </div>
        </div>
      </Container>
    </nav>
  )
} 