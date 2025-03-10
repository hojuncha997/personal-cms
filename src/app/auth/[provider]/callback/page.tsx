'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore'
import { setAuthToken } from '@/lib/authInterceptor';

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/access-token`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-client-type': 'web'
          },
        });

        // 먼저 response.ok를 체크
        if (!response.ok) {
          throw new Error('소셜 로그인에 실패했습니다.');
        }

        const data = await response.json();
        console.log('Social auth response:', data); // 디버깅용

        // accessToken이 있는지 확실히 체크
        if (!data.access_token) {
          throw new Error('토큰이 없습니다.');
        }

        // 모든 체크가 통과한 후에만 상태 업데이트
        // updateAuthState({
        //   isAuthenticated: true, 
        //   accessToken: data.access_token
        // });
        console.log("useAuthStore.getState() before setAuthToken: ", useAuthStore.getState());
        setAuthToken(data.access_token);
        console.log("useAuthStore.getState() after setAuthToken: ", useAuthStore.getState());

        
        // 상태 업데이트 후 리다이렉트
        await router.replace('/');

      } catch (error) {
        console.error('Social auth callback error:', error);
        // 에러 발생 시 인증 상태 리셋
        // updateAuthState({
        //   isAuthenticated: false,
        //   accessToken: null
        // });
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