// 포스트 네비게이션 훅

import { useQuery } from '@tanstack/react-query'
import { fetchClient } from '@/lib/fetchClient'
import { PostForList } from '@/types/posts/postTypes'

interface PostNavigationResponse {
    prev: PostForList[];
    next: PostForList[];
}

export const useGetPostNavigation = (public_id: string, limit: number = 2) => {
    return useQuery<PostNavigationResponse>({
        queryKey: ['postNavigation', public_id],
        queryFn: async () => {
            const queryString = new URLSearchParams({
                limit: String(limit)
            }).toString();
            
            const response = await fetchClient(`/posts/${public_id}/navigation?${queryString}`);
            return response.json() as Promise<PostNavigationResponse>;
        },
    })
}