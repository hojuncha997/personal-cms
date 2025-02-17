import PostDetailClient from './PostDetailClient';
import { Suspense } from 'react';
import PostDetailSkeleton from '@/components/posts/skeletons/PostDetailSkeleton';

interface PageProps {
    params: { slugAndId: string };
}

export default function PostPage({ params }: PageProps) {
    const publicId = params.slugAndId.split('-').pop() || '';

    return (
        <Suspense fallback={<PostDetailSkeleton />}>
            <PostDetailClient publicId={publicId} />
        </Suspense>
    );
} 