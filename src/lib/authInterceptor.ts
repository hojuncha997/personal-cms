import { useAuthStore } from '@/store/useAuthStore'
import { refreshTokenRequest } from '@/utils/refreshTokenRequest'
import { getTokenPayload } from '@/utils/jwtUtils'
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

  console.log('setAuthToken 호출:', token);

   // 현재 상태 확인
   const currentState = useAuthStore.getState();
  
   // 토큰이 이미 설정되어 있고, 같은 토큰으로 다시 설정하려는 경우 스킵
   if (currentState.accessToken === token) {
     console.log('Token already set, skipping...');
     return;
   }
 
   console.log('Setting new auth token...');


  if (!token) {
    useAuthStore.getState().resetAuthState();
    return;
  }

  try {
    const payload = getTokenPayload(token);
    useAuthStore.getState().updateAuthState({
      accessToken: token,
      tokenExpiry: payload.exp * 1000,
      role: payload.role,
      email: payload.email,
      sub: payload.sub,
      isAuthenticated: true,
    });

    console.log('setAuthToken 호출 후:', useAuthStore.getState());

    // useAuthStore에서 Partial을 사용했기 때문에 아래와 같이 개별 필드를 업데이트할 수 있다.
    // useAuthStore.getState().updateAuthState({
    //   email: "new@email.com",
    //   role: "ADMIN"
    // });

    /* 추후 이렇게 처리하자.
try {
  const decodedToken = getTokenPayload(token);
  
  if (isTokenExpired(decodedToken.exp)) {
    throw new TokenError('Token has expired', 'EXPIRED');
  }

  const remainingTime = getRemainingTime(decodedToken.exp);
  console.log(`Token will expire in ${remainingTime}ms`);

  useAuthStore.getState().updateAuthState({
    accessToken: token,
    tokenExpiry: getTokenExpiryTime(decodedToken.exp),
    ...decodedToken
  });
} catch (error) {
  if (error instanceof TokenError) {
    // 특정 에러 타입에 따른 처리
  }
  useAuthStore.getState().resetAuthState();
}
    */

    console.log('토큰 설정 완료:', useAuthStore.getState());
  } catch (error) {
    console.error('토큰 처리 실패:', error);
    useAuthStore.getState().resetAuthState();
    throw new TokenError('유효하지 않은 토큰 형식입니다.');
  }
} 