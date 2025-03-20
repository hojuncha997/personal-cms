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
    // params를 await로 해결
    const resolvedParams = await params;
    const publicId = resolvedParams.slugAndId.split('-').pop() || '';

    return (
        <Suspense fallback={<ProjectDetailSkeleton />}>
            <ProjectDetailClient publicId={publicId} prefetch={true} /> 
        </Suspense>
    );
}