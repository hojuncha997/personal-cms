'use client';

import React, { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layouts/Container';

interface ApiError {
  response: {
    status: number;
  };
  code: string;
  message: string;
}

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('이메일 인증을 진행중입니다...');

  const token = searchParams.get('token');
  
  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }
    verifyEmailToken(token);
  }, [token, router]);

  const verifyEmailToken = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (!response.ok) {
        setVerificationStatus('error');
        setMessage(data.message || "이메일 인증에 실패했습니다.");
        setTimeout(() => {
          router.push('/');
        }, 3000);
        return;
      }

      setVerificationStatus('success');
      setMessage(data.message || "이메일 인증이 완료되었습니다.");
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (error) {
      const apiError = error as ApiError;
      setVerificationStatus('error');
      setMessage(apiError.message || '알 수 없는 오류가 발생했습니다.');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  }, [router]);

  /*
{
    "message": "만료된 인증 토큰입니다. 새로운 인증 메일을 발송했습니다.",
    "error": "Bad Request",
}
  */

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className='h-screen w-full bg-white' >
    <Container>
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-2xl font-bold text-gray-700'>스켈레톤</h1>
        </div>
    </Container>
  </div>;

  return (
      <div className='bg-white'>
        <Container>
          <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-2xl font-bold text-gray-700'>이메일 인증</h1>
            <div className='text-sm text-gray-500'>
              {message}
              {verificationStatus !== 'loading' && (
                <span className='block text-sm text-gray-500'>
                  3초 뒤 메인 페이지로 이동합니다.
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>
   
  );
}

const VerifyEmail: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmail;