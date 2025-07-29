import { create } from 'zustand';
// import { uploadImage } from '@/lib/api'; // 이미지 업로드 API 함수 필요

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
}

interface UserProfile {
  nickname: string;
  bio: string;
  avatarUrl: string | null;
  preferences: UserPreferences;
}

interface ProfileStore {
  // 상태
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;
  isUploading: boolean;

  // 액션
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  toggleEditMode: () => void;
  resetProfile: () => void;
  uploadProfileImage: (file: File) => Promise<void>;
}

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  isEditMode: false,
  isUploading: false,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState,

  setProfile: (profile) => set({ profile }),
  
  updateProfile: (updates) => 
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  
  resetProfile: () => set(initialState),
  
  uploadProfileImage: async (file: File) => {
    set({ isUploading: true });
    try {
      // const imageUrl = await uploadImage(file);
      // set((state) => ({
      //   profile: state.profile ? { ...state.profile, avatarUrl: imageUrl } : null,
      // }));
    } catch (error) {
      set({ error: '이미지 업로드에 실패했습니다.' });
    } finally {
      set({ isUploading: false });
    }
  },
})); 