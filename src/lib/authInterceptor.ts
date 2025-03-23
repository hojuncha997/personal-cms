// src/lib/authInterceptor.ts

import { useAuthStore } from '@/store/useAuthStore'
import { refreshTokenRequest } from '@/utils/refreshTokenRequest'
import { getTokenPayload } from '@/utils/jwtUtils'
import { TokenError } from '@/types/authTypes'
import { logger } from '@/utils/logger'

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
  logger.info('[handleTokenRefresh] 토큰 갱신 시작');
  
  // 이미 진행 중인 갱신 요청이 있다면 해당 Promise 반환
  if (refreshPromise) {
    logger.info('[handleTokenRefresh] 이미 진행 중인 갱신 요청 재사용');
    return refreshPromise;
  }

  isRefreshing = true;
  
  // 새로운 갱신 요청 생성
  refreshPromise = (async () => {
    try {
      logger.info('[handleTokenRefresh] refresh_token으로 새 토큰 요청');
      const newToken = await refreshTokenRequest();
      
      logger.info('[handleTokenRefresh] 새 토큰 검증 및 저장 시작');
      setAuthToken(newToken);
      
      // 대기 중인 요청들 처리
      refreshSubscribers.forEach(callback => callback(newToken));
      
      logger.info('[handleTokenRefresh] 토큰 갱신 성공');
      return newToken;
    } catch (error) {
      logger.error('[handleTokenRefresh] 토큰 갱신 실패:', error);
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


export async function setAuthToken(token: string | null) {
  logger.info('[setAuthToken] 토큰 설정 시작');

  if (!token) {
    logger.info('[setAuthToken] 토큰이 null, 인증 상태 초기화');
    useAuthStore.getState().resetAuthState();
    useAuthStore.getState().setLoading(false);
    return;
  }

  try {
    logger.info('[setAuthToken] 토큰 유효성 검증');
    const payload = getTokenPayload(token);
    
    logger.info('[setAuthToken] store에 토큰 정보 저장');
    // 상태 업데이트를 Promise로 감싸서 완료를 보장
    await new Promise<void>((resolve) => {
      useAuthStore.getState().updateAuthState({
        accessToken: token,
        tokenExpiry: payload.exp * 1000,
        nickname: payload.nickname || null,
        role: payload.role,
        email: payload.email,
        sub: payload.sub,
        isAuthenticated: true,
      });
      
      // 다음 렌더 사이클에서 상태가 실제로 업데이트되었는지 확인
      requestAnimationFrame(() => {
        const state = useAuthStore.getState();
        if (state.isAuthenticated && state.role === payload.role) {
          useAuthStore.getState().setLoading(false);
          resolve();
        }
      });
    });
    
    logger.info('[setAuthToken] 토큰 설정 완료');
  } catch (error) {
    logger.error('[setAuthToken] 토큰 검증 실패:', error);
    useAuthStore.getState().resetAuthState();
    useAuthStore.getState().setLoading(false);
    throw new TokenError('유효하지 않은 토큰 형식입니다.');
  }
} 

// 다른 탭의 로그아웃 이벤트 감지
// window.addEventListener('storage', (event) => {
//   if (event.key === 'logout-event') {
//     setAuthToken(null);
//     useAuthStore.getState().resetLoginForm();
//     // 필요한 경우 로그인 페이지로 리다이렉트
//   }
// }); 