import React from 'react';
import PostEditClient from './PostEditClient';

interface PageProps {
    params: Promise<{
        slugAndId: string;
    }>;
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    const publicId = resolvedParams.slugAndId.split('-').pop() || '';
    
    return <PostEditClient publicId={publicId} />;
} 