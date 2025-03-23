// store/useAuthStore.ts에 추가할 내용

import { create } from 'zustand';
interface LoginFormState {
  email: string;
  password: string;
  error: string | null;
  view: 'login' | 'findId' | 'findPassword';
  keepLoggedIn: boolean;
  isLocalLoading: boolean;
  isLogoutLoading: boolean;
}

interface AuthStore {
  // 기존 상태들...
  accessToken: string | null;
  tokenExpiry: number | null;
  loading: boolean;
  role: string | null;
  email: string | null;
  sub: string | null;
  nickname: string | null;
  isAuthenticated: boolean;

  // 토큰 관련 상태 추가
  tokenVersion: number | null;
  keepLoggedIn: boolean;

  // 프로필 정보 추가
  profile: {
    name: string | null;
    profileImage: string | null;
    status: string | null;
    emailVerified: boolean;
    lastLoginAt: string | null;
    preferences: {
      language: string;
      timezone: string;
      theme: string;
    } | null;
    notificationSettings: any | null;
    points: number;
    levelInfo: any | null;
    marketingAgreed: boolean;
    termsAgreed: boolean;
    privacyAgreed: boolean;
  } | null;

  // 로그인 폼 상태
  loginForm: LoginFormState;

  // 기존 액션들...
  updateAuthState: (payload: Partial<{
    accessToken: string | null;
    tokenExpiry: number | null;
    role: string | null;
    nickname: string | null;
    email: string | null;
    sub: string | null;
    isAuthenticated: boolean;
    tokenVersion: number | null;
    keepLoggedIn: boolean;
  }>) => void;
  resetAuthState: () => void;
  setLoading: (isLoading: boolean) => void;

  // 프로필 관련 액션 추가
  updateProfile: (profile: AuthStore['profile']) => void;
  resetProfile: () => void;

  // 로그인 폼 관련 액션
  updateLoginForm: (payload: Partial<LoginFormState>) => void;
  resetLoginForm: () => void;
}

const initialState = {
  // 기존 상태...
  accessToken: null,
  tokenExpiry: null,
  loading: true,
  role: null,
  email: null,
  sub: null,
  nickname: null,
  isAuthenticated: false,

  // 토큰 관련 상태 초기화
  tokenVersion: null,
  keepLoggedIn: false,

  // 프로필 정보 초기화
  profile: null,

  // 로그인 폼 초기 상태
  loginForm: {
    email: '',
    password: '',
    error: null,
    view: 'login' as const,
    keepLoggedIn: false,
    isLocalLoading: false,
    isLogoutLoading: false,
  }
} as const;

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  
  updateAuthState: (payload) => set((state) => ({
    ...state,
    ...payload
  })),
  
  resetAuthState: () => set(initialState),
  
  setLoading: (isLoading) => set({ loading: isLoading }),

  // 프로필 관련 액션
  updateProfile: (profile) => set({ profile }),
  resetProfile: () => set({ profile: null }),

  // 로그인 폼 관련 액션
  updateLoginForm: (payload) => set((state) => ({
    loginForm: {
      ...state.loginForm,
      ...payload
    }
  })),

  resetLoginForm: () => set((state) => ({
    loginForm: initialState.loginForm
  }))
}));



// import { create } from 'zustand';

// interface LoginFormState {
//   email: string;
//   password: string;
//   error: string | null;
//   view: 'login' | 'findId' | 'findPassword';
//   keepLoggedIn: boolean;
// }

// interface AuthStore {
//   // 기존 상태들...
//   accessToken: string | null;
//   tokenExpiry: number | null;
//   loading: boolean;
//   role: string | null;
//   email: string | null;
//   sub: string | null;
//   isAuthenticated: boolean;

//   // 로그인 폼 관련 상태 추가
//   loginForm: LoginFormState;

//   // 기존 액션들...
//   updateAuthState: (payload: Partial<{
//     accessToken: string | null;
//     tokenExpiry: number | null;
//     role: string | null;
//     email: string | null;
//     sub: string | null;
//     isAuthenticated: boolean;
//   }>) => void;
//   resetAuthState: () => void;
//   setLoading: (isLoading: boolean) => void;

//   // 로그인 폼 관련 액션 추가
//   updateLoginForm: (payload: Partial<LoginFormState>) => void;
//   resetLoginForm: () => void;
// }

// const initialState = {
//   accessToken: null,
//   tokenExpiry: null,
//   loading: true,
//   role: null,
//   email: null,
//   sub: null,
//   isAuthenticated: false,
//   loginForm: {
//     email: '',
//     password: '',
//     error: null,
//     view: 'login' as const,
//     keepLoggedIn: false
//   }
// } as const;

// export const useAuthStore = create<AuthStore>((set) => ({
//   ...initialState,
  
//   updateAuthState: (payload) => set(payload),
  
//   resetAuthState: () => set(initialState),
  
//   setLoading: (isLoading) => set({ loading: isLoading }),

//   // 로그인 폼 관련 액션
//   updateLoginForm: (payload) => set((state) => ({
//     loginForm: {
//       ...state.loginForm,
//       ...payload
//     }
//   })),

//   resetLoginForm: () => set((state) => ({
//     loginForm: initialState.loginForm
//   }))
// }));


// import { create } from 'zustand'

// // 인증 관련 전역 상태 관리
// // - 액세스 토큰 저장
// // - 토큰 만료 시간 관리
// // - 로딩 상태 관리

// // 상태 관리 항목:
// // 1. accessToken: 현재 액세스 토큰
// // 2. tokenExpiry: 토큰 만료 시간
// // 3. loading: 인증 처리 중 상태


// /*
// interface DecodedToken {
//   email: string;
//   sub: string;
//   role: string;
//   preferences: {
//     theme: string;
//     language: string;
//     timezone: string;
//   };
//   tokenVersion: number;
//   keepLoggedIn: boolean;
//   iat: number;
//   exp: number;
//   // [key: string]: any;
// }
// */

// interface AuthStore {
//   accessToken: string | null;
//   tokenExpiry: number | null;
//   loading: boolean;
//   role: string | null;
//   email: string | null;
//   sub: string | null;
//   isAuthenticated: boolean;
//   // preferences: {
//   //   theme: string;
//   //   language: string;
//   //   timezone: string;
//   // };
//   updateAuthState: (payload: Partial<{ // 부분적 업데이트가 가능하도록 partial사용
//     accessToken: string | null;
//     tokenExpiry: number | null;
//     role: string | null;
//     email: string | null;
//     sub: string | null;
//     isAuthenticated: boolean;
//   }>) => void;
//   resetAuthState: () => void;
//   setLoading: (isLoading: boolean) => void;
// }

// const initialState = {
//   accessToken: null,
//   tokenExpiry: null,
//   loading: true,
//   role: null,
//   email: null,
//   sub: null,
//   isAuthenticated: false,
// } as const;

// export const useAuthStore = create<AuthStore>((set) => ({
//   ...initialState,
  
//   updateAuthState: (payload) => set(payload),
  
//   resetAuthState: () => set(initialState),
  
//   setLoading: (isLoading) => set({ loading: isLoading }),
// })); 