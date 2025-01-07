// LoginModal.tsx
import { useState } from 'react'
import { useLogin, LoginError } from '../auth/useLogin'
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/auth/useLogout";

interface LoginModalProps {
 isOpen: boolean
 onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [keepLoggedIn, setKeepLoggedIn] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const { mutateAsync: login, isPending } = useLogin()
 const [isLocalLoading, setIsLocalLoading] = useState(false)

 const accessToken = useAuthStore(state => state.accessToken);
 const { mutate: logout } = useLogout();

 if (!isOpen) return null

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setError(null)
   setIsLocalLoading(true)
   console.log(keepLoggedIn)
   try {
     await new Promise(resolve => setTimeout(resolve, 2000))
     await login({ email, password, clientType: 'web', keepLoggedIn })
     onClose()
   } catch (error) {
     if (error instanceof LoginError) {
       setError(error.message)
     } else {
       setError('알 수 없는 오류가 발생했습니다.')
     }
   } finally {
     setIsLocalLoading(false)
   }
 }

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target
   setError(null) // 입력 값이 변경될 때마다 에러 메시지 초기화
   if (name === 'email') {
     setEmail(value)
   } else if (name === 'password') {
     setPassword(value)
   }
 }

 const handleCloseModal = () => {
   setEmail('')
   setPassword('')
   setError(null)
   onClose()
 }

 const handleKeepLoggedIn = () => {
   setKeepLoggedIn(!keepLoggedIn)
 }

 const handleLogout = () => {
   logout();
 };

 // 로그인 상태에 따라 다른 버튼 표시
 if (accessToken) {
   return (
     <button
       onClick={handleLogout}
       className="px-4 py-2 bg-red-500 text-white rounded"
       disabled={isLocalLoading}
     >
       {isLocalLoading ? '처리중...' : '로그아웃'}
     </button>
   );
 }

 return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
     <div className="bg-white rounded-lg w-full max-w-md mx-4 sm:mx-auto">
       <div className="p-6">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-gray-700">로그인</h2>
           <button 
             onClick={handleCloseModal}
             className="text-gray-500 hover:text-gray-700"
           >
             <span className="text-2xl">&times;</span>
           </button>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
           {error && (
             <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
               {error}
             </div>
           )}
           
           <div>
             {/* <label className="block text-gray-700 text-sm font-bold mb-2">
               이메일
             </label> */}
             <input
               placeholder="email"
               name="email"
               type="email"
               value={email}
               onChange={handleChange}
               className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
               required
             />
           </div>
           
           <div>
             {/* <label className="block text-gray-700 text-sm font-bold mb-2">
               비밀번호
             </label> */}
             <input
               placeholder="password"
               name="password"
               type="password"
               value={password}
               onChange={handleChange}
               className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
               required
             />
           </div>
           <div>
            <input type="checkbox" checked={keepLoggedIn} onChange={handleKeepLoggedIn} className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label className="text-gray-700 text-sm font-bold mb-2">로그인 상태 유지</label>
           </div>
           
           <button
             type="submit"
             disabled={isPending || isLocalLoading}
             className={`w-full py-2 px-4 rounded transition-colors ${
               (isPending || isLocalLoading)
                 ? 'bg-blue-300 cursor-not-allowed' 
                 : 'bg-blue-500 hover:bg-blue-600'
             } text-white`}
           >
             {(isPending || isLocalLoading) ? (
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
         </form>
       </div>
     </div>
   </div>
 )
} 