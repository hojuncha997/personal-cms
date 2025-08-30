import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';

interface Comment {
  id: number;
  content: string;
  isEdited: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  member: {
    uuid: string;
    nickname: string;
    profileImage?: string;
  };
  replies: Array<{
    id: number;
    content: string;
    isEdited: boolean;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
    member: {
      uuid: string;
      nickname: string;
      profileImage?: string;
    };
  }>;
  replyCount: number;
}

interface CommentsResponse {
  comments: Comment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useGetComments = (publicId: string, page: number = 1, limit: number = 20) => {
  return useQuery<CommentsResponse>({
    queryKey: ['post', publicId, 'comments', page, limit],
    queryFn: async () => {
      const response = await fetchClient(`/posts/${publicId}/comments?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      return response.json();
    },
    enabled: !!publicId,
    staleTime: 1000 * 60, // 1분
  });
};