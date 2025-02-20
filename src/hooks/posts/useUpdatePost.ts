import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { PostDetail } from '@/types/posts/postTypes';
import { JSONContent } from '@tiptap/react';

interface UpdatePostData {
    publicId: string;
    title: string;
    content: JSONContent;
    category: string;
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdatePostData) => {
            const { publicId, ...updateData } = data;
            const response = await fetchClient(`/posts/${publicId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
                skipAuth: false,
            });
            return response.json();
        },
        onSuccess: (_, variables) => {
            // 개별 게시글 캐시와 목록 캐시 모두 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ 
                queryKey: ['post', variables.publicId]
            });
        },
    });
}; 