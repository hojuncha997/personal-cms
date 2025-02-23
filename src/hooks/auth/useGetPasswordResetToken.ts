// src/hooks/auth/useGetPasswordResetToken.ts
// 비밀번호 초기화 토큰 발급 훅

import { useMutation } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

interface PasswordResetTokenResponse {
  success: boolean;
  message: string;
}

interface PasswordResetTokenVariables {
  email: string;
}

const useGetPasswordResetToken = () => {
  const { mutate: getPasswordResetToken, isPending } = useMutation<
    PasswordResetTokenResponse,
    Error,
    PasswordResetTokenVariables
  >({
    mutationFn: async ({ email }) => {
      const response = await fetchClient("/members/password-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
        skipAuth: true,
      });
      
      if (!response.ok) {
        throw new Error("비밀번호 재설정 토큰 발급에 실패했습니다.");
      }
      
      return response.json();
    },
  });

  return {
    getPasswordResetToken,
    isPending,
  };
};

export default useGetPasswordResetToken;



