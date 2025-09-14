import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface CreateCommentData {
  content: string;
  parentCommentId?: number;
  isSecret?: boolean;
}

export const useCreateComment = (publicId: string) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, sub } = useAuthStore();
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
      // 댓글 작성 성공 후 캐시 무효화
      // 
      // React Query 캐시 무효화 설명:
      // invalidateQueries는 특정 캐시를 "오래된 것"으로 표시하여
      // 해당 데이터를 사용하는 컴포넌트가 다시 렌더링될 때 자동으로 refetch하게 합니다
      //
      // predicate 함수를 사용하는 이유:
      // - 댓글 캐시 키는 [post, publicId, comments, page, limit, userSub] 형태
      // - 여러 페이지의 댓글 캐시가 있을 수 있음 (page 1, 2, 3...)
      // - 현재 로그인한 사용자의 캐시만 무효화해야 함
      // - key[5]는 6번째 요소인 사용자 식별자 (sub 또는 'anonymous')
      queryClient.invalidateQueries({ 
        queryKey: ['post', publicId, 'comments'], 
        predicate: (query) => {
          const key = query.queryKey as string[];
          return key[5] === (isAuthenticated ? sub : 'anonymous');
        }
      });
      
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