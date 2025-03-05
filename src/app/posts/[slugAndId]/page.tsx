// src/app/posts/[slugAndId]/page.tsx
import PostDetailClient from './PostDetailClient';
import { Suspense } from 'react';
import PostDetailSkeleton from '@/components/posts/skeletons/PostDetailSkeleton';

interface PageProps {
    params: Promise<{
        slugAndId: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PostPage({ params, searchParams }: PageProps) {
    // params를 await로 해결
    const resolvedParams = await params;
    const publicId = resolvedParams.slugAndId.split('-').pop() || '';

    return (
        <Suspense fallback={<PostDetailSkeleton />}>
            <PostDetailClient publicId={publicId} prefetch={true} /> 
        </Suspense>
    );
}