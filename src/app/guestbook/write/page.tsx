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
const formSchema = z.object({
  title: z.string()
    .min(1, { message: '제목은 필수 입력 항목입니다.' })
    .max(50, { message: '제목은 최대 50자까지 입력 가능합니다.' }),
  content: z.any(),
  category: z.string().min(1, { message: '카테고리는 필수 입력 항목입니다.' }),
  isPrivate: z.boolean(),
  password: z.string().optional()
    .refine((val) => !val || val.length >= 4, { message: '비밀번호는 4자리 이상이어야 합니다.' })
});

type FormValues = z.infer<typeof formSchema>;

const GuestbookWrite: React.FC = () => {
    const router = useRouter();
    const categories = ['일반', '문의', '칭찬', '제안'];

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: {
                type: 'doc',
                content: [{ type: 'paragraph' }]
            },
            category: '일반',
            isPrivate: false
        }
    });

    const isPrivate = watch('isPrivate');

    const onSubmit = async (data: FormValues) => {
        // 데이터를 보기 좋게 포맷팅
        const formattedData = {
            ...data,
            content: JSON.stringify(data.content, null, 2)
        };
        
        // 콘솔에 출력
        console.log('제출된 데이터:', formattedData);
        
        // alert으로도 표시
        alert(
            '제출된 데이터:\n' + 
            `제목: ${data.title}\n` +
            `카테고리: ${data.category}\n` +
            `비밀글 여부: ${data.isPrivate}\n` +
            `비밀번호: ${data.isPrivate ? data.password : '없음'}\n` +
            `내용: ${JSON.stringify(data.content, null, 2)}`
        );

        router.push('/guestbook');
    };

    return (
        <div className="bg-gray-100 text-black" style={{ backgroundColor: colors.primary.main }}>
        <Container>
            <div className="max-w-4xl mx-auto py-8" style={{ backgroundColor: colors.primary.main }}>
                <h1 className="text-3xl font-bold mb-8">방명록 작성</h1>
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

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('isPrivate')}
                                className="rounded"
                            />
                            <label className="text-sm">비밀글로 작성</label>
                        </div>
                        {isPrivate && (
                            <div className="flex-1">
                                <input
                                    type="password"
                                    {...register('password')}
                                    className="w-full px-4 py-2 border rounded-md"
                                    placeholder="비밀번호를 입력하세요 (4자리 이상)"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
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
};

export default GuestbookWrite; 