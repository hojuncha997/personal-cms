import React from 'react';
import { themeClasses } from '@/styles/theme-classes';

/**
 * Button 컴포넌트
 * 
 * 기본 버튼 컴포넌트로, 프로젝트 전체에서 일관된 디자인을 유지하기 위해 사용.
 * 
 * @example
 * // 기본 버튼
 * <Button>버튼 텍스트</Button>
 * 
 * // 세컨더리 버튼 (흰 배경, 검은색 테두리)
 * <Button variant="secondary">세컨더리 버튼</Button>
 * 
 * // 로딩 상태 버튼
 * <Button isLoading>로딩 중</Button>
 * 
 * // 전체 너비 버튼
 * <Button fullWidth>전체 너비 버튼</Button>
 * 
 * // 커스텀 스타일 버튼
 * <Button className="bg-red-500 hover:bg-red-600 py-2">커스텀 버튼</Button>
 * 
 * // 비활성화 버튼
 * <Button disabled>비활성화 버튼</Button>
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형. 'primary'는 검은 배경, 'secondary'는 흰 배경과 검은 테두리 */
  variant?: 'primary' | 'secondary';
  /** 로딩 상태 표시 여부 */
  isLoading?: boolean;
  /** 버튼을 부모 요소의 너비에 맞게 확장할지 여부 */
  fullWidth?: boolean;
  /** 버튼 내용 */
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClass = 
    variant === 'primary' 
      ? disabled || isLoading 
        ? themeClasses.button.primaryDisabled 
        : themeClasses.button.primary 
      : themeClasses.button.secondary;
  
  return (
    <button
      className={`py-3 px-4 rounded-lg ${baseClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {typeof children === 'string' ? '처리중...' : children}
        </span>
      ) : (
        children
      )}
    </button>
  );
} 