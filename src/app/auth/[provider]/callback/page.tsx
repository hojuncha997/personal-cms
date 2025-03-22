'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore'
import { setAuthToken } from '@/lib/authInterceptor';
import { fetchClient } from '@/lib/fetchClient';

export default function SocialAuthCallback() {
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const {isAuthenticated, updateAuthState} = useAuthStore()
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await fetchClient('/auth/access-token', {
          method: 'POST',
          skipAuth: true,
          headers: { 'x-client-type': 'web' }
        });

        const data = await response.json();
        console.log('소셜 인증 응답 데이터:', data);

        if (!data.access_token) {
          throw new Error('토큰이 없습니다.');
        }

        // 토큰 설정
        setAuthToken(data.access_token);
        console.log('액세스 토큰 설정 완료');
        
        // 상태 업데이트를 Promise로 감싸서 완료 보장
        await new Promise<void>((resolve, reject) => {
          const startTime = Date.now();
          
          // 상태 업데이트 전 현재 상태 확인
          const beforeState = useAuthStore.getState();
          console.log('상태 업데이트 전:', beforeState);
          
          // 토큰 페이로드에서 사용자 정보 추출
          const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
          console.log('토큰 페이로드:', tokenPayload);
          
          updateAuthState({
            isAuthenticated: true, 
            accessToken: data.access_token,
            // 토큰 페이로드의 값을 우선 사용하고, 없으면 서버 응답, 그것도 없으면 기본값 사용
            email: tokenPayload.email || data.email || beforeState.email || '',
            role: tokenPayload.role || data.role || beforeState.role || 'USER',
            nickname: tokenPayload.nickname || data.nickname || beforeState.nickname || '사용자',
            sub: tokenPayload.sub || data.sub || beforeState.sub
          });
          
          console.log('상태 업데이트 요청됨');
          
          // 상태 업데이트가 완료될 때까지 대기
          const checkState = () => {
            const state = useAuthStore.getState();
            console.log('현재 상태 체크:', state);
            
            if (state.isAuthenticated && state.accessToken && state.email && state.role) {
              console.log('상태 업데이트 완료 - 정상');
              resolve();
              return;
            }
            
            // 3초 이상 대기했다면 그냥 진행
            if (Date.now() - startTime > 3000) {
              console.warn('상태 업데이트 타임아웃 - 3초 경과, 강제 진행');
              console.log('타임아웃 시점의 최종 상태:', state);
              resolve();
              return;
            }
            
            console.log(`상태 업데이트 대기 중... (경과: ${Date.now() - startTime}ms)`);
            setTimeout(checkState, 50);
          };
          checkState();
        });

        console.log('상태 업데이트 프로세스 완료, 라우팅 시작');
        // 상태 업데이트 완료 후 라우팅
        router.replace('/');

      } catch (error) {
        console.error('소셜 인증 콜백 에러:', error);
        setAuthToken(null);
        router.push('/auth/signup');
      } finally {
        setIsProcessing(false);
        console.log('처리 완료 (isProcessing = false)');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">소셜 로그인 처리중...</h2>
        <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}