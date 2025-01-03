 // src/app/providers.tsx
 // 프로바이더들을 모아둔 파일 
 
 'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
        {/* 여기에 다른 프로바이더들을 추가할 수 있음 */}
      {children}
    </QueryClientProvider>
  )
}