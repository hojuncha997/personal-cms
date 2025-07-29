'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mt-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            페이지를 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 mb-8">
            요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              이전 페이지
            </button>
            <Link
              href="/"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 