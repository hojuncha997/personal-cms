import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";
// import { PostDetailResponse } from "@/types/posts/postTypes";
import { PostDetail } from "@/types/posts/postTypes";
import { useAuthStore } from "@/store/useAuthStore";

export const useGetPostDetail = (public_id: string, options?: {enabled?: boolean}) => {
    const { isAuthenticated } = useAuthStore();
    
    return useQuery<PostDetail>({
        queryKey: ['posts', public_id],
        queryFn: async () => {
            // 로그인 여부에 따라 토큰 사용 여부 결정. 로그인 한 경우 토큰 전송(회원 확인용)
            const requestConfig = isAuthenticated ? {skipAuth: false} : {skipAuth: true};
            const data = await fetchClient(`/posts/${public_id}`, requestConfig);
            
            // .json()은 기본적으로 any타입을 반환한다. any에 직접 타입 캐스팅을 하는 것은 안전하지 않을 수 있다.
            // 따라서 먼저 unknown으로 타입 추론 후 그 다음 타입 캐스팅을 적용하였다.
            const postData = await data.json();
            return postData as unknown as PostDetail;
        },
        // ??: 왼쪽 값이 null 또는 undefined일 경우 오른쪽 값을 반환. 그 외(false, 0, 빈 문자열 등)일 경우 왼쪽 값을 반환
        enabled: options?.enabled ?? !!public_id, // enabled 옵션을 받아서 처리. enabled는 queryFn함수의 작동을 관장한다. 리액트 쿼리를 작동시키는 스위치와 같은 옵션

        // staleTime: 1000 * 60 * 30, // 30분 동안 데이터를 "신선한" 상태로 유지(30분 동안은 서버에 재요청하지 않고 캐시된 데이터를 사용)
        // gcTime: 1000 * 60 * 24,    // cacheTime 대신 gcTime 사용(컴포넌트가 언마운트되더라도 24시간 동안은 캐시를 유지)
        retry: 1, // 에러 발생 시 1번 재요청
        retryDelay: 1000 * 10, // 재요청 간격 10초
        refetchOnWindowFocus: false, // 창 포커스 변경 시 재요청 안함(캐시 사용)
        refetchOnMount: false, // 컴포넌트 마운트 시 재요청 안함(캐시 사용)
        refetchOnReconnect: false, // 네트워크 연결 변경 시 재요청 안함(캐시 사용)
        
        // refetchInterval: 1000 * 60 * 5, // 5분 마다 재요청 : 굳이 필요 없음
        // refetchIntervalInBackground: true, // 백그라운드에서도 재요청(브라우저 탭이 비활성화 되어 있어도 재요청- 현재 불필요)
    });
}; 