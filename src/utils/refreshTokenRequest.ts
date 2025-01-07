// src/utils/refreshTokenRequest.ts

// 순수한 토큰 갱신 API 요청
// - 리프레시 토큰으로 새 액세스 토큰 요청
// - 서버와의 실제 통신 담당
// - 에러 처리

// 갱신 요청 절차:
// 1. 리프레시 토큰으로 API 요청
// 2. 응답 처리 및 에러 체크
// 3. 새 액세스 토큰 반환

import { AuthError } from '@/types/authTypes'
export async function refreshTokenRequest() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clientType: 'web' })
  })

  if (!response.ok) {
    const error: AuthError = await response.json()
    throw new Error(error.message ?? '토큰 리프레시 실패')
  }

  const data = await response.json()
  return data.access_token
} 