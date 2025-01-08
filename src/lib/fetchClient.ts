// src/lib/fetchClient.ts

// API 요청 인터셉터
// - 요청 전: 토큰 만료 확인 및 갱신
// - 요청 중: 인증 헤더 자동 추가
// - 응답 후: 401 에러 처리

// 요청 처리 절차:
// 1. 요청 전 토큰 체크 (shouldRefreshToken)
// 2. 필요시 토큰 갱신 또는 대기
// 3. 인증 헤더 추가
// 4. 요청 실행
// 5. 401 응답시 토큰 갱신 후 재시도

import { useAuthStore } from '@/store/useAuthStore'
import { 
  isRefreshing, 
  handleTokenRefresh, 
  addRefreshSubscriber,
  shouldRefreshToken 
} from './authInterceptor'

export interface FetchOptions extends RequestInit {
 // 인증 헤더를 건너뛰는 옵션
 skipAuth?: boolean
}

export async function fetchClient(url: string, options: FetchOptions = {}): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options

  // 요청 전 인터셉터
  if (!skipAuth) {
    // 토큰 만료 임박 체크
    if (shouldRefreshToken()) {
      console.log('토큰 만료 임박 체크')
      if (isRefreshing) {
        // 진행 중인 갱신 작업이 있다면 대기
        await new Promise(resolve => addRefreshSubscriber(() => resolve(null)))
      } else {
        // 토큰 갱신 시도
        await handleTokenRefresh()
      }
    }

    // 헤더에 토큰 추가
    const token = useAuthStore.getState().accessToken
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`
      }
    }
  }

  // 요청 실행
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...fetchOptions,
    credentials: 'include'
  })

  // 응답 인터셉터
  if (response.status === 401 && !skipAuth) {
    if (isRefreshing) {
      return new Promise(resolve => {
        addRefreshSubscriber(() => {
          resolve(fetchClient(url, { ...options, skipAuth: true }))
        })
      })
    }

    const newToken = await handleTokenRefresh()
    return fetchClient(url, { 
      ...options, 
      skipAuth: true,
      headers: {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${newToken}`
      }
    })
  }

  return response
}
