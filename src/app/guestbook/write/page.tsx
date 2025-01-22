'use client'

import React, { useState } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import { useRouter } from 'next/navigation';

interface GuestbookForm {
    title: string;
    content: string;
}

const GuestbookWrite: React.FC = () => {
    const router = useRouter();
    const [form, setForm] = useState<GuestbookForm>({
        title: '',
        content: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // TODO: API 연동
        // const response = await fetch('/api/guestbook', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(form)
        // });

        // 임시로 콘솔에 출력
        console.log('제출된 데이터:', form);
        
        // 목록 페이지로 이동
        router.push('/guestbook');
    };

    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
            <Container>
                <div className="max-w-4xl w-full mx-auto py-8">
                    <div className="w-full">
                        <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-black">방명록 작성</h1>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        제목
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="제목을 입력하세요"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                        내용
                                    </label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        rows={8}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="방명록 내용을 입력하세요"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        작성하기
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default GuestbookWrite; 