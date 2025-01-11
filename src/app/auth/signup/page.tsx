'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

type SocialProvider = 'google' | 'kakao' | 'naver';

interface TermsType {
  id: 'service' | 'privacy' | 'age' | 'marketing';
  title: string;
  required: boolean;
  content: string;
}

const TERMS: TermsType[] = [
  {
    id: 'service',
    title: '서비스 이용약관',
    required: true,
    content: `제1조(목적) 이 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조(정의)
1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.
2. "회원"이라 함은 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.

제3조(약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
2. 회사는 약관의 규제에 관한 법률 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.`
  },
  {
    id: 'privacy',
    title: '개인정보 수집 및 이용',
    required: true,
    content: `1. 수집하는 개인정보의 항목
- 필수항목: 이메일 주소, 비밀번호, 이름
- 선택항목: 프로필 이미지, 마케팅 수신 동의 여부

2. 수집 및 이용목적
- 서비스 제공 및 회원관리
- 신규 서비스 개발 및 마케팅에 활용
- 고객 상담 및 불만처리

3. 보유 및 이용기간
회원탈퇴 시까지 (단, 관계법령에 따라 보존할 필요가 있는 경우 해당 기간까지 보존)`
  },
  {
    id: 'age',
    title: '만 14세 이상 확인',
    required: true,
    content: '회원가입을 위해서는 만 14세 이상이어야 합니다.'
  },
  {
    id: 'marketing',
    title: '마케팅 정보 수신',
    required: false,
    content: `마케팅 정보 수신에 동의하시면 다음과 같은 정보를 받으실 수 있습니다.

1. 혜택 알림
- 이벤트 및 프로모션 정보
- 신규 서비스 소식
- 할인 쿠폰 지급

2. 수신 방법
- 이메일
- 앱 푸시 알림

언제든지 마케팅 수신 동의를 취소하실 수 있습니다.`
  }
];

const SOCIAL_CONFIG = {
  google: {
    color: 'bg-white hover:bg-gray-50',
    textColor: 'text-gray-700',
    border: 'border-gray-300',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    )
  },
  kakao: {
    color: 'bg-[#FEE500] hover:bg-[#FDD800]',
    textColor: 'text-[#000000]',
    border: 'border-transparent',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.48 3 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm4.01 14.23l-1.79-2.44c-.19-.26-.55-.3-.84-.14l-2.12 1.17c-.23.13-.52.07-.67-.14L8.6 13.46c-.15-.21-.44-.27-.67-.14l-2.12 1.17c-.29.16-.65.12-.84-.14l-1.79-2.44c-.19-.26-.1-.62.19-.76l8.47-4.15c.29-.14.63-.14.92 0l8.47 4.15c.29.14.38.5.19.76z"/>
      </svg>
    )
  },
  naver: {
    color: 'bg-[#03C75A] hover:bg-[#02b351]',
    textColor: 'text-white',
    border: 'border-transparent',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.273 12.845L7.376 0H0v24h7.726V11.155L16.624 24H24V0h-7.727z"/>
      </svg>
    )
  }
};

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: ''
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
    if (!formData.name) {
      validationErrors.name = '이름을 입력해주세요.';
    }

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
      setErrors({});

      // TODO: API 연동
      const signUpData = {
        ...formData,
        marketingAgreed: termsAgreements.marketing
      };
      
      console.log('Sign up data:', signUpData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      router.push('/signup/complete'); // 또는 로그인 페이지로 이동
    } catch (error) {
      console.error('Sign up failed:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' 
      }));
    } finally {
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
          <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
          <p className="mt-2 text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              로그인하기
            </button>
          </p>
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
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="비밀번호를 한번 더 입력해주세요"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 이름 입력 */}
          <div>
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
          </div>

          {/* 전화번호 입력 */}
          <div>
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
          </div>

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