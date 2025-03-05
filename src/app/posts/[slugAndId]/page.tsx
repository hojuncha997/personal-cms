// src/app/posts/[slugAndId]/page.tsx
import PostDetailClient from './PostDetailClient';
import { Suspense } from 'react';
import PostDetailSkeleton from '@/components/posts/skeletons/PostDetailSkeleton';

interface PageProps {
    params: {
        slugAndId: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function PostPage({ params, searchParams }: PageProps) {
    const publicId = params.slugAndId.split('-').pop() || '';

    return (
        <Suspense fallback={<PostDetailSkeleton />}>
            {/* true -> useGetPostDetail 쿼리 실행. 추후 코드 변경 예정 */}
            <PostDetailClient publicId={publicId} prefetch={true} /> 
        </Suspense>
    );
} 