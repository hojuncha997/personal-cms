// 방명록 목록 조회
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

interface GuestbookResponse {
    posts: {
        uuid: string;
        title: string;
        author_display_name: string;
        isSecret: boolean;
        createdAt: string;
        viewCount: number;
        likeCount: number;
    }[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const useGetGuestbookList = () => {
    const { data, isLoading, error } = useQuery<GuestbookResponse>({
        queryKey: ['guestbooks'],
        queryFn: async () => {
            const data = await fetchClient('/guestbooks', {skipAuth: true});
            // return data as GuestbookResponse;
            return (data as unknown) as GuestbookResponse;
        },
        staleTime: 1000 * 30, // 3분 동안 데이터를 "신선한" 상태로 유지(3분 동안은 서버에 재요청하지 않고 캐시된 데이터를 사용)
        gcTime: 1000 * 60 * 5,    // cacheTime 대신 gcTime 사용(컴포넌트가 언마운트되더라도 5분 동안은 캐시를 유지)
    });
    return { data, isLoading, error };
};