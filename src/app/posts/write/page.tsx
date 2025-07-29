'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePost } from '@/hooks/posts/useCreatePost';
import PostForm from '@/components/posts/PostForm';
import { PostData } from '@/types/posts/postTypes';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { useAuthStore } from '@/store/useAuthStore';

export default function PostWrite() {
    const router = useRouter();
    const { createPost } = useCreatePost();
    const { isAuthenticated, role } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || role !== 'ADMIN') {
            router.push('/posts');
        }
    }, [isAuthenticated, role, router]);

    const handleSubmit = async (data: PostData) => {
        await createPost(data);
        router.push('/posts');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <AdminGuard fallback={null}>
            <PostForm
                mode="create"
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </AdminGuard>
    );
} 