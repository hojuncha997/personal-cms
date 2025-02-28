'use client'

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import { useRouter } from 'next/navigation';
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail';
import { useUpdatePost } from '@/hooks/posts/useUpdatePost';
import Tiptap from '@/components/editor/tiptap/Tiptap';
import { useForm } from 'react-hook-form';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { createThumbnail } from '@/utils/image';
import { useGetPostCategories, type PostCategory } from '@/hooks/posts/useGetPostCategories';

interface PostEditClientProps {
    publicId: string;
}

const formSchema = z.object({
    title: z.string()
        .min(1, { message: '제목은 필수 입력 항목입니다.' })
        .max(50, { message: '제목은 최대 50자까지 입력 가능합니다.' }),
    content: z.any(),
    categorySlug: z.string().optional(),
    isSecret: z.boolean(),
    isFeatured: z.boolean(),
    status: z.enum(['draft', 'published']).default('published'),
    tags: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const PostEditClient: React.FC<PostEditClientProps> = ({ publicId }) => {
    const router = useRouter();
    const { data: post, isLoading } = useGetPostDetail(publicId);
    const { mutateAsync: updatePost, isPending } = useUpdatePost();
    const [tagInput, setTagInput] = useState('');
    const [selectedThumbnails, setSelectedThumbnails] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { data: categories, isLoading: isCategoriesLoading } = useGetPostCategories();
    
    const { register, handleSubmit, setValue, watch, getValues } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: {
                type: 'doc',
                content: [{ type: 'paragraph' }]
            },
            categorySlug: '',
            isSecret: false,
            isFeatured: false,
            status: 'published',
            tags: []
        }
    });

    useEffect(() => {
        if (post) {
            setValue('title', post.title);
            setValue('content', post.content);
            setValue('categorySlug', post.categorySlug || '');
            setValue('isSecret', post.isSecret);
            setValue('isFeatured', post.isFeatured);
            setValue('status', post.status as 'draft' | 'published');
            setValue('tags', post.tags || []);
            if (post.thumbnail) {
                setSelectedThumbnails([post.thumbnail]);
            }
        }
    }, [post, setValue]);

    const handleImageSelect = (imageUrl: string) => {
        setSelectedThumbnails(prev => {
            const newSelection = prev.includes(imageUrl)
                ? prev.filter(url => url !== imageUrl)
                : [...prev, imageUrl];
            return newSelection;
        });
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

    const onSubmit = async (data: FormValues) => {
        if (!post) return;
        
        try {
            setIsProcessing(true);
            let thumbnailUrl = post.thumbnail || undefined;

            if (selectedThumbnails.length > 0 && selectedThumbnails[0] !== post.thumbnail) {
                const thumbnailBlob = await createThumbnail(selectedThumbnails[0]);
                const fileName = `images/thumbnails/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
                
                const { error: uploadError } = await supabase.storage
                    .from('media-storage')
                    .upload(fileName, thumbnailBlob);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('media-storage')
                    .getPublicUrl(fileName);

                thumbnailUrl = publicUrl;
            }

            await updatePost({
                ...data,
                publicId,
                thumbnail: thumbnailUrl,
                content: data.content || post.content
            });
            router.push(`/posts/${post?.slug}-${publicId}`);
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            alert('게시글 수정에 실패했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    // 카테고리 옵션 렌더링 함수 추가
    const renderCategoryOptions = (categories: PostCategory[] = [], depth = 0) => {
        return categories.map(category => (
            <React.Fragment key={category.slug}>
                <option value={category.slug}>
                    {'\u00A0'.repeat(depth * 2)}{category.name}
                </option>
                {category.children && renderCategoryOptions(category.children, depth + 1)}
            </React.Fragment>
        ));
    };

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

    return (
        <div className="bg-gray-100 text-black" style={{ backgroundColor: colors.primary.main }}>
            <Container>
                <div className="max-w-4xl mx-auto py-8">
                    <h1 className="text-3xl font-bold mb-8">게시글 수정</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="bg-white rounded-lg p-6">
                            <div className="mb-4">
                                <select
                                    {...register('categorySlug')}
                                    className="w-full p-2 border rounded"
                                    disabled={isCategoriesLoading}
                                >
                                    <option value="">카테고리 선택</option>
                                    {categories && renderCategoryOptions(categories)}
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
                                    onImageClick={handleImageSelect}
                                    selectedImages={selectedThumbnails}
                                    toolbarStyle="border-b bg-gray-50 p-2 flex flex-wrap gap-1"
                                    contentStyle="p-4 min-h-[200px] bg-white prose-sm"
                                    editable={true}
                                />
                            </div>

                            {selectedThumbnails.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">선택된 썸네일</label>
                                    <div className="flex gap-2 overflow-x-auto">
                                        {selectedThumbnails.map((url) => (
                                            <img
                                                key={url}
                                                src={url}
                                                alt="썸네일 미리보기"
                                                className="w-20 h-20 object-cover rounded border-2 border-blue-500"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">태그</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(watch('tags') || []).map((tag) => (
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

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                    disabled={isProcessing}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? '수정 중...' : '수정하기'}
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