import { create } from 'zustand'

// 인증 관련 전역 상태 관리
// - 액세스 토큰 저장
// - 토큰 만료 시간 관리
// - 로딩 상태 관리

// 상태 관리 항목:
// 1. accessToken: 현재 액세스 토큰
// 2. tokenExpiry: 토큰 만료 시간
// 3. loading: 인증 처리 중 상태

interface AuthStore {
  accessToken: string | null;
  tokenExpiry: number | null;
  loading: boolean;
  setAccessToken: (token: string | null) => void;
  setTokenExpiry: (expiry: number | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  tokenExpiry: null,
  loading: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setTokenExpiry: (expiry) => set({ tokenExpiry: expiry }),
  setLoading: (isLoading) => set({ loading: isLoading })
})); 