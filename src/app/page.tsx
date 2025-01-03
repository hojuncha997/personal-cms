'use client'

import Navigation from '@/components/Navigation'
import Drawer from '@/components/Drawer'
import LoginModal from '@/components/LoginModal'
import { useState } from 'react'
import Carousel from '@/components/Carousel'
import PostSection from '@/components/PostSection'
import Footer from '@/components/Footer'

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f1f5f9] to-[#ffffff]">
      <Navigation 
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
      <div className="pt-16">
        <Carousel />
        <PostSection />
      </div>
      <Drawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        // onOpenLogin={() => setIsLoginModalOpen(true)}
      />
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <Footer />
    </main>
  )
}
