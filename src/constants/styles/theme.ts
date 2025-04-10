/**
 * 프로젝트 공통 테마 설정
 * 
 * 이 파일은 앱 전체에서 사용되는 색상, 버튼, 입력 필드 등의 공통 스타일을 정의.
 * 앱의 디자인을 변경하고 싶다면 이 파일만 수정.
 * 
 * 현재 테마: Gray and White (회색과 흰색 테마)
 * 
 * @example
 * // 컴포넌트에서 테마 사용 예시
 * import { theme } from '@/constants/styles/theme';
 * 
 * function MyComponent() {
 *   return (
 *     <div className="bg-primary">
 *       <button className={`${theme.button.primary.bg} ${theme.button.primary.text}`}>버튼</button>
 *     </div>
 *   );
 * }
 */

// 직접 색상 값을 정의하는 기본 테마 값
export const themeValues = {
  colors: {
    primary: '#374151', // gray-700
    secondary: '#ffffff',
    background: {
      light: '#ffffff',
      dark: '#374151', // gray-700
    },
    text: {
      light: '#374151', // gray-700
      dark: '#ffffff',
    },
    gray: {
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    border: {
      light: '#374151', // gray-700
      dark: '#374151', // gray-700
    },
  }
};

// UI 컴포넌트 스타일 정의
export const theme = {
  colors: themeValues.colors, // 직접 참조 가능하도록 노출
  button: {
    primary: {
      /** 기본 버튼 배경색 */
      bg: 'bg-primary',
      /** 기본 버튼 텍스트 색상 */
      text: 'text-white',
      /** 기본 버튼 호버 상태 */
      hover: 'hover:bg-primary-light',
      /** 기본 버튼 활성화 상태 */
      active: 'active:bg-primary-dark',
      /** 기본 버튼 비활성화 상태 */
      disabled: 'bg-gray-300',
    },
    secondary: {
      /** 보조 버튼 배경색 */
      bg: 'bg-white',
      /** 보조 버튼 텍스트 색상 */
      text: 'text-primary',
      /** 보조 버튼 호버 상태 */
      hover: 'hover:bg-gray-100',
      /** 보조 버튼 활성화 상태 */
      active: 'active:bg-gray-200',
      /** 보조 버튼 테두리 */
      border: 'border border-primary',
    },
  },
  input: {
    /** 입력 필드 배경색 */
    bg: 'bg-white',
    /** 입력 필드 텍스트 색상 */
    text: 'text-primary',
    /** 입력 필드 테두리 색상 */
    border: 'border-primary',
    /** 입력 필드 포커스 상태 */
    focus: 'focus:ring-2 focus:ring-primary focus:border-transparent',
  },
  card: {
    /** 카드 배경색 */
    bg: 'bg-white',
    /** 카드 테두리 */
    border: 'border border-primary',
    /** 카드 호버 상태 */
    hover: 'hover:shadow-lg',
  },
  image: {
    /** 이미지 필터 (흑백) */
    filter: 'grayscale-100',
  },
  skeleton: {
    /** 스켈레톤 배경색 */
    bg: 'bg-gray-200',
    /** 스켈레톤 테두리 색상 */
    border: 'border-gray-300',
    /** 스켈레톤 애니메이션 */
    animation: 'animate-pulse',
  },
}; 