import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface CreateCommentData {
  content: string;
  parentCommentId?: number;
}

export const useCreateComment = (publicId: string) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      if (!isAuthenticated) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetchClient(`/posts/${publicId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '댓글 작성 중 오류가 발생했습니다.');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['post', publicId, 'comments'] });
      
      // 최상위 댓글인 경우에만 댓글 수 증가
      if (!variables.parentCommentId) {
        queryClient.setQueryData(['post', publicId], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              commentCount: (oldData.commentCount || 0) + 1,
            };
          }
          return oldData;
        });
      }
    },
    onError: (error: Error) => {
      if (error.message === '로그인이 필요합니다.') {
        const confirmed = window.confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?');
        if (confirmed) {
          router.push('/auth/login');
        }
      } else {
        console.error('댓글 작성 실패:', error);
      }
    },
  });
};