// 포스트 네비게이션 훅

import { useQuery } from '@tanstack/react-query'
import { fetchClient } from '@/lib/fetchClient'
import { ProjectForList } from '@/types/projects/projectTypes'

interface ProjectNavigationResponse {
    prev: ProjectForList[];
    next: ProjectForList[];
}

export const useGetProjectNavigation = (public_id: string, limit: number = 2) => {
    return useQuery<ProjectNavigationResponse>({
        queryKey: ['projectNavigation', public_id],
        queryFn: async () => {
            const queryString = new URLSearchParams({
                limit: String(limit)
            }).toString();
            
            const response = await fetchClient(`/projects/${public_id}/navigation?${queryString}`, {skipAuth: true});
            return response.json() as Promise<ProjectNavigationResponse>;
        },
    })
}