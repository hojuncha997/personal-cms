import { useMutation } from "@tanstack/react-query";
import { fetchClient } from '@/lib/fetchClient';

interface UpdatePasswordCredentials {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}


export class UpdatePasswordError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'UpdatePasswordError';
  }
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (credentials: UpdatePasswordCredentials) => {
      try {
        const response = await fetchClient('/members/me/password', {
          method: 'PUT',
          body: credentials,
          skipAuth: false,
        });

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('비밀번호 업데이트 에러:', error);
        if (error instanceof UpdatePasswordError) {
          throw error;
        }
        if (error instanceof Error && error.message.includes('HTTP error!')) {
          const errorMessage = error.message.includes('message')
            ? JSON.parse(error.message.split(' - ')[1]).message
            : '비밀번호 업데이트에 실패했습니다.';
          throw new UpdatePasswordError(errorMessage, 500);
        }
        throw new UpdatePasswordError('비밀번호 업데이트 중 오류가 발생했습니다.', 500);
      }
    }
  });
}; 