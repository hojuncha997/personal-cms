// useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { LoginCredentials } from "@/types/authTypes";
import { fetchClient, FetchOptions } from '@/lib/fetchClient'
import { setAuthToken } from '@/lib/authInterceptor';
import { logger } from '@/utils/logger';

export class LoginError extends Error {
 constructor(message: string, public status: number) {
   super(message);
   this.name = 'LoginError';
 }
}

interface LoginResponse {
  access_token: string;
}

export const useLogin = () => {
 return useMutation({
   mutationFn: async (credentials: LoginCredentials) => {
     try {
       const response = await fetchClient('/auth/local/login', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           ...credentials,
           clientType: 'web'
         }),
         skipAuth: true
       } as FetchOptions);

       const data = await response.json();
       logger.info('서버 응답:', data);
       
       if (data.access_token) {
         logger.info('로그인 성공');
         setAuthToken(data.access_token);
         return data;
       } else {
         throw new LoginError('인증 토큰이 없습니다.', 500);
       }
     } catch (error) {
       logger.error('로그인 에러:', error);
       if (error instanceof LoginError) {
         throw error;
       }
       if (error instanceof Error && error.message.includes('HTTP error!')) {
         const errorMessage = error.message.includes('message')
           ? JSON.parse(error.message.split(' - ')[1]).message
           : '로그인에 실패했습니다.';
         throw new LoginError(errorMessage, 500);
       }
       throw new LoginError('로그인 처리 중 오류가 발생했습니다.', 500);
     }
   }
 });
};
