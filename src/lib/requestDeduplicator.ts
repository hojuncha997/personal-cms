// src/lib/requestDeduplicator.ts
// 동일한 요청이 동시에 여러 번 발생하는 것을 방지하는 유틸리티

interface PendingRequest {
  promise: Promise<Response>;
  timestamp: number;
}

// 진행 중인 요청들을 저장하는 Map
const pendingRequests = new Map<string, PendingRequest>();

// 요청 타임아웃 (30초)
const REQUEST_TIMEOUT = 30 * 1000;

/**
 * 요청 키를 생성하는 함수
 * URL, HTTP 메서드, 인증 헤더를 조합하여 고유한 키 생성
 */
export function createRequestKey(
  url: string, 
  method: string = 'GET', 
  hasAuth: boolean = false
): string {
  return `${method}-${url}-${hasAuth ? 'auth' : 'no-auth'}`;
}

/**
 * 만료된 요청들을 정리하는 함수
 */
function cleanupExpiredRequests() {
  const now = Date.now();
  for (const [key, request] of pendingRequests.entries()) {
    if (now - request.timestamp > REQUEST_TIMEOUT) {
      pendingRequests.delete(key);
    }
  }
}

/**
 * 요청 중복 제거 메인 함수
 * 동일한 요청이 진행 중이면 기존 Promise를 반환하고,
 * 그렇지 않으면 새 요청을 생성하여 반환
 */
export function deduplicateRequest(
  requestKey: string,
  requestFn: () => Promise<Response>
): Promise<Response> {
  
  // 만료된 요청들 정리
  cleanupExpiredRequests();
  
  // 동일한 요청이 진행 중인지 확인
  const existing = pendingRequests.get(requestKey);
  if (existing) {
    console.log(`[RequestDeduplicator] 중복 요청 방지: ${requestKey}`);
    return existing.promise;
  }
  
  // 새 요청 생성
  console.log(`[RequestDeduplicator] 새 요청 생성: ${requestKey}`);
  const promise = requestFn();
  
  // 요청을 Map에 저장
  pendingRequests.set(requestKey, {
    promise,
    timestamp: Date.now()
  });
  
  // 요청 완료 후 Map에서 제거
  promise.finally(() => {
    pendingRequests.delete(requestKey);
    console.log(`[RequestDeduplicator] 요청 완료, 캐시에서 제거: ${requestKey}`);
  });
  
  return promise;
}

/**
 * 특정 패턴의 요청들을 강제로 취소하는 함수
 * (예: 로그아웃 시 모든 인증 요청 취소)
 */
export function cancelRequests(pattern: string) {
  for (const [key] of pendingRequests.entries()) {
    if (key.includes(pattern)) {
      pendingRequests.delete(key);
    }
  }
}

/**
 * 현재 진행 중인 요청 수를 반환하는 함수 (디버깅용)
 */
export function getPendingRequestsCount(): number {
  cleanupExpiredRequests();
  return pendingRequests.size;
}