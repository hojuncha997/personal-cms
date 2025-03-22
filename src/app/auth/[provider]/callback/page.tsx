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

  useEffect(() => {
    // if (!isMounted) return;
    if (isProcessing) return;

    const handleCallback = async () => {
      try {
        setIsProcessing(true);
        const response = await fetchClient('/auth/access-token', {
          method: 'POST',
          skipAuth: true,
          headers: {
            'x-client-type': 'web'
          }
        });

        const data = await response.json();
        console.log('Social auth response:', data);

        if (!data.access_token) {
          throw new Error('토큰이 없습니다.');
        }

        setAuthToken(data.access_token);
        
        updateAuthState({
          isAuthenticated: true, 
          accessToken: data.access_token,
          email: data.email,
          role: data.role,
          nickname: data.nickname
        });

        router.replace('/');

      } catch (error) {
        console.error('Social auth callback error:', error);
        setAuthToken(null);
        router.push('/auth/signup');
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



// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useAuthStore } from '@/store/useAuthStore'

// export default function SocialAuthCallback() {
//   const [isMounted, setIsMounted] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const {isAuthenticated, updateAuthState} = useAuthStore()
  
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!isMounted) return;
    
//     const handleCallback = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/access-token`, {
          
//           method: 'POST',
//           credentials: 'include', // fetch 옵션의 최상위 레벨로 이동

//           headers: {
//             'Content-Type': 'application/json',
//             'x-client-type': 'web'  // 추가*중요!!!!!!!

//           },
//           // body: JSON.stringify({
//           //   provider: window.location.pathname.split('/')[2], // 'google', 'kakao', 'naver'
//           // }),
//         });

//         const data = await response.json();
//         // alert("data: " + JSON.stringify(data));
//         const accessToken = data.access_token;

//         if (!response.ok) {
//           throw new Error(data.message || '소셜 로그인에 실패했습니다.');
//         }

//         // 회원가입/로그인 성공 시 토큰 저장 및 리다이렉트
//         if (accessToken) {
//           // localStorage.setItem('accessToken', data.accessToken);
//           updateAuthState({isAuthenticated: true, accessToken: data.accessToken})
//           router.replace('/');  // 또는 원하는 페이지로 리다이렉트
//         }
//       } catch (error) {
//         console.error('Social auth callback error:', error);
//         router.push('/auth/signup');
//       }
//     };

//     handleCallback();
//   }, [router, searchParams, isMounted]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="text-center">
//         <h2 className="text-xl font-semibold text-gray-700">소셜 로그인 처리중...</h2>
//         <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
//       </div>
//     </div>
//   );
// } 