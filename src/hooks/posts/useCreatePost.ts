// 방명록 작성 훅

import { fetchClient } from '@/lib/fetchClient';
import { useMutation } from '@tanstack/react-query';
import { PostData } from '@/types/posts/postTypes';


// export default async function useCreateGuestbook( data: GuestbookData ) {
    // const response = await fetchClient('/guestbooks', { method: 'POST' });
    // return response;
export function useCreatePost() {
    const { mutateAsync: createPost } = useMutation({
        mutationFn: (data: PostData) => fetchClient('/posts', { 
            method: 'POST', 
            body: data  // 여기서는 stringify 하지 않음
        }),
    });
    // return { createGuestbook };
    return { createPost };
}