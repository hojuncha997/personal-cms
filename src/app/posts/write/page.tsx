'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePost } from '@/hooks/posts/useCreatePost';
import PostForm from '@/components/posts/PostForm';
import { PostData } from '@/types/posts/postTypes';

export default function PostWrite() {
    const router = useRouter();
    const { createPost } = useCreatePost();

    const handleSubmit = async (data: PostData) => {
        await createPost(data);
        router.push('/posts');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <PostForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
} 