'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore'
import { setAuthToken } from '@/lib/authInterceptor';
import { fetchClient } from '@/lib/fetchClient';

export default function SocialAuthCallback() {
  // const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const {isAuthenticated, updateAuthState} = useAuthStore()
  
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // 인증 상태 변경 감지
  useEffect(() => {
    if (isProcessing) return; // 처리 중일 때는 라우팅하지 않음
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router, isProcessing]);

  useEffect(() => {
    // if (!isMounted) return;
    if (isProcessing) return;

    const handleCallback = async () => {
      try {
        setIsProcessing(true);
        const response = await fetchClient('/auth/access-token', {
          method: 'POST',
          skipAuth: true,
          headers: { 'x-client-type': 'web' }
        });

        const data = await response.json();
        console.log('Social auth response:', data);

        if (!data.access_token) {
          throw new Error('토큰이 없습니다.');
        }

        // 토큰 설정
        setAuthToken(data.access_token);
        
        // 상태 업데이트
        updateAuthState({
          isAuthenticated: true, 
          accessToken: data.access_token,
          email: data.email,
          role: data.role,
          nickname: data.nickname
        });

      } catch (error) {
        console.error('Social auth callback error:', error);
        setAuthToken(null);
        router.push('/auth/signup');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  // }, [router, searchParams, isMounted, isAuthenticated]);
  // }, [router, searchParams, isMounted,]);
}, [router, searchParams, isProcessing,]);

  // }, [ isMounted,]);

  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">소셜 로그인 처리중...</h2>
        <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}