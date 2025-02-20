import { Metadata } from 'next';
import PostEditClient from './PostEditClient';

interface Props {
    params: {
        slugAndId: string;
    }
}

export const metadata: Metadata = {
    title: '게시글 수정',
    description: '게시글을 수정합니다.',
};

export default function PostEditPage({ params }: Props) {
    const publicId = params.slugAndId.split('-').pop() || '';
    
    return <PostEditClient publicId={publicId} />;
} 