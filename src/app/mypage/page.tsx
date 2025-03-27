'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile } from '@/hooks/auth/useProfile';
import { colors } from '@/constants/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Eye, EyeOff } from 'lucide-react';
import { useWithdraw } from '@/hooks/auth/useWithdraw';
import { WithdrawalReason, WithdrawalReasonLabel } from '@/types/member';
import { useUpdatePassword } from '@/hooks/auth/useUpdatePassword';
import { logger } from '@/utils/logger';
import useGetPasswordResetToken from '@/hooks/auth/useGetPasswordResetToken';
import { validatePassword, PASSWORD_POLICY } from '@/constants/auth/password-policy';
import { fetchClient } from '@/lib/fetchClient';

export default function MyPage() {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawDetail, setWithdrawDetail] = useState('');
  
  const { mutate: withdraw, isPending } = useWithdraw();
  const { getPasswordResetToken, isPending: isPasswordResetPending } = useGetPasswordResetToken();

  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    logger.info('Profile Data:', {
      isLoading,
      error,
      profile,
      isAuthenticated,
      loading
    });
  }, [isLoading, error, profile, isAuthenticated, loading]);

  // 인증 상태 체크 및 리다이렉션
  useEffect(() => {
    // 로딩 중이 아니고 인증되지 않은 경우에만 리다이렉트
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // 로딩 중이거나 프로필 로딩 중이면 로딩 표시
  if (loading || isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>프로필 정보를 불러오는데 실패했습니다.</div>;
  }

  if (!profile) {
    return <div>프로필 정보가 없습니다.</div>;
  }

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setPasswordChangeMessage({ type: 'error', text: passwordError });
      return;
    }
    
    if (newPassword !== newPasswordConfirm) {
      setPasswordChangeMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    setIsChangingPassword(true);
    setPasswordChangeMessage({ type: 'info', text: '비밀번호를 변경하는 중입니다...' });

    try {
      await fetchClient('/members/me/update-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      setPasswordChangeMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다.' });
      
      // 3초 후에 폼 닫기
      setTimeout(() => {
        setIsPasswordChangeOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');
        setPasswordChangeMessage(null);
      }, 3000);

    } catch (error) {
      // 서버에서 받은 에러 메시지 처리
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      let displayMessage = errorMessage;

      // 특정 에러 메시지를 더 사용자 친화적인 메시지로 변환
      if (errorMessage.includes('현재 비밀번호가 일치하지 않습니다')) {
        displayMessage = '현재 비밀번호가 올바르지 않습니다. 다시 확인해주세요.';
      }

      setPasswordChangeMessage({ 
        type: 'error', 
        text: displayMessage
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">마이페이지</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
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
              </div>

              {/* 프로필 정보 */}
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이름</label>
                    <p className="mt-1 text-gray-900">{profile.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">닉네임</label>
                    <p className="mt-1 text-gray-900">{profile.nickname}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* 비밀번호 변경 섹션 */}
            <div className="bg-white shadow rounded-lg p-6 mb-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">비밀번호 변경</h2>
                <button
                  onClick={() => setIsPasswordChangeOpen(!isPasswordChangeOpen)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isPasswordChangeOpen ? '취소' : '비밀번호 변경'}
                </button>
              </div>

              {isPasswordChangeOpen && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      현재 비밀번호
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      새 비밀번호
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        required
                        minLength={PASSWORD_POLICY.MIN_LENGTH}
                        maxLength={PASSWORD_POLICY.MAX_LENGTH}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      비밀번호는 8~128자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="newPasswordConfirm" className="block text-sm font-medium text-gray-700">
                      새 비밀번호 확인
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPasswordConfirm ? "text" : "password"}
                        id="newPasswordConfirm"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        required
                        minLength={PASSWORD_POLICY.MIN_LENGTH}
                        maxLength={PASSWORD_POLICY.MAX_LENGTH}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                      >
                        {showNewPasswordConfirm ? (
                          <EyeOff className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordChangeMessage && (
                    <p className={`text-sm ${
                      passwordChangeMessage.type === 'error' ? 'text-red-600' : 
                      passwordChangeMessage.type === 'success' ? 'text-green-600' :
                      'text-blue-600'
                    } mt-2`}>
                      {passwordChangeMessage.text}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isChangingPassword
                          ? 'bg-blue-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {isChangingPassword ? '변경 중...' : '변경하기'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 회원 탈퇴 섹션 */}
            <div className="bg-white shadow rounded-lg p-6 mt-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">회원 탈퇴</h2>
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  회원 탈퇴
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                회원 탈퇴 시 모든 개인정보가 삭제되며, 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
          </div>

          {/* 회원 탈퇴 모달 */}
          {isWithdrawModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
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
      </div>
    </div>
  );
} 