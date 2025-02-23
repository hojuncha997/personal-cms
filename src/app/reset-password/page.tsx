'use client';

import React, { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layouts/Container';
import { validatePassword, PASSWORD_POLICY } from '@/constants/auth/password-policy';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/validate-password-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setValidationStatus('error');
        setMessage({ type: 'error', text: data.message || "유효하지 않은 토큰입니다." });
        setTimeout(() => {
          router.push('/');
        }, 3000);
        return;
      }

      setValidationStatus('success');
      setMessage({ type: 'success', text: "비밀번호를 재설정해주세요." });
      
    } catch (error) {
      const apiError = error as ApiError;
      setValidationStatus('error');
      setMessage({ type: 'error', text: apiError.message || '알 수 없는 오류가 발생했습니다.' });
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '비밀번호 재설정에 실패했습니다.');
      }

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
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={PASSWORD_POLICY.MIN_LENGTH}
                  maxLength={PASSWORD_POLICY.MAX_LENGTH}
                />
                <p className="mt-1 text-xs text-gray-500">
                  비밀번호는 8~128자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다.
                </p>
              </div>
              <div>
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={PASSWORD_POLICY.MIN_LENGTH}
                  maxLength={PASSWORD_POLICY.MAX_LENGTH}
                />
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