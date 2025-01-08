// useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { LoginCredentials } from "@/types/authTypes";
import { fetchClient, FetchOptions } from '@/lib/fetchClient'
import { setAuthToken } from '@/lib/authInterceptor';

export class LoginError extends Error {
 constructor(message: string, public status: number) {
   super(message);
   this.name = 'LoginError';
 }
}

export const useLogin = () => {
 return useMutation({
   mutationFn: async (credentials: LoginCredentials) => {
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
     } as FetchOptions)

     if (!response.ok) {
       const errorData = await response.json();
       throw new LoginError(errorData.message || '로그인에 실패했습니다.', response.status);
     }

     const data = await response.json();
     if (data.access_token) {
       console.log('로그인 성공', data.access_token);
       setAuthToken(data.access_token);
     }

     return data;
   }
 });
};
