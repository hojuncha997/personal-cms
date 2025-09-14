'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/useAuthStore';

interface UpdateCommentRequest {
  commentId: number;
  content: string;
}

export const useUpdateComment = (publicId: string) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, sub } = useAuthStore();
  
  return useMutation({
    mutationFn: async ({ commentId, content }: UpdateCommentRequest) => {
      const response = await fetchClient(`/posts/comments/${commentId}`, {
        method: 'PUT',
        body: { content },
      });
      return response.json();
    },
    onSuccess: (updatedComment, { commentId, content }) => {
      // 서버 응답 성공 후 캐시를 직접 업데이트하여 즉시 반영
      // 실패 시에는 기존 상태 유지되며 에러 메시지 표시됨
      // 낙관적 업데이트 대신 이 방식 사용으로 더 예측 가능한 동작
      
      // 댓글 관련 쿼리들 무효화 (현재 사용자의 캐시만)
      queryClient.invalidateQueries({ 
        queryKey: ['post', publicId, 'comments'],
        predicate: (query) => {
          const key = query.queryKey as string[];
          return key[5] === (isAuthenticated ? sub : 'anonymous');
        }
      });
      
      // 현재 페이지의 캐시도 직접 업데이트
      const queries = queryClient.getQueriesData({ 
        queryKey: ['post', publicId, 'comments'],
        predicate: (query) => {
          const key = query.queryKey as string[];
          return key[5] === (isAuthenticated ? sub : 'anonymous');
        }
      });
      queries.forEach(([queryKey, queryData]) => {
        queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const updateComment = (comment: any): any => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content,
              isEdited: true,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(updateComment),
            };
          }
          return comment;
        };

          return {
            ...old,
            comments: old.comments.map(updateComment),
          };
        });
      });
    },
  });
};