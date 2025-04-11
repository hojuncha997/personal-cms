'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile, PROFILE_QUERY_KEY } from '@/hooks/auth/useProfile';
import { colors } from '@/constants/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Eye, EyeOff, Pencil } from 'lucide-react';
import { useWithdraw } from '@/hooks/auth/useWithdraw';
import { WithdrawalReason, WithdrawalReasonLabel } from '@/types/member';
import { useUpdatePassword } from '@/hooks/auth/useUpdatePassword';
import { logger } from '@/utils/logger';
import useGetPasswordResetToken from '@/hooks/auth/useGetPasswordResetToken';
import { validatePassword, PASSWORD_POLICY } from '@/constants/auth/password-policy';
import { fetchClient } from '@/lib/fetchClient';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import MyPageSkeleton from '@/components/auth/skeletons/MyPageSkeleton';

export default function MyPage() {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const [isUpdatingProfileImage, setIsUpdatingProfileImage] = useState(false);
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const updateProfileImage = useAuthStore((state) => state.updateProfileImage);
  const updateNickname = useAuthStore((state) => state.updateNickname);

  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);

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
    return <MyPageSkeleton />;
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
      const response = await fetchClient('/members/me/update-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const { success } = await response.json();

      if (success) {
        setPasswordChangeMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다.' });
        
        // 3초 후에 폼 닫기
        setTimeout(() => {
          setIsPasswordChangeOpen(false);
          setCurrentPassword('');
          setNewPassword('');
          setNewPasswordConfirm('');
          setPasswordChangeMessage(null);
        }, 3000);
      } else {
        throw new Error('비밀번호 변경에 실패했습니다.');
      }
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

  const handleProfileImageUpload = async (file: File) => {
    // 파일 크기 체크 (1MB)
    if (file.size > 1024 * 1024) {
      alert('이미지 크기는 1MB를 초과할 수 없습니다.');
      return;
    }

    // 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, GIF, WEBP 형식만 지원됩니다.');
      return;
    }

    try {
      setIsUpdatingProfileImage(true);

      // Supabase Storage에 이미지 업로드
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-storage')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 업로드된 이미지의 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('media-storage')
        .getPublicUrl(filePath);

      // 백엔드 API 호출하여 프로필 이미지 업데이트
      const response = await fetchClient('/members/me/profile-image', {
        method: 'PUT',
        body: JSON.stringify({
          profileImage: publicUrl,
          size: file.size,
          mimeType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('프로필 이미지 업데이트 실패');
      }

      const { profileImage } = await response.json();
      updateProfileImage(profileImage);
      
      // 프로필 데이터 즉시 업데이트
      if (profile) {
        profile.profileImage = profileImage;
      }
      
      alert('프로필 이미지가 업데이트되었습니다.');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('프로필 이미지 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdatingProfileImage(false);
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = async (file: File) => {
    setSelectedImage(file);
    setIsProfileImageModalOpen(false);
    await handleProfileImageUpload(file);
  };

  const handleNicknameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNickname.trim()) {
      setNicknameMessage({ type: 'error', text: '닉네임을 입력해주세요.' });
      return;
    }

    setIsUpdatingNickname(true);
    setNicknameMessage({ type: 'info', text: '닉네임을 변경하는 중입니다...' });

    try {
      const response = await fetchClient('/members/me/nickname', {
        method: 'PUT',
        body: JSON.stringify({ nickname: newNickname })
      });

      const { nickname } = await response.json();

      if (nickname) {
        updateNickname(nickname);
        // React Query 캐시 무효화
        await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        setNicknameMessage({ type: 'success', text: '닉네임이 성공적으로 변경되었습니다.' });
        
        // 3초 후에 편집 모드 종료
        setTimeout(() => {
          setIsNicknameEditing(false);
          setNewNickname('');
          setNicknameMessage(null);
        }, 2000);
      } else {
        throw new Error('닉네임 변경에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setNicknameMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUpdatingNickname(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-700">마이페이지</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md relative group cursor-pointer"
                  onClick={() => setIsProfileImageModalOpen(true)}
                >
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt="프로필 이미지"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                      // LCP(Largest Contentful Paint) 요소이므로 우선 로드
                      priority
                      // 이미지 크기 지정으로 브라우저가 적절한 크기 선택
                      sizes="160px"
                      // 즉시 로드하여 LCP 성능 향상
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <User className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => document.getElementById('profile-image-input')?.click()}
                  disabled={isUpdatingProfileImage}
                  className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  {isUpdatingProfileImage ? '업로드 중...' : '프로필 이미지 변경'}
                </button>
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await handleProfileImageChange(file);
                  }}
                />
              </div>

              {/* 프로필 정보 */}
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <p className="mt-1 text-gray-700">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이름</label>
                    <p className="mt-1 text-gray-700">{profile.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">닉네임</label>
                    {isNicknameEditing ? (
                      <form onSubmit={handleNicknameChange} className="mt-1 flex items-center space-x-2 text-gray-700">
                        <input
                          type="text"
                          value={newNickname}
                          onChange={(e) => setNewNickname(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="새 닉네임을 입력하세요"
                          disabled={isUpdatingNickname}
                        />
                        <button
                          type="submit"
                          disabled={isUpdatingNickname}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {isUpdatingNickname ? '변경 중...' : '변경'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsNicknameEditing(false);
                            setNewNickname('');
                            setNicknameMessage(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          취소
                        </button>
                      </form>
                    ) : (
                      <div className="mt-1 flex items-center space-x-2">
                        <p className="text-gray-700">{profile.nickname}</p>
                        <button
                          onClick={() => {
                            setNewNickname(profile.nickname);
                            setIsNicknameEditing(true);
                          }}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {nicknameMessage && (
                      <p className={`mt-1 text-sm ${
                        nicknameMessage.type === 'error' ? 'text-red-600' : 
                        nicknameMessage.type === 'success' ? 'text-green-600' :
                        'text-blue-600'
                      }`}>
                        {nicknameMessage.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* 비밀번호 변경 섹션 */}
            {!profile.isSocialMember && (
              <div className="bg-white shadow rounded-lg p-6 mb-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-700">비밀번호 변경</h2>
                  <button
                    onClick={() => setIsPasswordChangeOpen(!isPasswordChangeOpen)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    {isPasswordChangeOpen ? '취소' : '비밀번호 변경'}
                  </button>
                </div>

                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isPasswordChangeOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <form onSubmit={handlePasswordChange} className="space-y-4 pt-4">
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
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
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
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
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
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
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
                </div>
              </div>
            )}

            {/* 회원 탈퇴 섹션 */}
            <div className="bg-white shadow rounded-lg p-6 mt-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-700">회원 탈퇴</h2>
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
                  <h3 className="text-lg font-medium text-gray-700">회원 탈퇴</h3>
                  <p className="text-sm text-red-600">
                    회원 탈퇴 시 모든 개인정보가 삭제되며, 이 작업은 되돌릴 수 없습니다.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">탈퇴 사유 *</label>
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
                    <label className="block text-sm font-medium text-gray-700">상세 사유 (선택사항)</label>
                    <textarea
                      value={withdrawDetail}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWithdrawDetail(e.target.value)}
                      placeholder="상세 사유를 입력해주세요"
                      rows={3}
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

          {/* 프로필 이미지 모달 */}
          {isProfileImageModalOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setIsProfileImageModalOpen(false)}
            >
              <div 
                className="relative max-w-2xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsProfileImageModalOpen(false)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="relative aspect-square w-full">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt="프로필 이미지"
                      fill
                      className="object-contain"
                      // 모달은 사용자가 클릭하기 전까지 보이지 않으므로 지연 로딩
                      // Next.js의 기본 동작인 지연 로딩 사용
                      // 초기 페이지 로드 시 불필요한 리소스 낭비 방지
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-32 h-32 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 