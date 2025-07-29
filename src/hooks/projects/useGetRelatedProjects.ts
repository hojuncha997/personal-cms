// 관련 포스트 훅

import { useQuery } from '@tanstack/react-query'
import { fetchClient } from '@/lib/fetchClient'
import { ProjectForList } from '@/types/projects/projectTypes'

interface RelatedProjectsResponse {
    manual: ProjectForList[];
    auto: ProjectForList[];
}

export const useGetRelatedProjects = (public_id: string, limit: number = 2) => {
    return useQuery<RelatedProjectsResponse>({
        queryKey: ['relatedProjects', public_id],
        queryFn: async () => {
            const queryString = new URLSearchParams({
                limit: String(limit)
            }).toString();
            
            const response = await fetchClient(`/projects/${public_id}/related?${queryString}`, {skipAuth: true});
            return response.json() as Promise<RelatedProjectsResponse>;
        },
        staleTime: 1000 * 60 * 30, // 30분 동안 캐시 유지
        gcTime: 1000 * 60 * 24,    // 24시간 동안 가비지 컬렉션 방지
        retry: 1,                   // 에러 시 1번 재시도
        retryDelay: 1000 * 10,     // 재시도 간격 10초
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: !!public_id,       // public_id가 있을 때만 쿼리 실행
    })
}