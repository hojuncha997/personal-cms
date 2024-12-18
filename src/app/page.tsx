'use client'

import Navigation from '@/components/Navigation'
import Drawer from '@/components/Drawer'
import { useState } from 'react'

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f1f5f9] to-[#ffffff]">
      <Navigation onOpenDrawer={() => setIsDrawerOpen(true)} />
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {/* 기존 페이지 컨텐츠 */}
      <div className="pt-20"> {/* 네비게이션 높이만큼 상단 여백 추가 */}
        {/* 기존 컨텐츠 */}
      </div>
    </main>
  )
}
