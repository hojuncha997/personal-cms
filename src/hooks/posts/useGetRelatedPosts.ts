// 관련 포스트 훅

import { useQuery } from '@tanstack/react-query'
import { fetchClient } from '@/lib/fetchClient'
import { PostForList } from '@/types/posts/postTypes'

interface RelatedPostsResponse {
    manual: PostForList[];
    auto: PostForList[];
}

export const useGetRelatedPosts = (public_id: string, limit: number = 2) => {
    return useQuery<RelatedPostsResponse>({
        queryKey: ['relatedPosts', public_id],
        queryFn: async () => {
            const queryString = new URLSearchParams({
                limit: String(limit)
            }).toString();
            
            const response = await fetchClient(`/posts/${public_id}/related?${queryString}`);
            return response.json() as Promise<RelatedPostsResponse>;
        },
    })
}