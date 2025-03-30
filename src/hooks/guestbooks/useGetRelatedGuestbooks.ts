// 관련 방명록 훅

import { useQuery } from '@tanstack/react-query'
import { fetchClient } from '@/lib/fetchClient'
import { GuestbookForList } from '@/types/guestbooks/guestbookTypes'

interface RelatedGuestbooksResponse {
    manual: GuestbookForList[];
    auto: GuestbookForList[];
}

export const useGetRelatedGuestbooks = (public_id: string, limit: number = 2) => {
    return useQuery<RelatedGuestbooksResponse>({
        queryKey: ['relatedGuestbooks', public_id],
        queryFn: async () => {
            const queryString = new URLSearchParams({
                limit: String(limit)
            }).toString();
            
            const response = await fetchClient(`/guestbooks/${public_id}/related?${queryString}`, {skipAuth: true});
            return response.json() as Promise<RelatedGuestbooksResponse>;
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