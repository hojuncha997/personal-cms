'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupComplete() {
  const router = useRouter();

  useEffect(() => {
    // 브라우저 히스토리에서 현재 페이지를 대체
    window.history.replaceState(null, '', window.location.href);

    // 뒤로가기 시도시 홈으로 리다이렉트
    const handlePopState = () => {
      router.push('/');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900">회원가입 완료</h1>
        <p className="text-gray-600 mt-2">이메일 인증을 완료해주세요.</p>
        <p className="text-sm text-gray-500 mt-4">
          가입하신 이메일로 인증 링크가 발송되었습니다.<br />
          이메일 인증 완료 후 서비스 이용이 가능합니다.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
} 