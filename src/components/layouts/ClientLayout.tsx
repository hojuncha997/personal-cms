'use client'

import { NavContainer } from '@/components/navigation'
import Footer from '@/components/Footer'
import { useState } from 'react'
// import Drawer from '@/components/Drawer'
import LoginModal from '@/components/LoginModal'
interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* 네비게이션바 높이는 h-16(64px)로 컴포넌트 내부에 설정돼 있음 */}
      <NavContainer 
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
      <div className="pt-16 flex-grow">
        {children}
      </div>
      {/* 모든 모달류는 여기에 배치 */}
      {/* <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} /> */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      {/* CommonDrawer는 각 컴포넌트에서 사용하되, 렌더링은 여기서 되도록 함. 포탈 방식으로 구현 */}
      <div id="drawer-root" />
      <Footer />
    </div>
  )
} 

    {/* 네비게이션바 높이만큼 여백을 주기 위해 pt-16 설정. 또한 flex-grow(flex-grow:1) 설정으로 내용의 길이와 상관없이 화면 전체를 채우도록 함 
      flex-grow:1의 역할은 flex컨테이너 내에서 채워지지 않는 공간이 있을 때 그 공간을 채우는 배율을 지정하는 것이다. 현재는 최상단 div에
      min-h-screen 설정으로 화면 전체를 채우도록 되어 있다. 따라서 화면은 전부 채우게 된다. 그런데 이때 children의 높이가 작다면,
      그 바로 아래 푸터가 붙어버려 푸터 밑에 공간이 생기게 된다. 이를 방지하기 위해 children을 감싸는 div에 flex-grow:1을 해줘서 
      전체 div에서 children과 푸터의 높이를 뺀 남은 공간이 전부 채워지게 되는 것이다.
      */}