// src/app/projects/[slugAndId]/page.tsx
import ProjectDetailClient from './ProjectDetailClient';
import { Suspense } from 'react';
import ProjectDetailSkeleton from '@/components/projects/skeletons/ProjectDetailSkeleton';

interface PageProps {
    params: Promise<{
        slugAndId: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
    const { slugAndId } = await params;
    const publicId = slugAndId.split('-').pop() || '';

    return (
        <Suspense fallback={<ProjectDetailSkeleton />}>
            <ProjectDetailClient publicId={publicId} />
        </Suspense>
    );
}