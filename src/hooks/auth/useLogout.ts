// /src/auth/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import { fetchClient } from '@/lib/fetchClient';
import { setAuthToken } from '@/lib/authInterceptor';
import { useAuthStore } from '@/store/useAuthStore';
import { CrossTabAuth } from '@/lib/auth/crossTabAuth';

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
      resetLoginForm();
      // 백엔드 로그아웃 API 호출
      const response = await fetchClient('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? '로그아웃 실패');
      }
      return true;
    },
    onSuccess: () => {
      // API 호출 성공 후에만 크로스 탭 로그아웃 처리
      setAuthToken(null);
      setLoading(false);
      CrossTabAuth.logout(); // 모든 탭에 로그아웃 이벤트 전파

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