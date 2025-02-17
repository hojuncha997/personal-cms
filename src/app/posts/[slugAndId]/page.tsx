// src/app/posts/[slugAndId]/page.tsx
import PostDetailClient from './PostDetailClient';
import { Suspense } from 'react';
import PostDetailSkeleton from '@/components/posts/skeletons/PostDetailSkeleton';

interface PageProps {
    params: { slugAndId: string };
}

export default async function PostPage({ params }: PageProps) {
    // params 객체 자체를 await. 속성을 await 처리하는 것이 아니라 객체 자체를 await 처리
    const resolvedParams = await params;
    const publicId = resolvedParams.slugAndId.split('-').pop() || '';

    return (
        <Suspense fallback={<PostDetailSkeleton />}>
            {/* true -> useGetPostDetail 쿼리 실행. 추후 코드 변경 예정 */}
            <PostDetailClient publicId={publicId} prefetch={true} /> 
        </Suspense>
    );
} 