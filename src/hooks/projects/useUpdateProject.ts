import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { ProjectDetail, UpdateProjectData } from '@/types/projects/projectTypes';
import { JSONContent } from '@tiptap/react';

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateProjectData) => {
            const { publicId, ...updateData } = data;
            const response = await fetchClient(`/projects/${publicId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
                skipAuth: false,
            });
            return response.json();
        },
        onSuccess: (_, variables) => {
            // 개별 게시글 캐시와 목록 캐시 모두 무효화
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ 
                queryKey: ['project', variables.publicId]
            });
        },
    });
}; 