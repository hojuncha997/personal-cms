import React from 'react';
import PostEditClient from './PostEditClient';

export default async function Page({
    params,
    searchParams,
}: {
    params: { slugAndId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const publicId = params.slugAndId.split('-').pop() || '';
    
    return <PostEditClient publicId={publicId} />;
} 