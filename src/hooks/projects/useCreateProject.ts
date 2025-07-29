// 방명록 작성 훅

import { fetchClient } from '@/lib/fetchClient';
import { useMutation } from '@tanstack/react-query';
import { ProjectData } from '@/types/projects/projectTypes';


// export default async function useCreateGuestbook( data: GuestbookData ) {
    // const response = await fetchClient('/guestbooks', { method: 'POST' });
    // return response;
export function useCreateProject() {
    const { mutateAsync: createProject } = useMutation({
        mutationFn: (data: ProjectData) => fetchClient('/projects', { 
            method: 'POST', 
            body: data  // 원래대로 돌리고 category 매핑 제거
        }),
    });
    // return { createGuestbook };
    return { createProject };
}