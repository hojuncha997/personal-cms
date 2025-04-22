import React from 'react';

export const SignupSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl border border-gray-700">
        <div className="text-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>

        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              또는 이메일로 회원가입
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}; 