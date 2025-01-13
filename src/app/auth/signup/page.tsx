'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { TERMS } from '@/constants/auth/terms';
import { SOCIAL_CONFIG } from '@/constants/auth/social-config';
import { useLocalSignup } from '@/hooks/auth/useLocalSignup';
import { LocalSignupCredentials } from '@/types/authTypes';
type SocialProvider = 'google' | 'kakao' | 'naver';
// import { useSignupNavigation } from '@/hooks/auth/useSignupNavigation';
import { useSignupStore } from '@/store/useSignupStore';


export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);
  const { mutateAsync: localSignup } = useLocalSignup();
  // const { mutateAsync: localSignup, isPending } = useLocalSignup()

  const { setIsSignupComplete } = useSignupStore();

  // const { handleSignupSuccess } = useSignupNavigation();

 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // name: '',
    // phoneNumber: ''
  });

  const [termsAgreements, setTermsAgreements] = useState({
    service: false,
    privacy: false,
    age: false,
    marketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSocialSignUp = async (provider: SocialProvider) => {
    try {
      setIsLoading(true);
      // TODO: Implement social sign up logic
      console.log(`${provider} sign up clicked`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
    } catch (error) {
      console.error(`${provider} sign up failed:`, error);
      setErrors(prev => ({ ...prev, social: '소셜 로그인 중 오류가 발생했습니다.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const validationErrors: Record<string, string> = {};

    // 이메일 검증
    if (!formData.email) {
      validationErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      validationErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      validationErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이름 검증
    // if (!formData.name) {
    //   validationErrors.name = '이름을 입력해주세요.';
    // }

    // 필수 약관 검증
    const requiredTerms = TERMS.filter(term => term.required);
    const hasAllRequiredTerms = requiredTerms.every(term => 
      termsAgreements[term.id as keyof typeof termsAgreements]
    );

    if (!hasAllRequiredTerms) {
      validationErrors.terms = '필수 약관에 모두 동의해주세요.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이

      setErrors({});

      const signUpData: LocalSignupCredentials = {
        email: formData.email,
        password: formData.password,
        termsAgreed: termsAgreements.service,
        privacyAgreed: termsAgreements.privacy,
        marketingAgreed: termsAgreements.marketing,
        provider: 'email',
      };
      // await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이

      console.log('Sending signup data:', signUpData);
      const result = await localSignup(signUpData);
      if(result.status === 201) {
        // alert('회원가입 완료');
        setIsSignupComplete(true);
        router.replace('/auth/signup/complete');
        // setIsLoading(false); 너무 빨리 호출하여 페이지가 넘어가기 전에 로딩이 끝남.
        // 따라서 false하지 않음으로써 완료 페이지로 이동하기 전까지는 로딩 상태를 유지하도록 함.
      } else if(result.status === 409) {
        setErrors(prev => ({ 
          ...prev, 
          submit: '이미 가입된 이메일입니다.' 
        }));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' 
      }));
      setIsLoading(false);
    }
  };

  const handleAllTermsAgreement = (checked: boolean) => {
    setTermsAgreements(prev => 
      Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: checked
      }), {} as typeof prev)
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl  text-gray-700">회원가입</h2>
          {/* <p className="mt-2 text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              로그인하기
            </button>
          </p> */}
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3">
          {(Object.entries(SOCIAL_CONFIG) as [SocialProvider, typeof SOCIAL_CONFIG.google][]).map(([provider, config]) => (
            <button
              key={provider}
              onClick={() => handleSocialSignUp(provider)}
              disabled={isLoading}
              className={`
                relative w-full flex items-center justify-center px-4 py-2.5
                border ${config.border} rounded-lg
                ${config.color} ${config.textColor}
                font-medium
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-colors duration-200
              `}
            >
              <span className="absolute left-4">{config.icon}</span>
              {provider.charAt(0).toUpperCase() + provider.slice(1)}로 계속하기
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              또는 이메일로 회원가입
            </span>
          </div>
        </div>

        {/* 로컬 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 에러 메시지 */}
          {(errors.submit || errors.social) && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
{errors.submit || errors.social}
            </div>
          )}

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="example@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                  focus:outline-none text-gray-700 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="8자 이상 입력해주세요"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                focus:outline-none text-gray-700 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="비밀번호를 한번 더 입력해주세요"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 이름 입력 */}
          {/* <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="이름을 입력해주세요"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div> */}

          {/* 전화번호 입력 */}
          {/* <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              전화번호
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="010-0000-0000"
            />
          </div> */}

          {/* 약관 동의 */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="all-terms"
                type="checkbox"
                checked={Object.values(termsAgreements).every(Boolean)}
                onChange={(e) => handleAllTermsAgreement(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="all-terms" className="ml-2 block text-sm font-medium text-gray-900">
                전체 동의
              </label>
            </div>

            <div className="pl-6">
              {TERMS.map((term) => (
                <div key={term.id} className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <input
                        id={term.id}
                        type="checkbox"
                        checked={termsAgreements[term.id]}
                        onChange={(e) =>
                          setTermsAgreements({
                            ...termsAgreements,
                            [term.id]: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={term.id} className="ml-2 text-sm text-gray-700">
                        {term.title}
                        {term.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedTermId(expandedTermId === term.id ? null : term.id)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {expandedTermId === term.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {expandedTermId === term.id && (
                    <div className="mt-2 p-4 bg-gray-50 rounded-md text-sm text-gray-600 whitespace-pre-line">
                      {term.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }
              `}
            >
              {isLoading ? '처리중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}