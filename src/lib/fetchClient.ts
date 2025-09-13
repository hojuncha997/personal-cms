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
  shouldRefreshToken,
  queueRequest,
  isInterceptorInitialized
} from './authInterceptor'
import { logger } from '@/utils/logger'
import { deduplicateRequest, createRequestKey } from './requestDeduplicator'

export interface FetchOptions extends RequestInit {
  body?: any;
  // 인증 헤더를 건너뛰는 옵션
  skipAuth?: boolean
}

export async function fetchClient(url: string, options: FetchOptions = {skipAuth: false}): Promise<Response> {
  // 로그인 관련 요청은 queueRequest를 건너뛰기 위한 엔드포인트 체크
  const isAuthRequest = [
    '/auth/login',
    '/auth/local/login',
    '/auth/refresh',
    '/auth/access-token',
    '/auth/google/callback',
    '/auth/kakao/callback',
    '/auth/naver/callback',
    '/auth/signup',
    '/auth/local/signup'
  ].some(endpoint => url.startsWith(endpoint));

  const executeRequest = async () => {
    const { skipAuth, ...fetchOptions } = options

    logger.info('[fetchClient] 요청 시작:', {
      url,
      method: options.method || 'GET',
      skipAuth,
      isAuthRequest,
      headers: fetchOptions.headers,
      body: options.body
    });

    // 제외할 엔드포인트 체크
    const isExcludedEndpoint = ['/auth/access-token', '/auth/google/callback', '/auth/kakao/callback', '/auth/naver/callback'].some(
      endpoint => url.includes(endpoint)
    );

    // 요청 전 인터셉터
    if (!skipAuth && !isExcludedEndpoint) {
      const accessToken = useAuthStore.getState().accessToken;
      
      if (!accessToken || shouldRefreshToken()) {
        logger.info('[fetchClient] 토큰 갱신 필요');
        
        try {
          const newToken = await handleTokenRefresh();
          logger.info('[fetchClient] 토큰 갱신 완료');
          
          // 헤더에 새 토큰 추가
          fetchOptions.headers = {
            ...fetchOptions.headers,
            'Authorization': `Bearer ${newToken}`
          };
        } catch (error) {
          logger.error('[fetchClient] 토큰 갱신 실패:', error);
          throw error;
        }
      } else {
        // 유효한 토큰이 있는 경우
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${accessToken}`
        };
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    const config = {
      ...fetchOptions,
      headers,
      credentials: 'include' as RequestCredentials,
    };

    // POST나 PUT 요청이고 body가 있다면 JSON 문자열로 변환
    if (config.body && (options.method === 'POST' || options.method === 'PUT')) {
      config.body = typeof config.body === 'string' 
        ? config.body 
        : JSON.stringify(config.body);
    }

    // 요청 실행 전
    logger.info('Final request config:', {
      url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      method: config.method,
      headers: config.headers,
      body: config.body
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, config);

    // 응답 로깅
    logger.info('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    // 401 에러 처리 로직 단순화
    if (response.status === 401 && !skipAuth && !isExcludedEndpoint) {
      logger.info('[fetchClient] 401 응답 감지, 토큰 갱신 후 재시도');
      
      try {
        const newToken = await handleTokenRefresh();
        
        // 갱신된 토큰으로 재요청
        return executeRequest();
      } catch (error) {
        logger.error('[fetchClient] 토큰 갱신 실패:', error);
        throw error;
      }
    }

    if (!response.ok) {
      const error = new Error() as any;
      error.status = response.status;
      
      try {
        error.details = await response.json();
      } catch {
        try {
          error.details = await response.text();
        } catch {
          error.details = "서버에서 제공된 에러 메시지가 없습니다.";
        }
      }
      
      error.message = `HTTP error! status: ${response.status} - ${JSON.stringify(error.details)}`;
      throw error;
    }

    return response;
  };

  // 요청 중복 제거를 위한 키 생성
  const requestKey = createRequestKey(
    url, 
    options.method || 'GET', 
    !options.skipAuth
  );

  // 인증 관련 요청은 queueRequest를 건너뛰고 바로 실행 (하지만 중복 제거는 적용)
  if (isAuthRequest) {
    return deduplicateRequest(requestKey, executeRequest);
  }

  // 그 외 요청은 queueRequest와 중복 제거 모두 적용
  return queueRequest(() => deduplicateRequest(requestKey, executeRequest));
}


/*
// 이렇게 사용하면 훅에서 호출할 때 편리함: 추후 고려해볼 필요 있음
export const fetchClient = {
    get: (url: string, options?: FetchOptions) => fetchClient(url, options),
    post: (url: string, options?: FetchOptions) => fetchClient(url, options),
    put: (url: string, options?: FetchOptions) => fetchClient(url, options),
    patch: (url: string, options?: FetchOptions) => fetchClient(url, options),
    delete: (url: string, options?: FetchOptions) => fetchClient(url, options),
};
*/