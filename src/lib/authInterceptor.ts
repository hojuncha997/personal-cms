// src/lib/authInterceptor.ts

import { useAuthStore } from '@/store/useAuthStore'
import { refreshTokenRequest } from '@/utils/refreshTokenRequest'
import { getTokenPayload } from '@/utils/jwtUtils'
import { TokenError } from '@/types/authTypes'

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []
let refreshPromise: Promise<string> | null = null;  // 토큰 갱신 Promise 저장용

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
  console.log('[handleTokenRefresh] 토큰 갱신 시작');
  
  // 이미 진행 중인 갱신 요청이 있다면 해당 Promise 반환
  if (refreshPromise) {
    console.log('[handleTokenRefresh] 이미 진행 중인 갱신 요청 재사용');
    return refreshPromise;
  }

  isRefreshing = true;
  
  // 새로운 갱신 요청 생성
  refreshPromise = (async () => {
    try {
      console.log('[handleTokenRefresh] refresh_token으로 새 토큰 요청');
      const newToken = await refreshTokenRequest();
      
      console.log('[handleTokenRefresh] 새 토큰 검증 및 저장 시작');
      setAuthToken(newToken);
      
      // 대기 중인 요청들 처리
      refreshSubscribers.forEach(callback => callback(newToken));
      
      console.log('[handleTokenRefresh] 토큰 갱신 성공');
      return newToken;
    } catch (error) {
      console.error('[handleTokenRefresh] 토큰 갱신 실패:', error);
      throw error;
    } finally {
      isRefreshing = false;
      refreshSubscribers = [];
      refreshPromise = null;  // Promise 초기화
    }
  })();

  return refreshPromise;
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

/**
 * 토큰 설정을 한 곳에서 관리하는 유틸리티 함수 추가
 * 
 * interface DecodedToken {
  email: string;
  sub: string;
  role: string;
  preferences: {
    theme: string;
    language: string;
    timezone: string;
  };
  tokenVersion: number;
  keepLoggedIn: boolean;
  iat: number;
  exp: number;
  // [key: string]: any;
}
 */


export function setAuthToken(token: string | null) {


  // console.log('setAuthToken 호출:', token);

  //  // 현재 상태 확인
  //  const currentState = useAuthStore.getState();
  
  //  // 토큰이 이미 설정되어 있고, 같은 토큰으로 다시 설정하려는 경우 스킵
  //  if (currentState.accessToken === token) {
  //    console.log('Token already set, skipping...');
  //    return;
  //  }
 
  //  console.log('Setting new auth token...');

  console.log('[setAuthToken] 토큰 설정 시작');

  if (!token) {
    console.log('[setAuthToken] 토큰이 null, 인증 상태 초기화');
    useAuthStore.getState().resetAuthState();
    return;
  }

  try {
    console.log('[setAuthToken] 토큰 유효성 검증');
    const payload = getTokenPayload(token);
    
    console.log('[setAuthToken] store에 토큰 정보 저장');
    useAuthStore.getState().updateAuthState({
      accessToken: token,
      tokenExpiry: payload.exp * 1000,
      role: payload.role,
      email: payload.email,
      sub: payload.sub,
      isAuthenticated: true,
    });
    
    console.log('[setAuthToken] 토큰 설정 완료');
  } catch (error) {
    console.error('[setAuthToken] 토큰 검증 실패:', error);
    useAuthStore.getState().resetAuthState();
    throw new TokenError('유효하지 않은 토큰 형식입니다.');
  }
} 