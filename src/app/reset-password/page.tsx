'use client';

import React, { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layouts/Container';
import { validatePassword, PASSWORD_POLICY } from '@/constants/auth/password-policy';
import { publicFetch } from '@/lib/publicFetch';
import { Eye, EyeOff } from 'lucide-react';

interface ApiError {
  response: {
    status: number;
  };
  code: string;
  message: string;
}

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [validationStatus, setValidationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | string>('비밀번호 재설정 토큰을 확인하는 중입니다...');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const token = searchParams.get('token');
  
  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }

    validateToken(token);
  }, [token, router]);

  const validateToken = useCallback(async (token: string) => {
    try {
      const data = await publicFetch('/members/validate-password-reset-token', {
        method: 'POST',
        body: JSON.stringify({ token })
      });

      setValidationStatus('success');
      setMessage({ type: 'success', text: "비밀번호를 재설정해주세요." });
      
    } catch (error) {
      setValidationStatus('error');
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage({ type: 'error', text: passwordError });
      return;
    }
    
    if (password !== passwordConfirm) {
      setMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    setIsResetting(true);
    try {
      await publicFetch('/members/reset-password', {
        method: 'POST',
        body: JSON.stringify({ 
          token,
          newPassword: password 
        })
      });

      setValidationStatus('success');
      setMessage({ type: 'success', text: '비밀번호가 성공적으로 재설정되었습니다.' });
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
    } finally {
      setIsResetting(false);
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return (
    <div className='h-screen w-full bg-white'>
      <Container>
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='text-2xl font-bold text-gray-700'>로딩중...</h1>
        </div>
      </Container>
    </div>
  );

  return (
    <div className='bg-white'>
      <Container>
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
          <h1 className='text-2xl font-bold text-gray-700 mb-4'>비밀번호 재설정</h1>
          
          {typeof message === 'string' ? (
            <p className='text-sm text-gray-500'>{message}</p>
          ) : (
            <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message.text}
            </p>
          )}
          
          {validationStatus === 'success' ? (
            <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="새 비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={PASSWORD_POLICY.MIN_LENGTH}
                    maxLength={PASSWORD_POLICY.MAX_LENGTH}
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
                <p className="mt-1 text-xs text-gray-500">
                  비밀번호는 8~128자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다.
                </p>
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="새 비밀번호 확인"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={PASSWORD_POLICY.MIN_LENGTH}
                    maxLength={PASSWORD_POLICY.MAX_LENGTH}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isResetting}
                className={`w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isResetting
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                } text-white font-medium`}
              >
                {isResetting ? '처리중...' : '비밀번호 재설정'}
              </button>
            </form>
          ) : (
            <p className='text-sm text-gray-500'>
              {typeof message === 'string' ? message : message.text}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}

const ResetPassword: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;