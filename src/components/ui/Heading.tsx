import React from 'react';
import { themeClasses } from '@/styles/theme-classes';

/**
 * Heading 컴포넌트
 * 
 * 프로젝트 전체에서 일관된 제목 스타일을 유지하기 위해 사용하는 컴포넌트입니다.
 * h1, h2, h3, h4 레벨의 제목을 지원합니다.
 * 
 * @example
 * // 기본 제목 (기본값은 h2)
 * <Heading>기본 제목</Heading>
 * 
 * // h1 제목
 * <Heading level={1}>가장 큰 제목</Heading>
 * 
 * // h3 제목
 * <Heading level={3}>작은 제목</Heading>
 * 
 * // 커스텀 스타일 제목
 * <Heading className="text-red-500 italic">커스텀 스타일 제목</Heading>
 * 
 * // h4 제목 + 커스텀 스타일
 * <Heading level={4} className="underline">작은 커스텀 제목</Heading>
 */
interface HeadingProps {
  /** 제목 레벨 (1: h1, 2: h2, 3: h3, 4: h4) */
  level?: 1 | 2 | 3 | 4;
  /** 제목 내용 */
  children: React.ReactNode;
  /** 추가 스타일 클래스 */
  className?: string;
}

export function Heading({ level = 2, children, className = '' }: HeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  let baseClassName;
  switch (level) {
    case 1:
      baseClassName = themeClasses.heading.h1;
      break;
    case 2:
      baseClassName = themeClasses.heading.h2;
      break;
    case 3:
      baseClassName = themeClasses.heading.h3;
      break;
    case 4:
      baseClassName = themeClasses.heading.h4;
      break;
    default:
      baseClassName = themeClasses.heading.h2;
  }
  
  return (
    <HeadingTag className={`${baseClassName} ${className}`}>
      {children}
    </HeadingTag>
  );
} 