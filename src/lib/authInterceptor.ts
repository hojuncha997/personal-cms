// src/lib/authInterceptor.ts

import { useAuthStore } from '@/store/useAuthStore'
import { refreshTokenRequest } from '@/utils/refreshTokenRequest'
import { getTokenPayload } from '@/utils/jwtUtils'
import { TokenError } from '@/types/authTypes'
import { logger } from '@/utils/logger'

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// 토큰 갱신 요청을 관리하기 위한 프로미스 객체가 담기게 된다.
let refreshPromise: Promise<string> | null = null

// 인터셉터 초기화 여부
let isInitialized = false

// 프로미스를 반환하는 함수를 담는 배열: 비동기 요청을 관리하기 위한 큐를 구현하기 위함
const requestQueue: Array<() => Promise<any>> = []

/**
 * 인증 인터셉터 모듈
 * 
 * 이 모듈은 JWT 토큰 기반의 인증 시스템을 관리하며, 다음과 같은 주요 기능을 제공:
 * - 토큰 갱신 관리
 * - 인증 상태 관리
 * - 요청 큐 관리
 * - 다중 탭 동기화
 */

/**
 * 인터셉터의 초기화 상태를 확인하는 함수
 * @returns {boolean} 인터셉터가 초기화되었는지 여부
 */
export function isInterceptorInitialized(): boolean {
  return isInitialized
}

/**
 * 인터셉터 초기화 완료를 표시하는 함수
 * AuthProvider에서 호출되며, 초기화 완료 후 큐에 있는 요청들을 처리.
 */
export function markInterceptorInitialized() {
  // 초기화 완료 표시
  isInitialized = true
  // 큐에 있는 요청 처리
  processQueuedRequests()
}

/**
 * 요청을 큐에 추가하는 함수
 * 인터셉터가 초기화되기 전에 들어오는 요청들을 큐에 저장하고 처리.
 * 
 * @param {() => Promise<any>} request - 큐에 추가할 비동기 요청 함수
 * @returns {Promise<any>} 요청 처리 결과
 */
export function queueRequest(request: () => Promise<any>) {
  if (!isInitialized) {
    // 초기화 완료 전 요청이 들어오면 큐에 추가
    requestQueue.push(request)
    return new Promise((resolve, reject) => {
      // 큐에 있는 요청이 처리될 때까지 대기
      const checkQueue = setInterval(() => {
        if (isInitialized) {
          clearInterval(checkQueue)
          request()
            .then(resolve)
            .catch(reject)
        }
      }, 100)
    })
  }
  return request()
}

/**
 * 큐에 저장된 요청들을 순차적으로 처리하는 함수
 * 인터셉터 초기화 완료 후 호출.
 */
async function processQueuedRequests() {
  while (requestQueue.length > 0) {
    const request = requestQueue.shift()
    if (request) {
      try {
        await request()
      } catch (error) {
        logger.error('[processQueuedRequests] 큐 요청 처리 실패:', error)
      }
    }
  }
}

/**
 * 토큰 갱신을 처리하는 핵심 함수
 * 
 * 갱신 프로세스:
 * 1. 이미 진행 중인 갱신 요청이 있는지 확인
 * 2. 새로운 갱신 요청 생성 및 처리
 * 3. 대기 중인 요청들에 새 토큰 전달
 * 
 * @returns {Promise<string>} 갱신된 새로운 토큰
 */
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
      await setAuthToken(newToken);
      
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

/**
 * 토큰 갱신 대기 중인 콜백 함수를 등록하는 함수
 * 
 * @param {(token: string) => void} callback - 토큰 갱신 완료 시 실행될 콜백 함수
 */
export function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * 토큰 갱신이 필요한지 확인하는 함수
 * 만료 10분 전부터 갱신 시도.
 * 
 * @returns {boolean} 토큰 갱신 필요 여부
 */
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

/**
 * 인증 토큰을 설정하고 관련 상태를 업데이트하는 함수
 * 
 * @param {string | null} token - 설정할 JWT 토큰 또는 null (로그아웃 시)
 * @throws {Error} 토큰이 유효하지 않거나 상태 업데이트 실패 시
 */
export async function setAuthToken(token: string | null) {
  try {
    if (!token) {
      useAuthStore.getState().resetAuthState();
      useAuthStore.getState().resetProfile();
      useAuthStore.getState().setLoading(false);
      return;
    }

    const payload = getTokenPayload(token);
    if (!payload) {
      throw new Error('Invalid token');
    }

    // 상태 업데이트
    await new Promise<void>((resolve) => {
      useAuthStore.getState().updateAuthState({
        accessToken: token,
        tokenExpiry: payload.exp * 1000,
        role: payload.role,
        sub: payload.sub,
        tokenVersion: payload.tokenVersion,
        keepLoggedIn: payload.keepLoggedIn,
        isAuthenticated: true
      });
      resolve();
    });

    // 상태가 업데이트되었는지 확인
    const state = useAuthStore.getState();
    if (!state.isAuthenticated) {
      throw new Error('Failed to update auth state');
    }

    logger.info('[setAuthToken] 토큰 설정 완료:', {
      sub: payload.sub,
      role: payload.role,
      tokenVersion: payload.tokenVersion,
      keepLoggedIn: payload.keepLoggedIn
    });

  } catch (error) {
    logger.error('[setAuthToken] 토큰 설정 실패:', error);
    useAuthStore.getState().resetAuthState();
    useAuthStore.getState().resetProfile();
    useAuthStore.getState().setLoading(false);
    throw error;
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