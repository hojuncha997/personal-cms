'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import Tiptap from '@/components/editor/tiptap/Tiptap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { createThumbnail } from '@/utils/image';
import { useGetPostCategories, type PostCategory } from '@/hooks/posts/useGetPostCategories';
import { PostData } from '@/types/posts/postTypes';
import Image from 'next/image';
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

interface PostFormProps {
    mode: 'create' | 'edit';
    initialData?: PostData;
    onSubmit: (data: PostData) => Promise<void>;
    onCancel: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
    mode,
    initialData,
    onSubmit,
    onCancel
}) => {
    const { data: categories, isLoading: isCategoriesLoading } = useGetPostCategories();
    const [tagInput, setTagInput] = useState('');
    const [selectedThumbnails, setSelectedThumbnails] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tagError, setTagError] = useState<string>('');
    const tagInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<FormValues>({
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
        if (mode === 'edit' && initialData) {
            setValue('title', initialData.title);
            setValue('content', initialData.content);
            setValue('categorySlug', initialData.categorySlug || '');
            setValue('isSecret', initialData.isSecret);
            setValue('isFeatured', initialData.isFeatured);
            setValue('status', initialData.status as 'draft' | 'published');
            setValue('tags', initialData.tags || []);
            if (initialData.thumbnail) {
                setSelectedThumbnails([initialData.thumbnail]);
            }
        }
    }, [mode, initialData, setValue]);

    const handleImageSelect = (imageUrl: string) => {
        setSelectedThumbnails(prev => {
            if (prev.includes(imageUrl)) {
                return [];
            }
            return [imageUrl];
        });
    };

    const checkAndUpdateThumbnails = useCallback((content: any) => {
        const extractFirstImageUrl = (content: any): string | null => {
            if (!content?.content) return null;
            for (const node of content.content) {
                if (node.type === 'image' && node.attrs?.src) {
                    return node.attrs.src;
                }
                if (node.content) {
                    const found = extractFirstImageUrl(node);
                    if (found) return found;
                }
            }
            return null;
        };

        const firstImageUrl = extractFirstImageUrl(content);
        
        // 본문에 이미지가 없는 경우
        if (!firstImageUrl) {
            setSelectedThumbnails([]);
            return;
        }

        // 현재 선택된 썸네일이 본문에 없는 경우
        if (selectedThumbnails.length > 0 && !firstImageUrl.includes(selectedThumbnails[0])) {
            setSelectedThumbnails([]);
            return;
        }

        // 본문에 이미지가 있고, 썸네일이 선택되지 않은 경우
        if (selectedThumbnails.length === 0) {
            setSelectedThumbnails([firstImageUrl]);
        }
    }, []);

    const handleContentChange = useCallback((content: any) => {
        setValue('content', content);
        // 약간의 지연을 주어 상태 업데이트가 완료된 후 썸네일 체크
        setTimeout(() => {
            checkAndUpdateThumbnails(content);
        }, 0);
    }, [setValue, checkAndUpdateThumbnails]);

    const validateTag = (tag: string): boolean => {
        if (tag.length > 10) {
            setTagError('태그는 10자 이하여야 합니다.');
            return false;
        }
        if (tag.includes(' ')) {
            setTagError('태그에 공백을 포함할 수 없습니다.');
            return false;
        }
        if (!/^[a-zA-Z0-9가-힣]+$/.test(tag)) {
            setTagError('태그는 영문, 숫자, 한글만 사용 가능합니다.');
            return false;
        }
        setTagError('');
        return true;
    };

    const addTag = useCallback((tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && validateTag(trimmedTag)) {
            const currentTags = getValues('tags');
            if (!currentTags.includes(trimmedTag)) {
                setValue('tags', [...currentTags, trimmedTag]);
            }
            setTagInput('');
            tagInputRef.current?.focus();
        }
    }, [getValues, setValue]);

    const handleRemoveTag = useCallback((tagToRemove: string) => {
        const currentTags = getValues('tags');
        setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
    }, [getValues, setValue]);

    const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
        setTagError('');
    }, []);

    const handleTagKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const value = e.currentTarget.value.trim();
            if (value) {
                addTag(value);
            }
        }
    }, [addTag]);

    const handleFormSubmit = async (data: FormValues) => {
        try {
            setIsProcessing(true);
            let thumbnailUrl: string | null = null;

            // content에서 첫 번째 이미지 URL 추출
            const extractFirstImageUrl = (content: any): string | null => {
                if (!content?.content) return null;
                for (const node of content.content) {
                    if (node.type === 'image' && node.attrs?.src) {
                        return node.attrs.src;
                    }
                    if (node.content) {
                        const found = extractFirstImageUrl(node);
                        if (found) return found;
                    }
                }
                return null;
            };

            // 본문에서 이미지 URL 추출
            const firstImageUrl = extractFirstImageUrl(data.content);

            // 본문에 이미지가 있고, 선택된 썸네일이 본문에 있는 경우에만 썸네일 처리
            if (firstImageUrl && selectedThumbnails.length > 0 && firstImageUrl.includes(selectedThumbnails[0])) {
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

            const postData: PostData = {
                ...data,
                content: data.content,
                slug: mode === 'create' ? data.title
                    .toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/[^\w-]+/g, '') : initialData?.slug || '',
                thumbnail: thumbnailUrl,
            };

            await onSubmit(postData);
        } catch (error) {
            console.error('게시글 처리 실패:', error);
            alert(`게시글 ${mode === 'create' ? '작성' : '수정'}에 실패했습니다.`);
        } finally {
            setIsProcessing(false);
        }
    };

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

    const isSecret = watch('isSecret');

    return (
        <div className="bg-gray-100 text-black" style={{ backgroundColor: colors.primary.main }}>
            <Container>
                <div className="max-w-4xl mx-auto py-8">
                    <h1 className="text-3xl font-bold mb-8">
                        {mode === 'create' ? '게시글 작성' : '게시글 수정'}
                    </h1>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1/4">
                                <label className="block text-sm font-medium mb-2">카테고리</label>
                                <select
                                    {...register('categorySlug')}
                                    className="w-full px-4 py-2 border rounded-md"
                                    disabled={isCategoriesLoading}
                                >
                                    <option value="">카테고리 선택</option>
                                    {categories && renderCategoryOptions(categories)}
                                </select>
                                {errors.categorySlug && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categorySlug.message}</p>
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
                                onChange={handleContentChange}
                                onImageClick={handleImageSelect}
                                selectedImages={selectedThumbnails}
                                toolbarStyle="border-b bg-gray-50 p-2 flex flex-wrap gap-1"
                                contentStyle="p-4 min-h-[200px] bg-white prose-sm"
                                editable={true}
                            />
                        </div>

                        {selectedThumbnails.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-2">선택된 썸네일</label>
                                <div className="flex gap-2 overflow-x-auto">
                                    {selectedThumbnails.map((url) => (
                                        <Image
                                            key={url}
                                            src={url}
                                            alt="썸네일 미리보기"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 object-cover rounded border-2 border-blue-500"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

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
                            <div>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={handleTagInputChange}
                                    onKeyPress={handleTagKeyPress}
                                    className="w-full px-4 py-2 border rounded-md"
                                    placeholder="태그를 입력하고 Enter를 누르세요"
                                />
                                {tagError && (
                                    <p className="text-red-500 text-sm mt-1">{tagError}</p>
                                )}
                            </div>
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
                                onClick={onCancel}
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
                                {isProcessing ? 
                                    (mode === 'create' ? '작성 중...' : '수정 중...') : 
                                    (mode === 'create' ? '작성하기' : '수정하기')}
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
};

export default PostForm; 