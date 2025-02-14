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
import { supabase } from '@/lib/supabase';

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
    const [selectedThumbnails, setSelectedThumbnails] = React.useState<string[]>([]);
    const [isProcessing, setIsProcessing] = React.useState(false);

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

    const handleImageSelect = (imageUrl: string) => {
        console.log('handleImageSelect called with:', imageUrl);
        setSelectedThumbnails(prev => {
            const newSelection = prev.includes(imageUrl)
                ? prev.filter(url => url !== imageUrl)
                : [...prev, imageUrl];
            console.log('New selection:', newSelection);
            return newSelection;
        });
    };

    const createThumbnail = async (imageUrl: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    reject(new Error('Canvas context를 생성할 수 없습니다.'));
                    return;
                }

                canvas.width = 300;
                canvas.height = 300;

                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width - img.width * scale) / 2;
                const y = (canvas.height - img.height * scale) / 2;

                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('썸네일 생성 실패'));
                    }
                }, 'image/jpeg', 0.8);
            };
            img.onerror = () => reject(new Error('이미지 로드 실패'));
            img.src = imageUrl;
        });
    };

    const onSubmit = async (data: FormValues) => {
        try {
            setIsProcessing(true);

            let thumbnailUrl = null;
            if (selectedThumbnails.length > 0) {
                const thumbnailBlob = await createThumbnail(selectedThumbnails[0]);
                
                const fileName = `images/thumbnails/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
                const { data: uploadData, error: uploadError } = await supabase.storage
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
                slug: data.title
                    .toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/[^\w-]+/g, ''),
                thumbnail: thumbnailUrl,
                isFeatured: data.isFeatured,
                status: data.status,
            };

            await createPost(postData);
            router.push('/posts');
        } catch (error) {
            console.error('게시글 작성 중 오류:', error);
            alert('게시글 작성에 실패했습니다.');
        } finally {
            setIsProcessing(false);
        }
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
                            onImageClick={handleImageSelect}
                            selectedImages={selectedThumbnails}
                            toolbarStyle="border-b bg-gray-50 p-2 flex flex-wrap gap-1"
                            contentStyle="p-4 min-h-[200px] bg-white prose-sm"
                        />
                    </div>

                    {selectedThumbnails.length > 0 && (
                        <div>
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
                            disabled={isProcessing}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                            disabled={isProcessing}
                        >
                            {isProcessing ? '처리 중...' : '작성하기'}
                        </button>
                    </div>
                </form>
            </div>
        </Container>
        </div>
    );
} 