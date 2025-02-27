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
import { useGetPostCategories, type PostCategory } from '@/hooks/posts/useGetPostCategories';

const formSchema = z.object({
  title: z.string()
    .min(1, { message: '제목은 필수 입력 항목입니다.' })
    .max(50, { message: '제목은 최대 50자까지 입력 가능합니다.' }),
  content: z.any(),
  categorySlug: z.string().optional(),
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
    const { data: categories, isLoading: isCategoriesLoading } = useGetPostCategories();
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
            categorySlug: '',
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

    // 이미지 URL을 받아서 300x300 크기의 썸네일 Blob을 생성하는 함수
    const createThumbnail = async (imageUrl: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // CORS 이슈 방지를 위한 crossOrigin 설정
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    reject(new Error('Canvas context를 생성할 수 없습니다.'));
                    return;
                }

                // 썸네일 크기 설정 (300x300 픽셀)
                canvas.width = 300;
                canvas.height = 300;

                // 이미지 비율 유지하면서 캔버스에 맞추기: 짧은 쪽을 기준으로 비율 맞추기
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                // 이미지를 캔버스 중앙에 배치하기 위한 좌표 계산
                const x = (canvas.width - img.width * scale) / 2;
                const y = (canvas.height - img.height * scale) / 2;

                // 흰색 배경 그리기(캔버스는 기본적으로 투명 배경. 이를 jpeg로 저장하면 검정색으로 변환된다. 흰 배경이 더 자연스럽기 때문에 이렇게 설정.)
                ctx.fillStyle = '#fff'; // 그리기 색상을 흰색으로 설정하고
                ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 영역을 채운다. 이 코드들이 없으면 이미지가 어둡게 보일 수 있다. 투명 png를 사용하는 경우 유용.
                /* 
                    아래와 같이도 사용 가능하다(그라데이션이라든지 패턴 등).

                     // 단색 설정
                    ctx.fillStyle = '#fff';  // 흰색
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';  // 반투명 흰색

                    // 그라데이션 설정
                    const gradient = ctx.createLinearGradient(0, 0, 300, 300);
                    gradient.addColorStop(0, '#ff6b6b');    // 시작 색상
                    gradient.addColorStop(1, '#4ecdc4');    // 끝 색상
                    ctx.fillStyle = gradient;

                    // 패턴 설정
                    const img = new Image();
                    img.src = 'pattern.png';
                    const pattern = ctx.createPattern(img, 'repeat');
                    ctx.fillStyle = pattern;
                */

                // 이미지 그리기: 이미지를 캔버스에 그릴 때 브라우저의 이미지 리샘플링 알고리즘이 적용됨.
                // 큰 이미지를 작은 크기로 줄일 때 픽셀을 적절히 보간하여 처리
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                // 캔버스를 JPEG Blob으로 변환 (품질: 80%). png는 무손실 압축이라 용량이 커져서 사용하지 않음.
                // webp는 품질이 좋고 용량도 jpeg보다 적어지지만 로직을 많이 바꿔야 하므로 추후 적용.
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
                // 선택된 첫 번째 이미지로 썸네일 생성
                const thumbnailBlob = await createThumbnail(selectedThumbnails[0]);
                
                // 썸네일 파일명 생성 (타임스탬프-랜덤문자열.jpg)
                const fileName = `images/thumbnails/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
                // Supabase 스토리지에 썸네일 업로드
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('media-storage')
                    .upload(fileName, thumbnailBlob);

                if (uploadError) throw uploadError;

                // 업로드된 썸네일의 공개 URL 가져오기
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