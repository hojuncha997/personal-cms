// /src/auth/useLogout.ts

import { useMutation } from "@tanstack/react-query";
import { fetchClient } from '@/lib/fetchClient';
import { setAuthToken } from '@/lib/authInterceptor';
import { useAuthStore } from '@/store/useAuthStore';

export const useLogout = () => {
  const setLoading = useAuthStore(state => state.setLoading)

  return useMutation({
    mutationFn: async () => {
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
  });
};