import { useState } from 'react'
import { useLogin, LoginError } from '@hooks/auth/useLogin'
import { useAuthStore } from "@/store/useAuthStore"
import { useLogout } from "@hooks/auth/useLogout"
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import useSocialSignUp from '@/hooks/auth/useSocialSignup';
import { SOCIAL_CONFIG } from '@/constants/auth/social-config';
import Link from 'next/link';
import { colors } from '@/constants/styles';
import useGetPasswordResetToken from '@/hooks/auth/useGetPasswordResetToken';
import { SocialProvider } from '@/types/authTypes';
import { Button, Input } from './ui/index';

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  hasBlur?: boolean // 드롭백에 블러 처리 여부
  overlayColor?: string // 오버레이 색상 커스터마이징
  overlayOpacity?: string // 오버레이 투명도 커스터마이징 예를 들면, 'bg-opacity-50'
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  hasBlur = false,
  overlayColor = 'bg-black',
  overlayOpacity = 'bg-opacity-50'
}: LoginModalProps) {
  const { mutateAsync: login, isPending } = useLogin()
  const { mutateAsync: logoutMutation } = useLogout();
  const { getPasswordResetToken, isPending: isPasswordResetPending } = useGetPasswordResetToken();
  const { signUp: socialSignUp } = useSocialSignUp();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // 스토어에서 상태와 액션 가져오기
  const loginForm = useAuthStore(state => state.loginForm);
  const updateLoginForm = useAuthStore(state => state.updateLoginForm);
  const resetLoginForm = useAuthStore(state => state.resetLoginForm);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateLoginForm({ error: null })
    updateLoginForm({ isLocalLoading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const loginResult = await login({ 
        email: loginForm.email, 
        password: loginForm.password, 
        clientType: 'web', 
        keepLoggedIn: loginForm.keepLoggedIn 
      })
      
      // 상태가 완전히 업데이트될 때까지 기다림
      const state = useAuthStore.getState();
      if (state.isAuthenticated && state.role) {
        onClose();
      }
    } catch (error) {
      if (error instanceof LoginError) {
        updateLoginForm({ error: error.message })
      } else {
        updateLoginForm({ error: '알 수 없는 오류가 발생했습니다.' })
      }
    } finally {
      updateLoginForm({ isLocalLoading: false })
    }
  }

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault()
    // ID 찾기 로직 구현
    console.log('Find ID')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateLoginForm({ error: null })
    updateLoginForm({ [name]: value })
  }

  const handleCloseModal = () => {
    resetLoginForm();
    onClose()
  }

  const handleKeepLoggedIn = () => {
    updateLoginForm({ keepLoggedIn: !loginForm.keepLoggedIn })
  }

  const handleLogout = async () => {
    try {
      updateLoginForm({ isLogoutLoading: true });
      // 먼저 상태를 초기화
      // resetLoginForm();
      
      // 그 다음 로그아웃 실행
      await logoutMutation();
      
      alert('로그아웃이 완료되었습니다.');
    } catch (error) {
      alert('로그아웃 중 오류가 발생했습니다.');
    } finally {
      updateLoginForm({ isLogoutLoading: false });
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      await socialSignUp(provider);
    } catch (error) {
      console.error('Social login failed:', error);
    }
  };

  const renderLoginView = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginForm.error && (
        <div className="flex items-center p-3 bg-red-50 border border-black text-red-600 text-sm rounded">
          <AlertCircle className="w-4 h-4 mr-2" />
          {loginForm.error}
        </div>
      )}
      
      <Input
        autoComplete="off"
        placeholder="이메일"
        name="email"
        type="email"
        value={loginForm.email}
        onChange={handleChange}
        required
      />
      
      <div className="space-y-2">
        <div className="relative">
          <Input
            autoComplete="off"
            placeholder="비밀번호"
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginForm.password}
            onChange={handleChange}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={loginForm.keepLoggedIn}
            onChange={handleKeepLoggedIn}
            className="w-4 h-4 text-black border-black rounded focus:ring-black"
          />
          <label onClick={handleKeepLoggedIn} className="ml-2 text-sm text-black">로그인 상태 유지</label>
        </div>
        <div className="text-sm">
          <button
            type="button"
            onClick={() => updateLoginForm({ view: 'findPassword' })}
            className="text-black hover:text-gray-800 font-medium transition-colors duration-200"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
      
      <Button
        type="submit"
        isLoading={isPending || loginForm.isLocalLoading}
        disabled={isPending || loginForm.isLocalLoading}
        fullWidth
      >
        로그인
      </Button>

      <div className="flex items-center justify-between my-4">
        <div className="flex-1 border-t border-black"></div>
        <div className="px-3 text-sm text-black">또는</div>
        <div className="flex-1 border-t border-black"></div>
      </div>

      <div className="space-y-3">
        {/* 소셜 로그인 버튼 */}
        {Object.entries(SOCIAL_CONFIG).map(([provider, config]) => (
          <button
            key={provider}
            type="button"
            onClick={() => handleSocialLogin(provider as SocialProvider)}
            className={`w-full flex items-center justify-center py-3 px-4 border ${config.border} rounded-lg ${config.color} ${config.textColor} font-medium transition-all duration-200 `}
          >
            <span className="mr-3">{config.icon}</span>
            Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </button>
        ))}
      </div>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">계정이 없으신가요? </span>
        <Link 
          href="/auth/signup" 
          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          onClick={handleCloseModal}
        >
          회원가입하기
        </Link>
      </div>
    </form>
  )

  const renderFindIdView = () => (
    <form onSubmit={handleFindId} className="space-y-4">
      <p className="text-sm text-black mb-4">
        가입 시 등록한 이메일을 입력해 주세요.
      </p>
      <Input
        type="email"
        placeholder="이메일"
        required
      />
      <Button type="submit" fullWidth>
        아이디 찾기
      </Button>
      <Button 
        type="button" 
        variant="secondary"
        onClick={() => updateLoginForm({ view: 'login' })}
        fullWidth
      >
        로그인으로 돌아가기
      </Button>
    </form>
  )

  const renderFindPasswordView = () => {
    const handleFindPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);
      
      try {
        await getPasswordResetToken(
          { email },
          {
            onSuccess: (data) => {
              setMessage({ type: 'success', text: data.message });
            },
            onError: (error) => {
              setMessage({ type: 'error', text: error.message });
            }
          }
        );
      } catch (error) {
        setMessage({ type: 'error', text: '비밀번호 재설정 요청 중 오류가 발생했습니다.' });
      }
    };

    return (
      <form onSubmit={handleFindPassword} className="space-y-4">
        <p className="text-sm text-black mb-4">
          가입한 아이디(이메일)를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>
        
        {message && (
          <div className={`flex items-center p-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          } border border-black text-sm rounded`}>
            <AlertCircle className="w-4 h-4 mr-2" />
            {message.text}
          </div>
        )}

        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          isLoading={isPasswordResetPending}
          disabled={isPasswordResetPending}
          fullWidth
        >
          비밀번호 재설정 링크 받기
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => updateLoginForm({ view: 'login' })}
          fullWidth
        >
          로그인으로 돌아가기
        </Button>
      </form>
    );
  };

  return (
    <>
      {isOpen && (
        <div className={`fixed inset-0 ${overlayColor} ${overlayOpacity} ${hasBlur ? 'backdrop-blur-sm' : ''} flex items-center justify-center z-50 p-4`}>
          <div className={`bg-white rounded-xl w-full max-w-md mx-4 sm:mx-auto shadow-xl transform transition-all duration-300 border-[1px] border-black`}>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">
                  {loginForm.view === 'login' && '로그인'}
                  {loginForm.view === 'findId' && '아이디 찾기'}
                  {loginForm.view === 'findPassword' && '비밀번호 찾기'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loginForm.view === 'login' && renderLoginView()}
              {loginForm.view === 'findId' && renderFindIdView()}
              {loginForm.view === 'findPassword' && renderFindPasswordView()}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

