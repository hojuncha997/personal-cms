import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';

export const useDeleteComment = (publicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetchClient(`/posts/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '댓글 삭제 중 오류가 발생했습니다.');
      }

      return response.json();
    },
    onSuccess: () => {
      // 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['post', publicId, 'comments'] });
      
      // 포스트 상세 정보도 업데이트 (댓글 수 감소)
      queryClient.setQueryData(['post', publicId], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            commentCount: Math.max((oldData.commentCount || 1) - 1, 0),
          };
        }
        return oldData;
      });
    },
    onError: (error: Error) => {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    },
  });
};