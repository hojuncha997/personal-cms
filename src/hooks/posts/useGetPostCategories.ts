import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

export interface PostCategory {
    id: number;
    slug: string;
    name: string;
    description: string;
    depth: number;
    displayOrder: number;
    isActive: boolean;
    path: string;
    children?: PostCategory[];
}

interface PostCategoryResponse {
    data: PostCategory[];
    meta: {
        total: number;
    };
}

export const useGetPostCategories = () => {
    return useQuery({
        queryKey: ['postCategories'],
        queryFn: async () => {
            const response = await fetchClient('/categories/posts', { skipAuth: true });
            const data = await response.json() as PostCategoryResponse;
            return data.data; // data 필드만 반환
        }
    });
}; 