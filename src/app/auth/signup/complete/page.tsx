'use client';

import { useRouter } from 'next/navigation';
// import { useSignupCompleteNavigation } from '@/hooks/auth/useSignupNavigation';
import { useSignupStore } from '@/store/useSignupStore';
import { useEffect, useState } from 'react';
export default function SignupComplete() {

  const router = useRouter();
  // useSignupCompleteNavigation();
  const { isSignupComplete, setIsSignupComplete } = useSignupStore();

  const [isMounted, setIsMounted] = useState(false);

  // 하이드레이션 완료 체크: 만약 하지 않으면 
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 리다이렉트 체크는 하이드레이션 후에만 실행
  useEffect(() => {
    if (!isMounted) return;

    if (!isSignupComplete) {
      // alert("회원가입 페이지에서 진입해야 합니다.");
      router.replace('/');
    }

    return () => {
      setIsSignupComplete(false);
    }
  }, [isSignupComplete, router, isMounted]);

  // 하이드레이션 전이거나 회원가입이 완료되지 않은 상태면 아무것도 보여주지 않음
  if (!isMounted || !isSignupComplete) {
    return null;
  }

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
          onClick={() => {
            setIsSignupComplete(false);
            router.push('/');
          }}
          className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
} 


/*

문제: 
회원가입 페이지에서 페이지에서 백엔드 서버 가입 요청에 성공하여 완료 페이지로 이동한 후에
 즉시 루트 페이지로 이동해 버리는 문제가 있었음. 또한 루트 페이지에서 뒤로 가기 버튼을 눌러도
 완료 페이지로 이동해 버리는 현상 역시 존재.

해결책:
1. 하이드레이션 과정 설명:
Next.js는 처음에 서버에서 정적 HTML을 생성
브라우저에서 JS가 로드되면서 하이드레이션 발생
이 과정에서 Zustand 스토어가 초기화되면서 isSignupComplete가 false로 설정됨

2. 타이밍 문제:
회원가입 완료 후 /complete 페이지로 이동
하이드레이션 과정에서 스토어가 초기화되면서 isSignupComplete가 false가 됨
useEffect가 즉시 실행되어 홈으로 리다이렉트
해결방법의 적절성:
isMounted 체크는 하이드레이션이 완료된 후에만 리다이렉트 로직이 동작하도록 보장
이는 스토어의 초기 상태가 안정화된 후에 검사를 수행하므로 적절한 해결책

---

대안적 방법으로 세션 스토리지 또는 로컬 스토리지를 사용하는 방법 역시 제시되었음.
서버로부터 성공저인 응답을 받은 이후 세션/로컬 스토리지에 값을 set(true)하는 방법이었는데,
이 역시 통하지 않았음. 마찬가지로 타이밍 문제라고 생각됨. router.push또는 router.replace 모두 
스토리지에 값을 저장하는 속도보다 빠르게 이루어졌기 때문에 완료 페이지에서의 해당 값이 null이 되어 버렸던 것임.

현재의 방법은 스토리지 방식보다 안정적이며 브라우저 공간에 종속되지 않는 장점이 있음.
*/