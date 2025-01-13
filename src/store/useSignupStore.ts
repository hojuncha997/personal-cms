// src/store/useSignupStore.ts

import { create } from 'zustand';
// create 함수의 역할은 상태를 관리하는 함수를 생성하는 것이다.



interface SignupStore {
  isSignupComplete: boolean;
  setIsSignupComplete: (value: boolean) => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  isSignupComplete: false,
  setIsSignupComplete: (value) => set({ isSignupComplete: value }),
}));