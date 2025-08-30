import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface ToggleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  return useMutation<ToggleLikeResponse, Error, string>({
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
      // 포스트 상세 정보 캐시 업데이트
      queryClient.setQueryData(['post', publicId], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            likeCount: data.likeCount,
            isLiked: data.isLiked,
          };
        }
        return oldData;
      });
      
      // 좋아요 상태 캐시 업데이트
      queryClient.setQueryData(['post', publicId, 'like-status'], {
        isLiked: data.isLiked,
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