import React from 'react';
import ProjectEditClient from './ProjectEditClient';

interface PageProps {
    params: Promise<{
        slugAndId: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
    const publicId = resolvedParams.slugAndId.split('-').pop() || '';
    
    return <ProjectEditClient publicId={publicId} />;
}