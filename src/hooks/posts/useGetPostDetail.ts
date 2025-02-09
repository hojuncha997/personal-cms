import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";
import { PostDetailResponse } from "@/types/posts/postTypes";

// interface GuestbookDetailResponse {
//     public_id: string;
//     title: string;
//     content: {
//         type: string;
//         content: any[];
//     };
//     author_display_name: string;
//     current_author_name: string;
//     isSecret: boolean;
//     category: string;
//     tags: string[];
//     viewCount: number;
//     likeCount: number;
//     commentCount: number;
//     createdAt: string;
//     updatedAt: string;
// }

export const useGetPostDetail = (public_id: string) => {
    const { data, isLoading, error } = useQuery<PostDetailResponse>({
        queryKey: ['posts', public_id],
        queryFn: async () => {
            const data = await fetchClient(`/posts/${public_id}`, {skipAuth: true});
            return await data.json() as PostDetailResponse;
        },
        staleTime: 1000 * 60 * 30, // 30분 동안 데이터를 "신선한" 상태로 유지(30분 동안은 서버에 재요청하지 않고 캐시된 데이터를 사용)
        gcTime: 1000 * 60 * 24,    // cacheTime 대신 gcTime 사용(컴포넌트가 언마운트되더라도 24시간 동안은 캐시를 유지)
        retry: 1, // 에러 발생 시 1번 재요청
        retryDelay: 1000 * 10, // 재요청 간격 10초
        refetchOnWindowFocus: false, // 창 포커스 변경 시 재요청 안함(캐시 사용)
        refetchOnMount: false, // 컴포넌트 마운트 시 재요청 안함(캐시 사용)
        refetchOnReconnect: false, // 네트워크 연결 변경 시 재요청 안함(캐시 사용)
        
        // refetchInterval: 1000 * 60 * 5, // 5분 마다 재요청 : 굳이 필요 없음
        // refetchIntervalInBackground: true, // 백그라운드에서도 재요청(브라우저 탭이 비활성화 되어 있어도 재요청- 현재 불필요)
        enabled: !!public_id, // public_id가 있을 때만 쿼리 실행
    });
    return { data, isLoading, error };
}; 