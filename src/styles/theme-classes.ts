import { theme } from '@/constants/styles/theme';

/**
 * 테마 클래스 모듈
 * 
 * 프로젝트 전체에서 일관된 디자인 시스템을 유지하기 위한 공통 클래스 문자열 모음입니다.
 * UI 컴포넌트에서 직접 사용하거나, 사용자 정의 컴포넌트에서 참조할 수 있습니다.
 * 
 * 이 파일은 src/constants/styles/theme.ts 파일의 테마 설정을 기반으로 합니다.
 * 테마 변경이 필요할 경우 theme.ts 파일만 수정하면 앱 전체에 변경 사항이 적용됩니다.
 * 
 * @example
 * // 컴포넌트에서 직접 사용
 * import { themeClasses } from '@/styles/theme-classes';
 * 
 * function MyComponent() {
 *   return (
 *     <div className={themeClasses.card}>
 *       <button className={themeClasses.button.primary}>버튼</button>
 *     </div>
 *   );
 * }
 */
export const themeClasses = {
  // 버튼 스타일
  button: {
    /** 기본 버튼 스타일 (회색 배경, 흰색 텍스트) */
    primary: `${theme.button.primary.bg} ${theme.button.primary.text} ${theme.button.primary.hover} ${theme.button.primary.active} transition-all duration-200`,
    /** 비활성화된 기본 버튼 스타일 */
    primaryDisabled: `${theme.button.primary.disabled} text-white cursor-not-allowed transition-all duration-200`,
    /** 보조 버튼 스타일 (흰색 배경, 회색 테두리와 텍스트) */
    secondary: `${theme.button.secondary.bg} ${theme.button.secondary.text} ${theme.button.secondary.hover} ${theme.button.secondary.active} ${theme.button.secondary.border} transition-all duration-200`,
    /** 버튼 내부 아이템 스타일 (인라인 플렉스, 패딩) */
    item: `${theme.button.primary.bg} ${theme.button.primary.text} px-2 inline-flex items-center`,
  },
  
  // 입력 필드 스타일
  /** 기본 입력 필드 스타일 */
  input: `w-full px-4 py-3 ${theme.input.text} border ${theme.input.border} rounded-lg ${theme.input.focus} transition-all duration-200`,
  
  // 카드 스타일
  /** 기본 카드 컨테이너 스타일 */
  card: `${theme.card.bg} ${theme.card.border} ${theme.card.hover} rounded-lg overflow-hidden transition-all`,
  
  // 이미지 스타일
  /** 이미지 스타일 (흑백) */
  image: `object-cover ${theme.image.filter}`,
  
  // 텍스트 스타일
  heading: {
    /** h1 제목 스타일 */
    h1: 'text-4xl font-bold text-gray-700',
    /** h2 제목 스타일 */
    h2: 'text-3xl font-bold text-gray-700',
    /** h3 제목 스타일 */
    h3: 'text-2xl font-bold text-gray-700',
    /** h4 제목 스타일 */
    h4: 'text-xl font-bold text-gray-700',
    /** 섹션 제목 스타일 (밑줄 포함) */
    section: 'text-xl mb-6 border-b border-primary',
  },
  
  // 링크 스타일
  /** 링크 스타일 */
  link: `${theme.button.primary.hover.replace('bg-', 'text-')}`,
  
  // 콘텐츠 스타일
  content: {
    /** 텍스트 콘텐츠 스타일 */
    text: 'text-primary',
    /** 섹션 콘텐츠 스타일 */
    section: 'mb-12 text-primary',
  },
  
  // 레이아웃 스타일
  layout: {
    /** 섹션 여백 스타일 */
    section: 'py-12',
    /** 콘텐츠 컨테이너 스타일 */
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  
  // 다크모드에서 색상 반전
  darkMode: {
    /** 다크모드 배경색 */
    bg: 'bg-gray-700',
    /** 다크모드 텍스트 색상 */
    text: 'text-white',
  },
  
  // 스켈레톤 로딩 컴포넌트 스타일
  skeleton: {
    /** 스켈레톤 기본 스타일 */
    base: `${theme.skeleton.bg} rounded ${theme.skeleton.animation}`,
    /** 스켈레톤 테두리 스타일 */
    border: `border ${theme.skeleton.border}`,
  }
}; 