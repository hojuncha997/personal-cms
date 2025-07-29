// src/hooks/guestbooks/useGetGuestbookCategories.ts

import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

export interface GuestbookCategory {
    id: number;
    slug: string;
    name: string;
    description: string;
    depth: number;
    displayOrder: number;
    isActive: boolean;
    path: string;
    children?: GuestbookCategory[];
}

interface GuestbookCategoryResponse {
    data: GuestbookCategory[];
    meta: {
        total: number;
    };
}

export const useGetGuestbookCategories = () => {
    return useQuery({
        queryKey: ['guestbookCategories'],
        queryFn: async () => {
            const response = await fetchClient('/categories/guestbooks', { skipAuth: true });
            const data = await response.json() as GuestbookCategoryResponse;
            return data.data; // data 필드만 반환
        }
    });
}; 