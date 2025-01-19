import { useState } from 'react'
import { useLogin, LoginError } from '@hooks/auth/useLogin'
import { useAuthStore } from "@/store/useAuthStore"
import { useLogout } from "@hooks/auth/useLogout"
import { AlertCircle } from 'lucide-react'
import useSocialSignUp from '@/hooks/auth/useSocialSignup';
import { SOCIAL_CONFIG } from '@/constants/auth/social-config';
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
      await login({ 
        email: loginForm.email, 
        password: loginForm.password, 
        clientType: 'web', 
        keepLoggedIn: loginForm.keepLoggedIn 
      })
      onClose()
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

  const handleFindPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    // 비밀번호 찾기 로직 구현
    console.log('Find Password')
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

  const renderLoginView = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginForm.error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          <AlertCircle className="w-4 h-4 mr-2" />
          {loginForm.error}
        </div>
      )}
      
      <div className="space-y-2">
        <input
          autoComplete="off"
          placeholder="이메일"
          name="email"
          type="email"
          value={loginForm.email}
          onChange={handleChange}
          className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        />
      </div>
      
      <div className="space-y-2">
        <input
          autoComplete="off"
          placeholder="비밀번호"
          name="password"
          type="password"
          value={loginForm.password}
          onChange={handleChange}
          className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={loginForm.keepLoggedIn}
            onChange={handleKeepLoggedIn}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label onClick={handleKeepLoggedIn} className="ml-2 text-sm text-gray-600">로그인 상태 유지</label>
        </div>
        <div className="text-sm">
          <button
            type="button"
            onClick={() => updateLoginForm({ view: 'findPassword' })}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isPending || loginForm.isLocalLoading}
        className={`w-full py-3 px-4 rounded-lg transition-all duration-200 ${
          (isPending || loginForm.isLocalLoading)
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
        } text-white font-medium`}
      >
        {(isPending || loginForm.isLocalLoading) ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            로그인 중...
          </span>
        ) : (
          '로그인'
        )}
      </button>

      {/* 소셜 로그인 구분선 */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">간편 로그인</span>
        </div>
      </div>

      {/* <div className="grid grid-cols-3 gap-3"> */}
      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => useSocialSignUp('google')}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          {SOCIAL_CONFIG.google.icon}
          <span className="sr-only">Google 로그인</span>
          <span className="ml-2 text-gray-700">Google 로그인</span>
        </button>
      </div>

      <div className="flex items-center justify-between pt-4 text-sm">
        <button
          type="button"
          onClick={() => updateLoginForm({ view: 'findId' })}
          className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          아이디 찾기
        </button>
        <span className="text-gray-500 lg:hidden md:hidden">|</span>
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">계정이 없으신가요?</span>
          <a
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            onClick={handleCloseModal}
          >
            회원가입
          </a>
        </div>
      </div>
    </form>
  )

  const renderFindIdView = () => (
    <form onSubmit={handleFindId} className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        가입 시 등록한 이메일을 입력해 주세요.
      </p>
      <input
        type="email"
        placeholder="이메일"
        className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        required
      />
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
      >
        아이디 찾기
      </button>
      <button
        type="button"
        onClick={() => updateLoginForm({ view: 'login' })}
        className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        로그인으로 돌아가기
      </button>
    </form>
  )

  const renderFindPasswordView = () => (
    <form onSubmit={handleFindPassword} className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        가입한 아이디(이메일)를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
      </p>
      <input
        type="email"
        placeholder="이메일"
        className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        required
      />
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
      >
        비밀번호 재설정 링크 받기
      </button>
      <button
        type="button"
        onClick={() => updateLoginForm({ view: 'login' })}
        className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        로그인으로 돌아가기
      </button>
    </form>
  )

  if (isAuthenticated) {
    return (
      <button
        onClick={handleLogout}
        disabled={loginForm.isLogoutLoading}
        className={`w-full py-3 px-4 rounded-lg transition-all duration-200 ${
          loginForm.isLogoutLoading
            ? 'bg-red-300 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
        } text-white font-medium`}
      >
        {loginForm.isLogoutLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            로그아웃 중...
          </span>
        ) : (
          '로그아웃'
        )}
      </button>
    )
  }

  return (
    <>
      {isOpen && (
        <div className={`fixed inset-0 ${overlayColor} ${overlayOpacity} ${hasBlur ? 'backdrop-blur-sm' : ''} flex items-center justify-center z-50 p-4`}>
          <div className="bg-white rounded-xl w-full max-w-md mx-4 sm:mx-auto shadow-xl transform transition-all duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
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



// import { useState } from 'react'
// import { useLogin, LoginError } from '@hooks/auth/useLogin'
// import { useAuthStore } from "@/store/useAuthStore"
// import { useLogout } from "@hooks/auth/useLogout"
// import { AlertCircle } from 'lucide-react'
// import useSocialSignUp from '@/hooks/auth/useSocialSignup';
// import { SOCIAL_CONFIG } from '@/constants/auth/social-config';
// interface LoginModalProps {
//   isOpen: boolean
//   onClose: () => void
//   hasBlur?: boolean // 드롭백에 블러 처리 여부
//   overlayColor?: string // 오버레이 색상 커스터마이징
//   overlayOpacity?: string // 오버레이 투명도 커스터마이징 예를 들면, 'bg-opacity-50'
// }

// export default function LoginModal({ 
//   isOpen, 
//   onClose, 
//   hasBlur = false,
//   overlayColor = 'bg-black',
//   overlayOpacity = 'bg-opacity-50'
// }: LoginModalProps) {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [keepLoggedIn, setKeepLoggedIn] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const { mutateAsync: login, isPending } = useLogin()
//   const [isLocalLoading, setIsLocalLoading] = useState(false)
//   const [view, setView] = useState<'login' | 'findId' | 'findPassword'>('login')
//   const [isLogoutLoading, setIsLogoutLoading] = useState(false);
//   const { mutateAsync: logoutMutation } = useLogout();

//   const isAuthenticated = useAuthStore(state => state.isAuthenticated)

//   // if (!isOpen) return null

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setIsLocalLoading(true)
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000))
//       await login({ email, password, clientType: 'web', keepLoggedIn })
//       onClose()
//     } catch (error) {
//       if (error instanceof LoginError) {
//         setError(error.message)
//       } else {
//         setError('알 수 없는 오류가 발생했습니다.')
//       }
//     } finally {
//       setIsLocalLoading(false)
//     }
//   }

//   const handleFindId = async (e: React.FormEvent) => {
//     e.preventDefault()
//     // ID 찾기 로직 구현
//     console.log('Find ID')
//   }

//   const handleFindPassword = async (e: React.FormEvent) => {
//     e.preventDefault()
//     // 비밀번호 찾기 로직 구현
//     console.log('Find Password')
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setError(null)
//     if (name === 'email') {
//       setEmail(value)
//     } else if (name === 'password') {
//       setPassword(value)
//     }
//   }

//   const handleCloseModal = () => {
//     setEmail('')
//     setPassword('')
//     setError(null)
//     setView('login')
//     onClose()
//   }

//   const handleKeepLoggedIn = () => {
//     setKeepLoggedIn(!keepLoggedIn)
//   }

//   const handleLogout = async () => {
//     try {
//       setIsLogoutLoading(true);
//       // 먼저 상태를 초기화
//       setEmail('');
//       setPassword('');
//       setError(null);
//       setKeepLoggedIn(false);
//       setView('login');
      
//       // 그 다음 로그아웃 실행
//       await logoutMutation();
//       // handleCloseModal은 제거 (이미 상태 초기화했으므로)
      
//       alert('로그아웃이 완료되었습니다.');
//     } catch (error) {
//       alert('로그아웃 중 오류가 발생했습니다.');
//     } finally {
//       setIsLogoutLoading(false);
//     }
//   };

//   // const handleLogout = async () => {
//   //   try {
//   //     setIsLogoutLoading(true);
//   //     await logoutMutation();
//   //     handleCloseModal()
      
//   //     // 상태 초기화
//   //     setEmail('');
//   //     setPassword('');
//   //     setError(null);
//   //     setKeepLoggedIn(false);
      
//   //     // 성공 모달 표시
//   //     alert('로그아웃이 완료되었습니다.');
//   //   } catch (error) {
//   //     alert('로그아웃 중 오류가 발생했습니다.');
//   //   } finally {
//   //     setIsLogoutLoading(false);
//   //   }
//   // };

//   const renderLoginView = () => (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {error && (
//         <div className="flex items-center p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
//           <AlertCircle className="w-4 h-4 mr-2" />
//           {error}
//         </div>
//       )}
      
//       <div className="space-y-2">
//         <input
//           autoComplete="off"
//           placeholder="이메일"
//           name="email"
//           type="email"
//           value={email}
//           onChange={handleChange}
//           className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//           required
//         />
//       </div>
      
//       <div className="space-y-2">
//         <input
//           autoComplete="off"
//           placeholder="비밀번호"
//           name="password"
//           type="password"
//           value={password}
//           onChange={handleChange}
//           className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//           required
//         />
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             checked={keepLoggedIn}
//             onChange={handleKeepLoggedIn}
//             className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label onClick={handleKeepLoggedIn} className="ml-2 text-sm text-gray-600">로그인 상태 유지</label>
//         </div>
//         <div className="text-sm">
//           <button
//             type="button"
//             onClick={() => setView('findPassword')}
//             className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
//           >
//             비밀번호 찾기
//           </button>
//         </div>
//       </div>
      
//       <button
//         type="submit"
//         disabled={isPending || isLocalLoading}
//         className={`w-full py-3 px-4 rounded-lg transition-all duration-200 ${
//           (isPending || isLocalLoading)
//             ? 'bg-blue-300 cursor-not-allowed' 
//             : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
//         } text-white font-medium`}
//       >
//         {(isPending || isLocalLoading) ? (
//           <span className="flex items-center justify-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             로그인 중...
//           </span>
//         ) : (
//           '로그인'
//         )}
//       </button>

      
//       <div className="relative py-1">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-200"></div>
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="px-2 bg-white text-gray-500">간편 로그인</span>
//         </div>
//       </div>

//       {/* <div className="grid grid-cols-3 gap-3"> */}
//       <div className="grid grid-cols-1 gap-3">

//         <button
//           type="button"
//           onClick={() => useSocialSignUp('google')}
//           className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200"
//         >
//           {SOCIAL_CONFIG.google.icon}
//           <span className="sr-only">Google 로그인</span>
//           <span className="ml-2 text-gray-700">Google 로그인</span>
//         </button>
//         {/* <button
//           type="button"
//           onClick={() => console.log('Kakao login')}
//           className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-[#FEE500] hover:bg-[#FEE500]/90 transition-colors duration-200"
//         >
//           <img src="/kakao-icon.svg" alt="Kakao" className="w-6 h-6" />
//           <span className="sr-only">카카오 로그인</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => console.log('Naver login')}
//           className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-[#03C75A] hover:bg-[#03C75A]/90 transition-colors duration-200"
//         >
//           <img src="/naver-icon.svg" alt="Naver" className="w-6 h-6" />
//           <span className="sr-only">네이버 로그인</span>
//         </button> */}
//       </div>

//       <div className="flex items-center justify-between pt-4 text-sm">
//         <button
//           type="button"
//           onClick={() => setView('findId')}
//           className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
//         >
//           아이디 찾기
//         </button>
//         <span className="text-gray-500 lg:hidden md:hidden">|</span>
//         <div className="flex items-center space-x-1">
//           <span className="text-gray-500">계정이 없으신가요?</span>
//           <a
//             href="/auth/signup"
//             className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
//             onClick={handleCloseModal}
//           >
//             회원가입
//           </a>
//         </div>
//       </div>
//     </form>
//   )

//   const renderFindIdView = () => (
//     <form onSubmit={handleFindId} className="space-y-4">
//       <p className="text-sm text-gray-600 mb-4">
//         가입 시 등록한 이메일을 입력해 주세요.
//       </p>
//       <input
//         type="email"
//         placeholder="이메일"
//         className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//         required
//       />
//       <button
//         type="submit"
//         className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
//       >
//         아이디 찾기
//       </button>
//       <button
//         type="button"
//         onClick={() => setView('login')}
//         className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
//       >
//         로그인으로 돌아가기
//       </button>
//     </form>
//   )

//   const renderFindPasswordView = () => (
//     <form onSubmit={handleFindPassword} className="space-y-4">
//       <p className="text-sm text-gray-600 mb-4">
//         가입한 아이디(이메일)를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
//       </p>
//       <input
//         type="email"
//         placeholder="이메일"
//         className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//         required
//       />
//       <button
//         type="submit"
//         className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
//       >
//         비밀번호 재설정 링크 받기
//       </button>
//       <button
//         type="button"
//         onClick={() => setView('login')}
//         className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
//       >
//         로그인으로 돌아가기
//       </button>
//     </form>
//   )

//   return (
//     <>
//       {isOpen && (
//     <div className={`fixed inset-0 ${overlayColor} ${overlayOpacity} ${hasBlur ? 'backdrop-blur-sm' : ''} flex items-center justify-center z-50 p-4`}>
//       <div className="bg-white rounded-xl w-full max-w-md mx-4 sm:mx-auto shadow-xl transform transition-all duration-300">
//         <div className="p-6 sm:p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               {view === 'login' && '로그인'}
//               {view === 'findId' && '아이디 찾기'}
//               {view === 'findPassword' && '비밀번호 찾기'}
//             </h2>
//             <button 
//               onClick={handleCloseModal}
//               className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {view === 'login' && renderLoginView()}
//           {view === 'findId' && renderFindIdView()}
//           {view === 'findPassword' && renderFindPasswordView()}
//         </div>
//       </div>
//     </div>
//       )}
//     </>
//   )
// }

