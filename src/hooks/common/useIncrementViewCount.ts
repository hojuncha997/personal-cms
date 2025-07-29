// src/hooks/common/useIncrementViewCount.ts
// 조회수 증가 훅

import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';

// type ContentType = 'posts' | 'projects' | 'guestbooks';

interface IncrementViewCountParams {
    // contentType: ContentType;
    contentType: string;
    publicId: string;
}

export const useIncrementViewCount = () => {
    return useMutation({
        mutationFn: async ({ contentType, publicId }: IncrementViewCountParams) => {
            const response = await fetchClient(`/${contentType}/${publicId}/views`, {
                method: 'POST',
                skipAuth: true
            });
            return response.json();
        }
    });
}; 