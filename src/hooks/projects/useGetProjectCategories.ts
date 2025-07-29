import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

export interface ProjectCategory {
    id: number;
    slug: string;
    name: string;
    description: string;
    depth: number;
    displayOrder: number;
    isActive: boolean;
    path: string;
    children?: ProjectCategory[];
}

interface ProjectCategoryResponse {
    data: ProjectCategory[];
    meta: {
        total: number;
    };
}

export const useGetProjectCategories = () => {
    return useQuery({
        queryKey: ['projectCategories'],
        queryFn: async () => {
            const response = await fetchClient('/categories/projects', { skipAuth: true });
            const data = await response.json() as ProjectCategoryResponse;
            return data.data; // data 필드만 반환
        }
    });
}; 