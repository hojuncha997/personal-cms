// src/utils/refreshTokenRequest.ts



/**
 * 토큰 갱신 전용 요청 함수
 * 
 * 참고: 이 함수는 의도적으로 fetchClient 대신 직접 fetch를 사용함.
 * 이유:
 * 1. 순환 참조 방지: fetchClient는 내부적으로 토큰 만료 시 이 함수를 호출함.
 *    만약 이 함수가 다시 fetchClient를 사용한다면 무한 루프가 발생할 수 있음.
 * 
 * 2. 인증 로직 분리: 토큰 갱신 요청은 인증 시스템의 기반이 되는 특별한 요청으로,
 *    일반 API 요청과는 다른 처리가 필요함.
 * 
 * 3. 안정성 보장: 인증 인터셉터를 거치지 않음으로써, 토큰 갱신 과정이
 *    다른 인증 관련 로직의 상태에 영향을 받지 않도록 함.
 */



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
      'x-client-type': 'web'
    },
    // body: JSON.stringify({ clientType: 'web' })
  })

  if (!response.ok) {
    const error: AuthError = await response.json()
    throw new Error(error.message ?? '토큰 리프레시 실패')
  }

  const data = await response.json()
  return data.access_token
} 