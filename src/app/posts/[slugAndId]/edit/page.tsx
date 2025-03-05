import React from 'react';
import PostEditClient from './PostEditClient';

interface PageProps {
    params: {
        slugAndId: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ params }: PageProps) {
    const publicId = params.slugAndId.split('-').pop() || '';
    
    return <PostEditClient publicId={publicId} />;
} 