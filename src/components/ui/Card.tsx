import React from 'react';
import { themeClasses } from '@/styles/theme-classes';

/**
 * Card 컴포넌트 시스템
 * 
 * 콘텐츠를 담는 카드 컴포넌트로, 프로젝트 전체에서 일관된 디자인을 유지하기 위해 사용.
 * Card, CardImage, CardContent, CardTitle 등의 컴포넌트로 구성.
 * 
 * @example
 * // 기본 카드
 * <Card>
 *   <CardContent>
 *     <CardTitle>제목</CardTitle>
 *     <p>내용</p>
 *   </CardContent>
 * </Card>
 * 
 * // 이미지가 있는 카드
 * <Card>
 *   <CardImage src="/image.jpg" alt="이미지" />
 *   <CardContent>
 *     <CardTitle>제목</CardTitle>
 *     <p>내용</p>
 *   </CardContent>
 * </Card>
 * 
 * // 클릭 가능한 카드 (링크 또는 버튼으로 사용)
 * <Card onClick={() => console.log('clicked')}>
 *   <CardContent>
 *     <CardTitle>클릭 가능한 카드</CardTitle>
 *   </CardContent>
 * </Card>
 * 
 * // 커스텀 스타일 카드
 * <Card className="bg-gray-100 shadow-lg">
 *   <CardContent className="p-6">
 *     <CardTitle className="text-red-500">커스텀 스타일 제목</CardTitle>
 *     <p>내용</p>
 *   </CardContent>
 * </Card>
 */

/**
 * Card 컴포넌트 - 콘텐츠를 담는 기본 컨테이너
 */
interface CardProps {
  /** 카드 내용 */
  children: React.ReactNode;
  /** 추가 스타일 클래스 */
  className?: string;
  /** 카드 클릭 이벤트 핸들러 */
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`${themeClasses.card} ${className}`} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

/**
 * CardImage 컴포넌트 - 카드 내 이미지 표시
 */
interface CardImageProps {
  /** 이미지 소스 URL */
  src: string;
  /** 이미지 대체 텍스트 */
  alt: string;
  /** 추가 스타일 클래스 */
  className?: string;
  /** 이미지 컨테이너 높이 */
  height?: string;
}

export function CardImage({ src, alt, className = '', height = 'h-48' }: CardImageProps) {
  return (
    <div className={`${height} w-full relative overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full ${themeClasses.image}`} 
      />
    </div>
  );
}

/**
 * CardContent 컴포넌트 - 카드 내용 영역
 */
interface CardContentProps {
  /** 콘텐츠 내용 */
  children: React.ReactNode;
  /** 추가 스타일 클래스 */
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * CardTitle 컴포넌트 - 카드 제목
 */
interface CardTitleProps {
  /** 제목 내용 */
  children: React.ReactNode;
  /** 추가 스타일 클래스 */
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-bold mb-2 text-black ${className}`}>
      {children}
    </h3>
  );
} 