'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { colors } from '@/constants/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { useWithdraw } from '@/hooks/auth/useWithdraw';
import { WithdrawalReason, WithdrawalReasonLabel } from '@/types/member';
import { useUpdatePassword } from '@/hooks/auth/useUpdatePassword';
import { logger } from '@/utils/logger';
export default function MyPage() {
  const { isAuthenticated, email, nickname } = useAuthStore();
  const router = useRouter();
  const { 
    profile, 
    isLoading, 
    error, 
    isEditMode,
    toggleEditMode,
    updateProfile 
  } = useProfileStore();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawDetail, setWithdrawDetail] = useState('');
  
  const { mutate: withdraw, isPending } = useWithdraw();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword();

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    logger.info('Profile Data:', {
      isLoading,
      error,
      profile,
      isAuthenticated
    });
  }, [isLoading, error, profile, isAuthenticated]);

  const handleWithdraw = () => {
    if (!withdrawReason) {
      alert('탈퇴 사유를 선택해주세요.');
      return;
    }

    if (confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      withdraw(
        { reason: withdrawReason, detail: withdrawDetail },
        {
          onError: (error) => {
            alert(error.message || '회원 탈퇴 중 오류가 발생했습니다.');
          }
        }
      );
    }
  };

  const handlePasswordUpdate = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    updatePassword(passwordForm, {
      onSuccess: () => {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setIsPasswordModalOpen(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      },
      onError: (error: any) => {
        alert(error.message || '비밀번호 변경 중 오류가 발생했습니다.');
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600">로그인이 필요한 페이지입니다.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">마이페이지</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-600">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>
        ) : (
          <div className="space-y-8">
            {/* 프로필 섹션 */}
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900">프로필 정보</h2>
                  <button
                    onClick={toggleEditMode}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {isEditMode ? '저장' : '수정'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* 프로필 이미지 */}
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                      {profile?.avatarUrl ? (
                        <Image
                          src={profile.avatarUrl}
                          alt="프로필 이미지"
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <User className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {isEditMode && (
                      <button className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        이미지 변경
                      </button>
                    )}
                  </div>

                  {/* 프로필 정보 */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <p className="text-gray-900">{email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={profile?.nickname || ''}
                            onChange={(e) => updateProfile({ nickname: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          // <p className="text-gray-900">{profile?.nickname}</p>
                          <p className="text-gray-900">{nickname}</p>
                        )}
                      </div>
                    </div>

                    {profile && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
                          {isEditMode ? (
                            <textarea
                              value={profile.bio}
                              onChange={(e) => updateProfile({ bio: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={3}
                            />
                          ) : (
                            <p className="text-gray-900 whitespace-pre-line">{profile.bio}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 설정 섹션 */}
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">설정</h2>
                <div className="space-y-6">
                  {/* 비밀번호 변경 버튼은 profile 여부와 관계없이 표시 */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      비밀번호 변경
                    </button>
                  </div>

                  {/* 테마와 언어 설정은 profile이 있을 때만 표시 */}
                  {profile && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">테마</label>
                        <select
                          value={profile.preferences.theme}
                          onChange={(e) => updateProfile({
                            preferences: { ...profile.preferences, theme: e.target.value as 'light' | 'dark' }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          disabled={!isEditMode}
                        >
                          <option value="light">라이트</option>
                          <option value="dark">다크</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">언어</label>
                        <select
                          value={profile.preferences.language}
                          onChange={(e) => updateProfile({
                            preferences: { ...profile.preferences, language: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          disabled={!isEditMode}
                        >
                          <option value="ko">한국어</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            회원 탈퇴
          </button>

          {isWithdrawModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-black">회원 탈퇴</h3>
                  <p className="text-sm text-red-600">
                    회원 탈퇴 시 모든 개인정보가 삭제되며, 이 작업은 되돌릴 수 없습니다.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">탈퇴 사유 *</label>
                    <select
                      value={withdrawReason}
                      onChange={(e) => setWithdrawReason(e.target.value)}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">선택해주세요</option>
                      {Object.entries(WithdrawalReasonLabel).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">상세 사유 (선택사항)</label>
                    <textarea
                      value={withdrawDetail}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWithdrawDetail(e.target.value)}
                      placeholder="상세 사유를 입력해주세요"
                      rows={3}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={isPending}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isPending ? '처리중...' : '탈퇴하기'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 비밀번호 변경 모달 */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">비밀번호 변경</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isUpdatingPassword ? '변경 중...' : '변경하기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 