import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface ToggleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

/**
 * 포스트 좋아요 토글 훅
 * 
 * 악의적 빠른 클릭 방지 전략:
 * 1. mutationKey: 같은 키의 mutation이 실행 중이면 새 요청 무시
 * 2. isPending 상태: UI에서 버튼 disabled 처리
 * 3. React Query 내장 중복 방지: 동일한 요청 자동 중복 제거
 * 
 * 작동 방식:
 * - 사용자가 빠르게 3번 클릭 시
 * - 1번째: 실행됨
 * - 2번째: mutationKey가 같아서 무시됨
 * - 3번째: 마찬가지로 무시됨
 */
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  return useMutation<ToggleLikeResponse, Error, string>({
    // 중복 요청 방지를 위한 고유 키
    // 같은 포스트에 대한 좋아요 요청이 이미 진행 중이면 새 요청 무시
    mutationKey: ['toggle-like'],
    
    mutationFn: async (publicId: string) => {
      if (!isAuthenticated) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetchClient(`/posts/${publicId}/likes`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '좋아요 처리 중 오류가 발생했습니다.');
      }

      return response.json();
    },
    
    onSuccess: (data, publicId) => {
      // 1. 포스트 상세 정보의 likeCount 즉시 업데이트
      // (숫자는 바로 변경되도록)
      queryClient.setQueryData(['post', publicId], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            likeCount: data.likeCount,
          };
        }
        return oldData;
      });
      
      // 2. 좋아요 상태 캐시 무효화
      // useGetLikeStatus의 queryKey: ['post', publicId, 'like-status', isAuthenticated]
      // invalidateQueries는 시작 부분이 일치하는 모든 쿼리를 무효화
      // → 자동으로 refetch되어 버튼 색깔이 변경됨
      queryClient.invalidateQueries({
        queryKey: ['post', publicId, 'like-status'],
      });
    },
    onError: (error: Error) => {
      if (error.message === '로그인이 필요합니다.') {
        const confirmed = window.confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?');
        if (confirmed) {
          router.push('/auth/login');
        }
      } else {
        console.error('좋아요 처리 실패:', error);
      }
    },
  });
};