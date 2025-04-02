import React from 'react';
import { themeClasses } from '@/styles/theme-classes';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
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