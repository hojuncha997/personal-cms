import { useAuthStore } from '@/store/useAuthStore';
import { fetchClient } from '@/lib/fetchClient';
import { SocialProvider } from '@/types/authTypes';


export default async function useSocialSignUp (provider: SocialProvider) {
    // try {
    //   setIsLoading(true);
        
      // 소셜 로그인 URL 가져오기
      const response = await fetchClient(`/auth/social/${provider}/url`, { skipAuth: true });
      // console.log('response', response);
      // alert('response: ' + JSON.stringify(await response.json()));
      const { url } = await response.json();
      
      if (!url) {
        throw new Error('인증 URL을 가져오는데 실패했습니다.');
      }

      // 현재 창에서 소셜 로그인 페이지로 리다이렉트
      window.location.href = url;

      // 소셜 로그인 페이지 팝업
      // window.open(url, '_blank');

    // } catch (error) {
    //   console.error(`${provider} sign up failed:`, error);
    //   // setErrors(prev => ({ 
    //   //   ...prev, 
    //   //   social: '소셜 로그인 연동 중 오류가 발생했습니다.' 
    //   // }));
    //   // setIsLoading(false);
    // }
  };