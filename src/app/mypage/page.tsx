'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { colors } from '@/constants/styles';
import Image from 'next/image';

export default function MyPage() {
  const { isAuthenticated, email, role } = useAuthStore();
  const { 
    profile, 
    isLoading, 
    error, 
    isEditMode,
    toggleEditMode,
    updateProfile 
  } = useProfileStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">로그인이 필요한 페이지입니다.</p>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 bg-[${colors.primary.main}]`} style={{backgroundColor: colors.primary.main}}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl text-black mb-8">마이페이지</h1>
        
        {isLoading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            {/* 프로필 섹션 */}
            <section className={`bg-[${colors.primary.main}] text-black border-[1px] border-black p-6 rounded-lg shadow`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">프로필 정보</h2>
                <button
                  onClick={toggleEditMode}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-green-900"
                >
                  {isEditMode ? '저장' : '수정'}
                </button>
              </div>

              {/* 프로필 이미지 추가 */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-[200px] h-[200px] border-[1px] border-black rounded-xl overflow-hidden mb-2">
                  <Image
                    src={profile?.avatarUrl || '/images/default-avatar.png'}
                    alt="프로필 이미지"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditMode && (
                  <button className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-green-900">
                    이미지 변경
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">이메일</label>
                  <p className="mt-1">{email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">권한</label>
                  <p className="mt-1">{role}</p>
                </div>

                {profile && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">닉네임</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={profile.nickname}
                          onChange={(e) => updateProfile({ nickname: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      ) : (
                        <p className="mt-1">{profile.nickname}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">자기소개</label>
                      {isEditMode ? (
                        <textarea
                          value={profile.bio}
                          onChange={(e) => updateProfile({ bio: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1">{profile.bio}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* 설정 섹션 */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">설정</h2>
              {profile && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">테마</label>
                    <select
                      value={profile.preferences.theme}
                      onChange={(e) => updateProfile({
                        preferences: { ...profile.preferences, theme: e.target.value as 'light' | 'dark' }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      disabled={!isEditMode}
                    >
                      <option value="light">라이트</option>
                      <option value="dark">다크</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">언어</label>
                    <select
                      value={profile.preferences.language}
                      onChange={(e) => updateProfile({
                        preferences: { ...profile.preferences, language: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      disabled={!isEditMode}
                    >
                      <option value="ko">한국어</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
} 