import { useAuthStore } from '@/store/useAuthStore'
import { refreshTokenRequest } from '@/utils/refreshTokenRequest'
import { getTokenExpiry } from '@/utils/jwtUtils'
import { TokenError } from '@/types/authTypes'

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// 토큰 갱신 관련 핵심 로직
// - 토큰 갱신 상태 관리 (isRefreshing)
// - 대기 중인 요청 관리 (refreshSubscribers)
// - 토큰 만료 시점 확인
// - 실제 토큰 갱신 수행

// 갱신 절차:
// 1. handleTokenRefresh: 새 토큰 요청 및 저장
// 2. addRefreshSubscriber: 대기 중인 요청 등록
// 3. shouldRefreshToken: 갱신 필요 여부 확인

export async function handleTokenRefresh() {
  try {
    const newToken = await refreshTokenRequest()
    setAuthToken(newToken)
    refreshSubscribers.forEach(callback => callback(newToken))
    return newToken
  } catch (error) {
    if (error instanceof TokenError) {
      // 토큰 관련 에러는 그대로 전파
      throw error;
    }
    // 기타 에러는 TokenError로 변환
    throw new TokenError('토큰 갱신에 실패했습니다.');
  } finally {
    isRefreshing = false
    refreshSubscribers = []
  }
}

export function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

export function shouldRefreshToken(): boolean {
  const tokenExpiry = useAuthStore.getState().tokenExpiry
  if (!tokenExpiry) return false
  
  // 만료 10분 전부터 갱신 허용
  return Date.now() >= tokenExpiry - 10 * 60 * 1000
}

export { isRefreshing } 

// 토큰 설정을 한 곳에서 관리하는 유틸리티 함수 추가
export function setAuthToken(token: string | null) {
  if (!token) {
    useAuthStore.getState().setAccessToken(null);
    useAuthStore.getState().setTokenExpiry(null);
    return;
  }

  try {
    const expiry = getTokenExpiry(token);
    useAuthStore.getState().setTokenExpiry(expiry);
    useAuthStore.getState().setAccessToken(token);
  } catch (error) {
    console.error('토큰 처리 실패:', error);
    useAuthStore.getState().setAccessToken(null);
    useAuthStore.getState().setTokenExpiry(null);
    throw new TokenError('유효하지 않은 토큰 형식입니다.');
  }
} 