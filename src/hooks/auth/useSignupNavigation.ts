// 이 방법 역시 타이밍 문제로 실패하였음.
// 스토리지에 값을 저장해주는 속도보다 페이지가 이동하는 속도가 빨랐기 때문에 
// 완료 페이지에서 해당 값을 참조할 때 null을 반환하는 현상이 발생하였음. -> 따라서 즉시 루트 페이지로 이동해 버림.
// 따라서 아래 로직을 사용하여 하이드레이션 후에 리다이렉트 로직이 동작하도록 함.


// const [isMounted, setIsMounted] = useState(false); 
// useEffect(() => {
//   setIsMounted(true);
// }, []);

// useEffect(() => {
//   if (!isMounted) return;
//   if (!isSignupComplete) {
//     alert("회원가입 페이지에서 진입해야 합니다.");
//     router.replace('/');
//     return;
//   }
// }, [isSignupComplete, router, isMounted]);


//--------------------------------





// // hooks/useSignupNavigation.ts
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { useLocalSignup } from '@/hooks/auth/useLocalSignup';
// const SIGNUP_COMPLETE_KEY = 'signup_complete_state';


// // 회원가입 페이지용 훅
// export function useSignupNavigation() {
//     const router = useRouter();
//     const { mutateAsync: localSignup } = useLocalSignup();

//     const handleSignupSuccess = async (signUpData: any) => {
//       try {
//         const result = await localSignup(signUpData);
        
//         if(result.status === 201) {
//             // 로컬 스토리지를 사용해보기 (세션 스토리지와 다르게 지속성이 더 김)
//             localStorage.setItem(SIGNUP_COMPLETE_KEY, 'true');    
//             router.replace('/auth/signup/complete');
//         }
//       } catch (error) {
//         console.error('Sign up failed:', error);
//         throw error;
//       }
//     };
  
//     return { handleSignupSuccess };
// }

// // 완료 페이지용 훅
// export function useSignupCompleteNavigation() {
//     const router = useRouter();
  
//     useEffect(() => {
//       const hasCompletedSignup = localStorage.getItem(SIGNUP_COMPLETE_KEY);
//       console.log("완료 페이지 체크:", hasCompletedSignup);
      
//       if (!hasCompletedSignup) {
//         alert("회원가입 페이지에서 진입해야 합니다.");
//         router.replace('/');
//         return;
//       }

//       const handlePopState = () => {
//         localStorage.removeItem(SIGNUP_COMPLETE_KEY);
//         router.replace('/');
//       };

//       window.addEventListener('popstate', handlePopState);
      
//       return () => {
//         window.removeEventListener('popstate', handlePopState);
//       };
//     }, [router]);
// }