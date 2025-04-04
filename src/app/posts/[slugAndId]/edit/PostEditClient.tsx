'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail';
import { useUpdatePost } from '@/hooks/posts/useUpdatePost';
import PostForm from '@/components/posts/PostForm';
import { PostData } from '@/types/posts/postTypes';
import { useIsAuthor } from '@/hooks/auth/useIsAuthor';
import PostDetailSkeleton from '@/components/posts/skeletons/PostDetailSkeleton';


interface PostEditClientProps {
    publicId: string;
}

export default function PostEditClient({ publicId }: PostEditClientProps) {
    const router = useRouter();
    const { data: post, isLoading } = useGetPostDetail(publicId);
    const { mutateAsync: updatePost } = useUpdatePost();
    const isAuthor = useIsAuthor(post?.author_uuid);

    const handleSubmit = async (data: PostData) => {
        await updatePost({
            ...data,
            publicId,
            thumbnail: data.thumbnail || undefined,
            status: data.status as 'draft' | 'published',
        });
        router.push(`/posts/${post?.slug}-${publicId}`);
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return <PostDetailSkeleton />;
    }

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    if (!isAuthor) {
        router.push(`/posts/${post?.slug}-${publicId}`);
        return null;
    }

    return (
        <PostForm
            mode="edit"
            initialData={post}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
} 