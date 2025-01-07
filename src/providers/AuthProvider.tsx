// src/providers/AuthProvider.tsx
// 앱의 인증 상태 관리
// - 초기 인증 시도
// - 탭 전환시 토큰 체크 (visibilitychange)
// - 네트워크 복구시 토큰 체크 (online)

// 이벤트 기반 갱신 절차:
// 1. 앱 시작시 최초 인증
// 2. 탭 활성화시 토큰 상태 확인
// 3. 네트워크 복구시 토큰 상태 확인

'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { shouldRefreshToken, handleTokenRefresh } from '@/lib/authInterceptor'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setLoading = useAuthStore(state => state.setLoading)

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true)
        await handleTokenRefresh()
        // 약간의 지연을 주어 깜빡임 방지
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error('초기 인증 실패:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const currentToken = useAuthStore.getState().accessToken
        if (currentToken && shouldRefreshToken()) {
          await handleTokenRefresh()
        }
      }
    }

    const handleOnline = async () => {
      const currentToken = useAuthStore.getState().accessToken
      if (currentToken && shouldRefreshToken()) {
        await handleTokenRefresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
      mounted = false
    }
  }, [])

  return <>{children}</>
}