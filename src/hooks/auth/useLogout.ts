// /src/auth/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import { fetchClient } from '@/lib/fetchClient';
import { setAuthToken } from '@/lib/authInterceptor';
import { useAuthStore } from '@/store/useAuthStore';

interface LogoutOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  showAlert?: boolean;
}

export const useLogout = (options: LogoutOptions = {}) => {
  const setLoading = useAuthStore(state => state.setLoading);
  const resetLoginForm = useAuthStore(state => state.resetLoginForm);
  const { onSuccess, onError, showAlert = true } = options;

  return useMutation({
    mutationFn: async () => {
      resetLoginForm(); // 로그인 폼 상태 초기화
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetchClient('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? '로그아웃 실패');
      }

      setAuthToken(null);
      setLoading(false);
      return true;
    },
    onSuccess: () => {
      if (showAlert) {
        alert('로그아웃이 완료되었습니다.');
      }
      onSuccess?.();
    },
    onError: (error) => {
      if (showAlert) {
        alert('로그아웃 중 오류가 발생했습니다.');
      }
      onError?.(error);
      console.error('로그아웃 실패:', error);
    },
  });
};