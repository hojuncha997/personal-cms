// 방명록 네비게이션 훅

import { useQuery } from '@tanstack/react-query'
import { fetchClient } from '@/lib/fetchClient'
import { GuestbookForList } from '@/types/guestbooks/guestbookTypes'

interface GuestbookNavigationResponse {
    prev: GuestbookForList[];
    next: GuestbookForList[];
}

export const useGetGuestbookNavigation = (public_id: string, limit: number = 2) => {
    return useQuery<GuestbookNavigationResponse>({
        queryKey: ['guestbookNavigation', public_id],
        queryFn: async () => {
            const queryString = new URLSearchParams({
                limit: String(limit)
            }).toString();
            
            const response = await fetchClient(`/guestbooks/${public_id}/navigation?${queryString}`, {skipAuth: true});
            return response.json() as Promise<GuestbookNavigationResponse>;
        },
    })
}