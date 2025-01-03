// LoginModal.tsx
import { useState } from 'react'
import { useLogin, LoginError } from '../auth/useLogin'

interface LoginModalProps {
 isOpen: boolean
 onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [error, setError] = useState<string | null>(null)
 const { mutateAsync: login, isPending } = useLogin()
 const [isLocalLoading, setIsLocalLoading] = useState(false)

 if (!isOpen) return null

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setError(null)
   setIsLocalLoading(true)
   
   try {
     await new Promise(resolve => setTimeout(resolve, 2000))
     await login({ email, password, clientType: 'web' })
     handleCloseModal()
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

// import { useState } from 'react'
// import { useLogin } from '../auth/useLogin'
// interface LoginModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const { mutateAsync: login } = useLogin()
//   if (!isOpen) return null

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000))
//       await login({ email, password, clientType: 'web' })
//       onClose()
//     } catch (error) {
//       console.error('로그인 실패:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }
// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   console.log(e.target.value)
//   if (e.target.name === 'email') {
//     console.log("email", e.target.value)
//     setEmail(e.target.value)
//   } else if (e.target.name === 'password') {
//     console.log("password", e.target.value)
//     setPassword(e.target.value)
//   }
// }




//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-md mx-4 sm:mx-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-700">로그인</h2>
//             <button 
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <span className="text-2xl">&times;</span>
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 이메일
//               </label>
//               <input
//                 name="email"
//                 type="email"
//                 value={email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 비밀번호
//               </label>
//               <input
//                 name="password"
//                 type="password"
//                 value={password}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//                 required
//               />
//             </div>
            
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-2 px-4 rounded transition-colors ${
//                 isLoading 
//                   ? 'bg-blue-300 cursor-not-allowed' 
//                   : 'bg-blue-500 hover:bg-blue-600'
//               } text-white`}
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   로그인 중...
//                 </span>
//               ) : (
//                 '로그인'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// } 