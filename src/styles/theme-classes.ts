import { theme } from '@/constants/styles/theme';

export const themeClasses = {
  // 버튼 스타일
  button: {
    primary: `${theme.button.primary.bg} ${theme.button.primary.text} ${theme.button.primary.hover} ${theme.button.primary.active} transition-all duration-200`,
    primaryDisabled: `${theme.button.primary.disabled} text-white cursor-not-allowed transition-all duration-200`,
    secondary: `${theme.button.secondary.bg} ${theme.button.secondary.text} ${theme.button.secondary.hover} ${theme.button.secondary.active} ${theme.button.secondary.border} transition-all duration-200`,
  },
  
  // 입력 필드 스타일
  input: `w-full px-4 py-3 ${theme.input.text} border ${theme.input.border} rounded-lg ${theme.input.focus} transition-all duration-200`,
  
  // 카드 스타일
  card: `${theme.card.bg} ${theme.card.border} ${theme.card.hover} rounded-lg overflow-hidden transition-all`,
  
  // 이미지 스타일
  image: `object-cover ${theme.image.filter}`,
  
  // 텍스트 스타일
  heading: {
    h1: 'text-4xl font-bold text-black',
    h2: 'text-3xl font-bold text-black',
    h3: 'text-2xl font-bold text-black',
    h4: 'text-xl font-bold text-black',
  },
  
  // 레이아웃 스타일
  layout: {
    section: 'py-12',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  
  // 다크모드에서 색상 반전
  darkMode: {
    bg: 'bg-black',
    text: 'text-white',
  }
}; 