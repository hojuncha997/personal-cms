// useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { LoginCredentials } from "@/types/authTypes";

export class LoginError extends Error {
 constructor(message: string, public status: number) {
   super(message);
   this.name = 'LoginError';
 }
}

export const useLogin = () => {
 return useMutation({
   mutationFn: async (credentials: LoginCredentials) => {
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/local/login`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       credentials: 'include',
       body: JSON.stringify({
         ...credentials,
         clientType: 'web'
       }),
     });

     if (!response.ok) {
       const errorData = await response.json();
       throw new LoginError(errorData.message || '로그인에 실패했습니다.', response.status);
     }

     return await response.json();
   }
 });
};
