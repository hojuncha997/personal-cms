/**
 * 프로젝트 공통 테마 설정
 * 
 * 이 파일은 앱 전체에서 사용되는 색상, 버튼, 입력 필드 등의 공통 스타일을 정의.
 * 앱의 디자인을 변경하고 싶다면 이 파일만 수정.
 * 
 * 현재 테마: Gray and White (회색과 흰색 테마)
 * 기본 색상: Gray-700(#374151)과 White(#FFFFFF)
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

// =========================================
// 타입 정의
// =========================================

/**
 * 테마 색상 팔레트 타입 정의
 */
export type ThemeColorPalette = {
  primary: string;      // 주 색상 (Gray-700)
  secondary: string;    // 보조 색상 (White)
  background: {
    light: string;      // 밝은 배경색
    dark: string;       // 어두운 배경색
  };
  text: {
    light: string;      // 밝은 배경에서 텍스트 색상
    dark: string;       // 어두운 배경에서 텍스트 색상
  };
  gray: {              // 그레이 스케일
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  border: {
    light: string;     // 밝은 배경에서 테두리 색상
    dark: string;      // 어두운 배경에서 테두리 색상
  };
};

// =========================================
// 색상 값 정의
// =========================================

/**
 * 직접 색상 값을 정의하는 기본 테마 색상
 */
export const themeColors: ThemeColorPalette = {
  primary: '#374151',    // gray-700
  secondary: '#ffffff',  // white
  background: {
    light: '#f3f4f6',    // gray-100
    dark: '#374151',     // gray-700
  },
  text: {
    light: '#374151',    // gray-700
    dark: '#ffffff',     // white
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
    light: '#374151',    // gray-700
    dark: '#374151',     // gray-700
  },
};

// =========================================
// UI 컴포넌트 스타일 정의
// =========================================

/**
 * UI 컴포넌트 스타일 정의
 * Tailwind CSS 클래스를 사용하여 각 UI 요소의 스타일을 정의합니다.
 */
export const theme = {
  colors: themeColors,  // 직접 참조 가능하도록 색상 팔레트 노출
  
  // 버튼 스타일
  button: {
    // 기본 버튼 (회색 배경, 흰색 텍스트)
    primary: {
      /** 기본 버튼 배경색 */
      bg: 'bg-primary',
      /** 기본 버튼 텍스트 색상 */
      text: 'text-white',
      /** 기본 버튼 호버 상태 */
      hover: 'hover:bg-gray-600',
      /** 기본 버튼 활성화 상태 */
      active: 'active:bg-gray-800',
      /** 기본 버튼 비활성화 상태 */
      disabled: 'bg-gray-300 cursor-not-allowed',
    },
    
    // 보조 버튼 (회색 배경, 회색 테두리와 텍스트)
    secondary: {
      /** 보조 버튼 배경색 */
      bg: 'bg-gray-100',
      /** 보조 버튼 텍스트 색상 */
      text: 'text-primary',
      /** 보조 버튼 호버 상태 */
      hover: 'hover:bg-gray-100',
      /** 보조 버튼 활성화 상태 */
      active: 'active:bg-gray-200',
      /** 보조 버튼 테두리 */
      border: 'border border-primary',
      /** 보조 버튼 비활성화 상태 */
      disabled: 'bg-white text-gray-300 border-gray-300 cursor-not-allowed',
    },
  },
  
  // 입력 필드 스타일
  input: {
    /** 입력 필드 배경색 */
    bg: 'bg-gray-100',
    /** 입력 필드 텍스트 색상 */
    text: 'text-primary',
    /** 입력 필드 테두리 색상 */
    border: 'border border-primary',
    /** 입력 필드 포커스 상태 */
    focus: 'focus:ring-2 focus:ring-primary focus:border-transparent',
    /** 입력 필드 비활성화 상태 */
    disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed',
    /** 입력 필드 오류 상태 */
    error: 'border-red-500 focus:ring-red-500',
  },
  
  // 카드 스타일
  card: {
    /** 카드 배경색 */
    bg: 'bg-gray-100',
    /** 카드 테두리 */
    border: 'border border-primary',
    /** 카드 호버 상태 */
    hover: 'hover:shadow-lg',
    /** 카드 그림자 */
    shadow: 'shadow-md',
    /** 카드 라운드 코너 */
    rounded: 'rounded-lg',
  },
  
  // 이미지 스타일
  image: {
    /** 이미지 필터 (흑백) */
    filter: 'grayscale-100',
    /** 이미지 커버 */
    cover: 'object-cover',
    /** 이미지 컨테인 */
    contain: 'object-contain',
  },
  
  // 스켈레톤 로딩 스타일
  skeleton: {
    /** 스켈레톤 배경색 */
    bg: 'bg-gray-200',
    /** 스켈레톤 테두리 색상 */
    border: 'border-gray-300',
    /** 스켈레톤 애니메이션 */
    animation: 'animate-pulse',
  },
  
  // 텍스트 스타일
  text: {
  
    /** 기본 텍스트 */
    base: 'text-primary',
    /** 작은 텍스트 */
    sm: 'text-sm text-primary',
    /** 중간 텍스트 */
    md: 'text-base text-primary',
    /** 큰 텍스트 */
    lg: 'text-lg text-primary',
    /** 보조 텍스트 */
    secondary: 'text-gray-500',
    /** 강조 텍스트 */
    emphasis: 'font-medium text-primary',
  },
  
  // 레이아웃 스타일
  layout: {
    /** 기본 컨테이너 */
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    /** 섹션 간격 */
    section: 'py-12',
    /** 그리드 컨테이너 */
    grid: 'grid gap-6',
    /** 플렉스 컨테이너 */
    flex: 'flex items-center',
  },
};
