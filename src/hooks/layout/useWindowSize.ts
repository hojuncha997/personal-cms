import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  mobile: 768,  // md
  tablet: 1024, // lg
} as const;

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 초기 리사이즈 이벤트 실행 추가
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < BREAKPOINTS.mobile;
  const isTablet = windowSize.width >= BREAKPOINTS.mobile && windowSize.width < BREAKPOINTS.tablet;
  const isDesktop = windowSize.width >= BREAKPOINTS.tablet;

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
  };
}; 