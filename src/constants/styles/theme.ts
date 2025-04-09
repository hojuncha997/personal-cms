/**
 * 프로젝트 공통 테마 설정
 * 
 * 이 파일은 앱 전체에서 사용되는 색상, 버튼, 입력 필드 등의 공통 스타일을 정의.
 * 앱의 디자인을 변경하고 싶다면 이 파일만 수정 .
 * 
 * 현재 테마: Gray and White (회색과 흰색 테마)
 * 
 * CSS 변수 기반 테마 시스템을 사용.
 * 전역 CSS에 정의된 CSS 변수를 참조하여 런타임에도 테마 변경 가능.
 * 
 * @example
 * // 컴포넌트에서 테마 색상 직접 사용
 * import { theme } from '@/constants/styles/theme';
 * 
 * function MyComponent() {
 *   return (
 *     <div style={{ backgroundColor: theme.colors.background.light }}>
 *       <p style={{ color: theme.colors.text.light }}>텍스트</p>
 *     </div>
 *   );
 * }
 */
export const theme = {
  colors: {
    /** 기본 색상 (회색) */
    primary: 'var(--color-primary)',
    /** 보조 색상 (흰색) */
    secondary: 'var(--color-secondary)',
    background: {
      /** 라이트 모드 배경색 */
      light: 'var(--color-bg-light)',
      /** 다크 모드 배경색 */
      dark: 'var(--color-bg-dark)',
    },
    text: {
      /** 라이트 모드 텍스트 색상 */
      light: 'var(--color-text-light)',
      /** 다크 모드 텍스트 색상 */
      dark: 'var(--color-text-dark)',
    },
    gray: {
      /** 아주 밝은 회색 (거의 흰색) */
      100: 'var(--color-gray-100)',
      /** 밝은 회색 */
      200: 'var(--color-gray-200)',
      /** 중간 밝은 회색 */
      300: 'var(--color-gray-300)',
      /** 중간 회색 */
      400: 'var(--color-gray-400)',
      /** 회색 */
      500: 'var(--color-gray-500)',
      /** 중간 어두운 회색 */
      600: 'var(--color-gray-600)',
      /** 어두운 회색 */
      700: 'var(--color-gray-700)',
      /** 매우 어두운 회색 */
      800: 'var(--color-gray-800)',
      /** 거의 검은색 */
      900: 'var(--color-gray-900)',
    },
    border: {
      /** 라이트 모드 테두리 색상 */
      light: 'var(--color-border-light)',
      /** 다크 모드 테두리 색상 */
      dark: 'var(--color-border-dark)',
    },
  },
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
} 