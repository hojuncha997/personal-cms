/**
 * 프로젝트 공통 테마 설정
 * 
 * 이 파일은 앱 전체에서 사용되는 색상, 버튼, 입력 필드 등의 공통 스타일을 정의.
 * 앱의 디자인을 변경하고 싶다면 이 파일만 수정 .
 * 
 * 현재 테마: Black and White (흑백 테마)
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
    /** 기본 색상 (검은색) */
    primary: '#000000',
    /** 보조 색상 (흰색) */
    secondary: '#ffffff',
    background: {
      /** 라이트 모드 배경색 */
      light: '#ffffff',
      /** 다크 모드 배경색 */
      dark: '#000000',
    },
    text: {
      /** 라이트 모드 텍스트 색상 */
      light: '#000000',
      /** 다크 모드 텍스트 색상 */
      dark: '#ffffff',
    },
    gray: {
      /** 아주 밝은 회색 (거의 흰색) */
      100: '#f5f5f5',
      /** 밝은 회색 */
      200: '#e5e5e5',
      /** 중간 밝은 회색 */
      300: '#d4d4d4',
      /** 중간 회색 */
      400: '#a3a3a3',
      /** 회색 */
      500: '#737373',
      /** 중간 어두운 회색 */
      600: '#525252',
      /** 어두운 회색 */
      700: '#404040',
      /** 매우 어두운 회색 */
      800: '#262626',
      /** 거의 검은색 */
      900: '#171717',
    },
    border: {
      /** 라이트 모드 테두리 색상 */
      light: '#000000',
      /** 다크 모드 테두리 색상 */
      dark: '#000000',
    },
  },
  button: {
    primary: {
      /** 기본 버튼 배경색 */
      bg: 'bg-black',
      /** 기본 버튼 텍스트 색상 */
      text: 'text-white',
      /** 기본 버튼 호버 상태 */
      hover: 'hover:bg-gray-800',
      /** 기본 버튼 활성화 상태 */
      active: 'active:bg-gray-900',
      /** 기본 버튼 비활성화 상태 */
      disabled: 'bg-gray-300',
    },
    secondary: {
      /** 보조 버튼 배경색 */
      bg: 'bg-white',
      /** 보조 버튼 텍스트 색상 */
      text: 'text-black',
      /** 보조 버튼 호버 상태 */
      hover: 'hover:bg-gray-100',
      /** 보조 버튼 활성화 상태 */
      active: 'active:bg-gray-200',
      /** 보조 버튼 테두리 */
      border: 'border border-black',
    },
  },
  input: {
    /** 입력 필드 배경색 */
    bg: 'bg-white',
    /** 입력 필드 텍스트 색상 */
    text: 'text-black',
    /** 입력 필드 테두리 색상 */
    border: 'border-black',
    /** 입력 필드 포커스 상태 */
    focus: 'focus:ring-2 focus:ring-black focus:border-transparent',
  },
  card: {
    /** 카드 배경색 */
    bg: 'bg-white',
    /** 카드 테두리 */
    border: 'border border-black',
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