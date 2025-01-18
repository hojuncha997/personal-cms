//src/app/auth/error/page.tsx
// 인증 에러 페이지

'use client'

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ERROR_MESSAGES = {
    'EMAIL_EXISTS': '이미 가입된 이메일입니다. 다른 방법으로 로그인해주세요.',
    'LOGIN_FAILED': '로그인 처리 중 문제가 발생했습니다.',
    // ... 다른 에러 케이스들
  };

export default function AuthErrorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const code = searchParams.get('code');
    const errorMessage = code ? ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] : undefined;


    return (
        <div className="flex flex-col justify-center items-center h-screen bg-white">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h2 className="text-lg font-semibold text-red-700 mb-2">로그인 실패</h2>
            <p className="text-red-600">
              {errorMessage || '알 수 없는 오류가 발생했습니다.'}
            </p>
          </div>
          <button onClick={() => router.push('/')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            홈으로 가기
          </button>
        </div>
      );}   