// 방명록 목록 조회
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";
// import { PostQueryParams, PostListResponse } from "@/types/posts/postTypes";
import { ProjectQueryParams, ProjectListResponse } from "@/types/projects/projectTypes";


export const useGetProjectList = (params: ProjectQueryParams = {}) => {
    return useQuery({
        queryKey: ['projects', params],
    //     queryFn: async () => {
    //     const data = await fetchClient('/guestbooks', {skipAuth: true});
    //     // return data as GuestbookResponse;
    //     return await data.json() as GuestbookResponse;
    // },
    // // staleTime: 1000 * 30, // 3분 동안 데이터를 "신선한" 상태로 유지(3분 동안은 서버에 재요청하지 않고 캐시된 데이터를 사용), 일단은 바로 데이터 업데이트 되도록 함
    // gcTime: 1000 * 60 * 5,    // cacheTime 대신 gcTime 사용(컴포넌트가 언마운트되더라도 5분 동안은 캐시를 유지)
        queryFn: async () => {
            const queryString = new URLSearchParams({
                page: String(params.page || 1),
                limit: String(params.limit || 10),
                ...(params.search && { search: params.search }),
                ...(params.categorySlug && { categorySlug: params.categorySlug }),
                ...(params.status && { status: params.status }),
                ...(params.sortBy && { sortBy: params.sortBy }),
                ...(params.order && { order: params.order }),
                ...(params.tag && { tag: params.tag }),
                ...(params.startDate && { startDate: params.startDate }),
                ...(params.endDate && { endDate: params.endDate }),
                // ... 기타 파라미터
            }).toString();

            const response = await fetchClient(`/projects?${queryString}`, {skipAuth: true});
            return response.json() as Promise<ProjectListResponse>;
        }
    });
};