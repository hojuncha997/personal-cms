import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/useAuthStore';

interface LikeStatusResponse {
  isLiked: boolean;
}

/**
 * 포스트의 좋아요 상태를 가져오는 커스텀 훅
 * 
 * React Query의 핵심 개념:
 * - queryKey: 쿼리를 식별하는 고유 키. 이 키가 변경되면 자동으로 refetch
 * - queryFn: 실제 데이터를 가져오는 비동기 함수
 * - enabled: 쿼리 실행 조건 (false면 쿼리 실행 안 함)
 * - staleTime: 데이터가 '신선한' 상태로 유지되는 시간
 * 
 * @param publicId - 포스트의 공개 ID
 */
export const useGetLikeStatus = (publicId: string) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery<LikeStatusResponse>({
    // queryKey 배열 설명:
    // - 'post': 네임스페이스 (포스트 관련 쿼리임을 표시)
    // - publicId: 특정 포스트를 식별
    // - 'like-status': 이 쿼리의 목적
    // - isAuthenticated: 인증 상태 (중요!)
    //   → isAuthenticated가 false에서 true로 변경되면
    //   → React Query가 이를 감지하고 자동으로 queryFn을 다시 실행
    //   → 새로고침 후 토큰이 도착하면 자동으로 좋아요 상태 다시 조회
    queryKey: ['post', publicId, 'like-status', isAuthenticated],
    
    queryFn: async () => {
      // 비로그인 상태면 API 호출 없이 바로 false 반환
      // (서버 부하 감소 & 불필요한 네트워크 요청 방지)
      if (!isAuthenticated) {
        return { isLiked: false };
      }

      // 로그인 상태면 서버에서 실제 좋아요 상태 조회
      const response = await fetchClient(`/posts/${publicId}/like-status`);
      
      if (!response.ok) {
        return { isLiked: false };
      }

      return response.json();
    },
    
    // publicId가 있을 때만 쿼리 실행
    // (undefined나 null이면 쿼리 실행 안 함)
    enabled: !!publicId,
    
    // 5분 동안은 캐시된 데이터를 '신선한' 것으로 간주
    // (같은 포스트 재방문 시 5분 내면 API 호출 안 함)
    staleTime: 1000 * 60 * 5, // 5분
  });
};