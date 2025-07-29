import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchClient } from '@/lib/fetchClient';
import { logger } from '@/utils/logger';

interface Profile {
  email: string;
  name: string;
  nickname: string;
  profileImage: string | null;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string;
  isSocialMember: boolean;
  provider: string;
  preferences: {
    language: string;
    timezone: string;
    theme: string;
  };
  notificationSettings: any;
  points: number;
  levelInfo: any;
  marketingAgreed: boolean;
  termsAgreed: boolean;
  privacyAgreed: boolean;
}

/**
 * 프로필 정보를 가져오는 훅
 * 
 * 발동 시점:
 * 1. 로그인 성공 시 (setAuthToken에서 isAuthenticated가 true로 설정될 때)
 * 2. 토큰 갱신 시 (handleTokenRefresh에서 새 토큰을 받아 setAuthToken이 호출될 때)
 * 3. 페이지 새로고침 시 (useAuthStore의 초기 상태에서 isAuthenticated가 true일 때)
 * 
 * React Query의 enabled 옵션에 의해 isAuthenticated가 true일 때만 자동으로 실행됨
 * 컴포넌트에서 useProfile()을 선언만 해두면 위 조건이 만족될 때 자동으로 프로필 정보를 가져옴
 */
export const PROFILE_QUERY_KEY = ['profile'] as const;

export function useProfile() {
  // useAuthStore에서 현재 인증 상태와 프로필 정보를 가져옴,
  // isAuthenticated가 true가 되면 함수가 실행됨
  const { isAuthenticated, profile, updateProfile } = useAuthStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('인증되지 않은 사용자');
      }

      try {
        logger.info('[useProfile] 프로필 정보 요청 시작');
        const response = await fetchClient('/members/me');
        const profileData = await response.json();
        
        logger.info('[useProfile] 프로필 정보 조회 성공:', profileData);
        
        // 프로필 정보 업데이트 시 nickname도 함께 업데이트
        updateProfile(profileData);
        useAuthStore.getState().updateAuthState({ nickname: profileData.nickname });
        
        return profileData as Profile;
      } catch (error) {
        logger.error('[useProfile] 프로필 정보 조회 실패:', error);
        throw error;
      }
    },
    enabled: isAuthenticated,  // isAuthenticated가 true일 때만 자동으로 실행
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    retry: 2,
    retryDelay: 1000,
  });
} 