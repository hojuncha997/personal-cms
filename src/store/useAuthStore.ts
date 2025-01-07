import { create } from 'zustand'

// 인증 관련 전역 상태 관리
// - 액세스 토큰 저장
// - 토큰 만료 시간 관리
// - 로딩 상태 관리

// 상태 관리 항목:
// 1. accessToken: 현재 액세스 토큰
// 2. tokenExpiry: 토큰 만료 시간
// 3. loading: 인증 처리 중 상태


/*
interface DecodedToken {
  email: string;
  sub: string;
  role: string;
  preferences: {
    theme: string;
    language: string;
    timezone: string;
  };
  tokenVersion: number;
  keepLoggedIn: boolean;
  iat: number;
  exp: number;
  // [key: string]: any;
}
*/

interface AuthStore {
  accessToken: string | null;
  tokenExpiry: number | null;
  loading: boolean;
  role: string | null;
  email: string | null;
  sub: string | null;
  // preferences: {
  //   theme: string;
  //   language: string;
  //   timezone: string;
  // };
  updateAuthState: (payload: Partial<{ // 부분적 업데이트가 가능하도록 partial사용
    accessToken: string | null;
    tokenExpiry: number | null;
    role: string | null;
    email: string | null;
    sub: string | null;
  }>) => void;
  resetAuthState: () => void;
  setLoading: (isLoading: boolean) => void;
}

const initialState = {
  accessToken: null,
  tokenExpiry: null,
  loading: false,
  role: null,
  email: null,
  sub: null,
} as const;

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  
  updateAuthState: (payload) => set(payload),
  
  resetAuthState: () => set(initialState),
  
  setLoading: (isLoading) => set({ loading: isLoading }),
})); 