'use client'

import { NavContainer } from '@/components/navigation'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import LoginModal from '@/components/LoginModal'

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  
  // 모달이나 드로어가 열려있는지 추적
  const isAnyModalOpen = isDrawerOpen || isLoginModalOpen
  
  useEffect(() => {
    // 모달이나 드로어가 열려있을 때 스크롤 방지
    if (isAnyModalOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY
      
      // body에 스크롤 방지 스타일 적용
      document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        top: -${scrollY}px;
        left: 0;
        right: 0;
        width: 100%;
      `

      return () => {
        // 스크롤 방지 스타일 제거
        document.body.style.cssText = ''
        // 스크롤 위치 복원
        window.scrollTo(0, scrollY)
      }
    }
  }, [isAnyModalOpen])

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        네비게이션바 (고정 높이: h-16 = 64px)
        - fixed 포지션으로 상단에 고정
        - 다른 요소들은 pt-16으로 네비게이션바 높이만큼 상단 여백 확보
      */}
      <NavContainer 
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* 
        메인 콘텐츠 영역
        - pt-16: 네비게이션바 높이만큼 상단 패딩
        - flex-grow: 콘텐츠가 적어도 푸터가 항상 하단에 위치하도록 남은 공간 확장
      */}
      <div className="pt-16 flex-grow">
        {children}
      </div>

      {/* 
        모달 및 드로어 영역
        - 포털을 사용하는 컴포넌트들은 drawer-root에 렌더링
        - 일반 모달은 직접 렌더링
      */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        hasBlur={false}
        overlayColor="bg-black"
        overlayOpacity="bg-opacity-50"
      />
      
      {/* 드로어 포털용 컨테이너 */}
      <div id="drawer-root" />

      {/* 
        푸터
        - flex-grow가 적용된 메인 콘텐츠 다음에 위치
        - 콘텐츠가 적을 때도 항상 하단에 고정
      */}
      <Footer />
    </div>
  )
}


// 'use client'

// import { NavContainer } from '@/components/navigation'
// import Footer from '@/components/Footer'
// import { useState } from 'react'
// // import Drawer from '@/components/Drawer'
// import LoginModal from '@/components/LoginModal'
// interface ClientLayoutProps {
//   children: React.ReactNode;
// }

// export default function ClientLayout({ children }: ClientLayoutProps) {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false)
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* 네비게이션바 높이는 h-16(64px)로 컴포넌트 내부에 설정돼 있음 */}
//       <NavContainer 
//         onOpenDrawer={() => setIsDrawerOpen(true)}
//         onOpenLogin={() => setIsLoginModalOpen(true)}
//       />
//       <div className="pt-16 flex-grow">
//         {children}
//       </div>
//       {/* 모든 모달류는 여기에 배치 */}
//       {/* <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} /> */}
//       <LoginModal 
//         isOpen={isLoginModalOpen} 
//         onClose={() => setIsLoginModalOpen(false)} 
//         hasBlur={true}
//         overlayColor="bg-black"
//         overlayOpacity="bg-opacity-50"
//       />
//       {/* CommonDrawer는 각 컴포넌트에서 사용하되, 렌더링은 여기서 되도록 함. 포탈 방식으로 구현 */}
//       <div id="drawer-root" />
//       <Footer />
//     </div>
//   )
// } 

//     {/* 네비게이션바 높이만큼 여백을 주기 위해 pt-16 설정. 또한 flex-grow(flex-grow:1) 설정으로 내용의 길이와 상관없이 화면 전체를 채우도록 함 
//       flex-grow:1의 역할은 flex컨테이너 내에서 채워지지 않는 공간이 있을 때 그 공간을 채우는 배율을 지정하는 것이다. 현재는 최상단 div에
//       min-h-screen 설정으로 화면 전체를 채우도록 되어 있다. 따라서 화면은 전부 채우게 된다. 그런데 이때 children의 높이가 작다면,
//       그 바로 아래 푸터가 붙어버려 푸터 밑에 공간이 생기게 된다. 이를 방지하기 위해 children을 감싸는 div에 flex-grow:1을 해줘서 
//       전체 div에서 children과 푸터의 높이를 뺀 남은 공간이 전부 채워지게 되는 것이다.
//       */}