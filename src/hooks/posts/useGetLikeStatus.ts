import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/useAuthStore';

interface LikeStatusResponse {
  isLiked: boolean;
}

export const useGetLikeStatus = (publicId: string) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery<LikeStatusResponse>({
    queryKey: ['post', publicId, 'like-status'],
    queryFn: async () => {
      if (!isAuthenticated) {
        return { isLiked: false };
      }

      const response = await fetchClient(`/posts/${publicId}/likes/status`);
      
      if (!response.ok) {
        return { isLiked: false };
      }

      return response.json();
    },
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};