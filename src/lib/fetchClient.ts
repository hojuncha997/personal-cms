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
  body?: any;
  // 인증 헤더를 건너뛰는 옵션
  skipAuth?: boolean
}

export async function fetchClient(url: string, options: FetchOptions = {}): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options

  // 제외할 엔드포인트 체크
  const isExcludedEndpoint = ['/auth/access-token', '/auth/google/callback', '/auth/kakao/callback', '/auth/naver/callback'].some(
    endpoint => url.includes(endpoint)
  );

  // 요청 전 인터셉터
  if (!skipAuth && !isExcludedEndpoint) {  // 제외 엔드포인트 체크 추가
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
    // body가 이미 문자열인지 확인
    config.body = typeof config.body === 'string' 
      ? config.body 
      : JSON.stringify(config.body);
  }

  // 요청 실행
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, config);

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

  if (!response.ok) {
    // 서버로부터 더 자세한 에러 정보 가져오기
    let errorDetails;
    try {
      errorDetails = await response.json();
    } catch (jsonError) {
      try {
        errorDetails = await response.text();
      } catch (textError) {
        errorDetails = "서버에서 제공된 에러 메시지가 없습니다.";
      }
    }

    throw new Error(
      `HTTP error! status: ${response.status} - ${JSON.stringify(errorDetails)}`
    );
  }
  // return response.json();  // response를 JSON으로 파싱하여 반환
  return response;  // response.json() 대신 Response 객체 반환: 개별 엔드포인트에서 변환하여 사용
}
