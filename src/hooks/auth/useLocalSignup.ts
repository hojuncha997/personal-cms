// src/hooks/auth/useLocalSignup.ts
import { useMutation } from "@tanstack/react-query";
import { LocalSignupCredentials } from "@/types/authTypes";
import { fetchClient, FetchOptions } from '@/lib/fetchClient'
import { logger } from '@/utils/logger';

export const useLocalSignup = () => {
  return useMutation({
    mutationFn: async (credentials: LocalSignupCredentials) => {
      const response = await fetchClient('/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'accept': 'application/json'
        },
        body: JSON.stringify(credentials),
        skipAuth: true // 인증 헤더 추가하지 않음
      } as FetchOptions)
      logger.info("response from localSignup", response)
      return response;
    }
  })
}