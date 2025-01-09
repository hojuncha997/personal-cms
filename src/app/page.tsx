'use client'

import Carousel from '@/components/Carousel'
import PostSection from '@/components/PostSection'

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#f1f5f9] to-[#ffffff]">
      <Carousel />
      <PostSection />
    </div>
  )
}
