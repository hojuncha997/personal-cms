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

export default async function PostEditPage({ params }: Props) {
    // Next.js 13+에서는 동적 라우트 파라미터에 접근할 때 params 객체 전체를 await 해야한다.
    // 물론 컴포넌트는 async 컴포넌트여야 한다. 이는 기본적으로 App Router가 기본적으로 서버 컴포넌트를 사용하기 때문이다.
    // 동적 라우트 파라미터는 서버에서 비동기적으로 처리되며, 따라서 이 값들을 사용하는 컴포넌트도 비동기적으로 동작해야 한다.
    const {slugAndId} = await params;
    const publicId = slugAndId.split('-').pop() || '';
    
    return <PostEditClient publicId={publicId} />;
} 