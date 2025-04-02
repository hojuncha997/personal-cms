import React, { forwardRef } from 'react';
import { themeClasses } from '@/styles/theme-classes';

/**
 * Input 컴포넌트
 * 
 * 기본 입력 필드 컴포넌트로, 프로젝트 전체에서 일관된 디자인을 유지하기 위해 사용.
 * 모든 표준 HTML input 속성을 지원.
 * 
 * @example
 * // 기본 입력 필드
 * <Input placeholder="이메일 입력" />
 * 
 * // 라벨이 있는 입력 필드
 * <Input label="이메일" placeholder="이메일 입력" />
 * 
 * // 오류 메시지가 있는 입력 필드
 * <Input error="이메일 형식이 올바르지 않습니다" />
 * 
 * // 특정 타입의 입력 필드
 * <Input type="password" placeholder="비밀번호" />
 * <Input type="number" min={0} max={100} />
 * 
 * // 커스텀 스타일 입력 필드
 * <Input className="bg-gray-100 text-lg" />
 * 
 * // ref 사용 
 * const inputRef = useRef<HTMLInputElement>(null);
 * <Input ref={inputRef} />
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 입력 필드 위에 표시할 라벨 텍스트 */
  label?: string;
  /** 입력 필드 아래에 표시할 오류 메시지 */
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-black">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${themeClasses.input} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

/**
 * displayName 속성을 설정해주는 이유:
 * 1. forwardRef를 사용한 컴포넌트는 익명 함수로 처리되어 React DevTools에서 컴포넌트 이름이 표시되지 않음.
 * 2. ESLint의 react/display-name 규칙을 준수하기 위해 필요.
 * 3. 디버깅 및 에러 메시지에서 컴포넌트 식별을 용이하게 함.
 * 4. Vercel 빌드 과정에서 ESLint 오류를 방지.
 */
Input.displayName = 'Input'; 