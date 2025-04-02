import React from 'react';
import { themeClasses } from '@/styles/theme-classes';

interface CardProps {
  children: React.ReactNode;
  className?: string;
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

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
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

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-bold mb-2 text-black ${className}`}>
      {children}
    </h3>
  );
} 