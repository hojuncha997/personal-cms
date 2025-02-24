import { useMutation } from "@tanstack/react-query";
import { fetchClient } from '@/lib/fetchClient';
// import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/auth/useLogout';
import { useRouter } from 'next/navigation';

export class WithdrawError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'WithdrawError';
  }
}

interface WithdrawRequest {
  reason: string;
  detail?: string;
}

export const useWithdraw = () => {
  const router = useRouter();
  const { mutate: logout } = useLogout();
  
  return useMutation({
    mutationFn: async (data: WithdrawRequest) => {
      try {
        const response = await fetchClient('/members/withdraw', {
          method: 'DELETE',
          body: JSON.stringify(data)
        });

        if (response.ok) {
          await logout();
          router.push('/');
          return true;
        }
        
        throw new WithdrawError('회원 탈퇴에 실패했습니다.', 500);
      } catch (error) {
        console.error('회원 탈퇴 에러:', error);
        throw new WithdrawError('회원 탈퇴 처리 중 오류가 발생했습니다.', 500);
      }
    }
  });
}; 