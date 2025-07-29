'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { NavProfile } from './nav-profile'
import Link from 'next/link'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { Container } from '@/components/layouts/Container'
import { CommonDrawer } from '@components/common/common-drawer'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Logo } from '@components/common/logo'
import { NavMenuContent } from '@/constants/navigation'
import { themeClasses } from '@/styles/theme-classes'
import { theme } from '@/constants/styles/theme'
import { Button } from '@/components/ui'

interface NavContainerProps {
  onOpenDrawer: () => void;
  onOpenLogin: () => void;
  hideOnScroll?: boolean;
}

export function NavContainer({ 
  onOpenDrawer, 
  onOpenLogin, 
  hideOnScroll = false
}: NavContainerProps) {
  const scrollDirection = useScrollDirection()
  const isScrollingDown = hideOnScroll && scrollDirection
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
        <div className={`${theme.button.secondary.border} rounded-full flex items-center`}>
          <div className="cursor-pointer">
            {/* 프로필 메뉴 컴포넌트 */}
            <NavProfile />
          </div>
        </div>
      )
    }

    if (loading) {
      return <div className={`h-4 w-20 ${themeClasses.skeleton.base}`} />
    }

    return (
      <Button 
        variant="secondary"
        onClick={onOpenLogin} 
        className="py-1 px-2 text-sm"
      >
        로그인
      </Button>
    )
  }

  return (
    <nav className={`fixed w-full ${theme.card.bg} border-b ${theme.card.border.split(' ')[1]} z-10 transition-transform duration-200 ${
      isScrollingDown ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <Container className="">
        <div className="flex justify-between h-16 items-center">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo width={32} height={32} />
              <span className={`hidden md:block ${theme.button.secondary.text} text-xl font-bold`}>notes&nodes</span>
            </Link>
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
           {NavMenuContent.map((item) => {
             return (
              <Link 
                href={item.path} 
                key={item.id} 
                className={`text-sm ${theme.button.secondary.text} ${theme.button.primary.hover.replace('bg-', 'text-')} transition-all duration-200 ${pathname === item.path ? 'font-bold' : ''}`}
              >
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
              className={`${theme.button.secondary.text.replace('text-black', 'text-gray-500')} ${theme.button.primary.hover.replace('bg-', 'text-')} transition-all duration-200`}
            >
              <svg className={`h-6 w-6 ${theme.button.secondary.text}`} fill="none" strokeWidth="1" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <CommonDrawer 
              trigger={null}
              isOpen={isDrawerOpen} 
              onClose={() => setIsDrawerOpen(false)}
              portalTo="drawer-root"
              drawerWidth='10rem'
              drawerHeight='100vh'
              hasBlur={false}
              hasOverlay={true}
              position='right'
              title={`메뉴`}
            >
              <div className="flex flex-col">
                {NavMenuContent.map((item) => {
                  return (
                    <div key={item.id} className="p-4">
                      <span 
                        className={`${theme.button.secondary.text} ${theme.button.primary.hover.replace('bg-', 'text-')} cursor-pointer transition-all duration-200 ${pathname === item.path ? 'font-bold' : ''}`} 
                        onClick={() => handleLinkClick(item.path)}
                      > 
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