// 방명록 수정 훅

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { GuestbookDetail, UpdateGuestbookData } from '@/types/guestbooks/guestbookTypes';
import { JSONContent } from '@tiptap/react';

export const useUpdateGuestbook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateGuestbookData) => {
            const { publicId, ...updateData } = data;
            const response = await fetchClient(`/guestbooks/${publicId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
                skipAuth: false,
            });
            return response.json();
        },
        onSuccess: (_, variables) => {
            // 개별 게시글 캐시와 목록 캐시 모두 무효화
            queryClient.invalidateQueries({ queryKey: ['guestbooks'] });
            queryClient.invalidateQueries({ 
                queryKey: ['guestbook', variables.publicId]
            });
        },
    });
}; 