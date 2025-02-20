'use client'

import React, { useEffect } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import { useRouter } from 'next/navigation';
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail';
import { useUpdatePost } from '@/hooks/posts/useUpdatePost';
import Tiptap from '@/components/editor/tiptap/Tiptap';
import { useForm } from 'react-hook-form';
import { JSONContent } from '@tiptap/react';

interface PostEditClientProps {
    publicId: string;
}

interface FormData {
    title: string;
    content: JSONContent;
    category: string;
}

const PostEditClient: React.FC<PostEditClientProps> = ({ publicId }) => {
    const router = useRouter();
    const { data: post, isLoading } = useGetPostDetail(publicId);
    const { mutateAsync: updatePost, isPending } = useUpdatePost();
    
    const { register, handleSubmit, setValue, watch } = useForm<FormData>();

    useEffect(() => {
        if (post) {
            setValue('title', post.title);
            setValue('content', post.content);
            setValue('category', post.category);
        }
    }, [post, setValue]);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    if (!post.isAuthor) {
        router.push(`/posts/${publicId}`);
        return null;
    }

    const onSubmit = async (data: FormData) => {
        try {
            await updatePost({
                publicId,
                ...data
            });
            router.push(`/posts/${post.slug}-${publicId}`);
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen`} style={{backgroundColor: colors.primary.main}}>
            <Container>
                <div className="max-w-4xl mx-auto py-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="bg-white rounded-lg p-6">
                            <div className="mb-4">
                                <select
                                    {...register('category')}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="일반">일반</option>
                                    <option value="기술">기술</option>
                                    <option value="생활">생활</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    {...register('title')}
                                    className="w-full p-2 border rounded"
                                    placeholder="제목을 입력하세요"
                                />
                            </div>

                            <div className="mb-4">
                                <Tiptap
                                    initialContent={watch('content')}
                                    onChange={(content) => setValue('content', content)}
                                    contentStyle="min-h-[400px]"
                                    editable={true}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                >
                                    {isPending ? '수정 중...' : '수정하기'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
};

export default PostEditClient; 