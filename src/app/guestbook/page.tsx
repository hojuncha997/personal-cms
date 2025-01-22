// src/app/guestbook/page.tsx
// 방명록 페이지

'use client'

import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
export default function Guestbook() {
    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`}>
            <Container>
                <div className="max-w-4xl w-full mx-auto">
                    <div className="w-full">
                        <h1 className="text-2xl font-bold mb-8">방명록</h1>
                        <div className="w-full">
                            <div>
                                <h2 className="text-xl mb-4">방명록 작성</h2>
                                <div>
                                    <table className="w-full border-collapse border border-black border-r-md">
                                        <thead className="bg-gray-200">
                                            <tr className="border border-black" >
                                                <tr className="flex justify-center items-center"><input type='checkbox' /></tr>
                                                <th className="border border-black">번호</th>
                                                <th className="border border-black">이름</th>
                                                <th className="border border-black">내용</th>
                                                <th className="border border-black">작성일</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border border-black">
                                                <td className="border border-black">이름</td>
                                                <td className="border border-black">내용</td>
                                                <td className="border border-black">작성일</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <textarea className="w-full p-4 rounded-lg border"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}