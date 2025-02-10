'use client'

import React from 'react';
import { Container } from '@/components/layouts/Container';
import { useRouter } from 'next/navigation';
import Tiptap from '@/components/editor/tiptap/Tiptap';
import { type JSONContent } from '@tiptap/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors } from '@/constants/styles';
import { useCreatePost } from '@/hooks/posts/useCreatePost';
import { PostData } from '@/types/posts/postTypes';

const formSchema = z.object({
  title: z.string()
    .min(1, { message: '제목은 필수 입력 항목입니다.' })
    .max(50, { message: '제목은 최대 50자까지 입력 가능합니다.' }),
  content: z.any(),
  category: z.string().min(1, { message: '카테고리는 필수 입력 항목입니다.' }),
  isSecret: z.boolean(),
  isFeatured: z.boolean(),
  status: z.enum(['draft', 'published']).default('published'),
  password: z.string().optional()
    .refine((val) => !val || val.length >= 4, { message: '비밀번호는 4자리 이상이어야 합니다.' }),
  tags: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostWrite() {
    const router = useRouter();
    const categories = ['일반', '문의', '칭찬', '제안'];
    const [tagInput, setTagInput] = React.useState('');
    const { createPost } = useCreatePost();

    const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: {
                type: 'doc',
                content: [{ type: 'paragraph' }]
            },
            category: '일반',
            isSecret: false,
            isFeatured: false,
            status: 'published',
            tags: []
        }
    });

    const isSecret = watch('isSecret');

    const onSubmit = async (data: FormValues) => {
        const postData: PostData = {
            ...data,
            content: data.content,
            slug: data.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, ''),
            thumbnail: null,
            isFeatured: data.isFeatured,
            status: data.status,
        };

        // 방명록 작성 훅 호출
        await createPost(postData);
        router.push('/posts');
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const currentTags = getValues('tags');
            if (!currentTags.includes(tagInput.trim())) {
                setValue('tags', [...currentTags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const currentTags = getValues('tags');
        setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="bg-gray-100 text-black" style={{ backgroundColor: colors.primary.main }}>
        <Container>
            <div className="max-w-4xl mx-auto py-8" style={{ backgroundColor: colors.primary.main }}>
                <h1 className="text-3xl font-bold mb-8">게시글 작성</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                        e.preventDefault();
                    }
                }}>
                    <div className="flex gap-4">
                        <div className="w-1/4">
                            <label className="block text-sm font-medium mb-2">카테고리</label>
                            <select
                                {...register('category')}
                                className="w-full px-4 py-2 border rounded-md"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">제목</label>
                            <input
                                type="text"
                                {...register('title')}
                                className="w-full px-4 py-2 border rounded-md"
                                placeholder="제목을 입력하세요"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">내용</label>
                        <Tiptap
                            initialContent={watch('content')}
                            onChange={(content) => setValue('content', content)}
                            toolbarStyle="border-b bg-gray-50 p-2 flex flex-wrap gap-1"
                            // prose설정을 넣어줬음에 유의
                            contentStyle="p-4 min-h-[200px] bg-white prose-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">태그</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {watch('tags').map((tag) => (
                                <span 
                                    key={tag} 
                                    className="bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="w-full px-4 py-2 border rounded-md"
                            placeholder="태그를 입력하고 Enter를 누르세요"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('isSecret')}
                                className="rounded"
                            />
                            <label className="text-sm">비밀글로 작성</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('isFeatured')}
                                className="rounded"
                            />
                            <label className="text-sm">주요 게시물로 설정</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                {...register('status')}
                                className="px-2 py-1 border rounded-md text-sm"
                            >
                                <option value="published">공개</option>
                                <option value="draft">임시저장</option>
                            </select>
                        </div>
                        {isSecret && (
                            <div className="flex-1">
                                작성자와 본인만 볼 수 있습니다.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        >
                            작성하기
                        </button>
                    </div>
                </form>
            </div>
        </Container>
        </div>
    );
} 