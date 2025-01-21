import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  mobile: 768,  // md
  tablet: 1024, // lg
} as const;

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    // 초기값을 0으로 설정했더니 하이드레이션 시 타이밍 문제 때문에 데스크탑 환경에서 0이 되어 레이아웃이 깨지는 문제가 있었음.
    // 따라서 데스크톱 기본값을 1024로 설정하여 문제를 해결함. 하드코딩 했다가 일단 브레이크 포인트의 속성을 가져오는 방식으로 변경함.
    width: typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.tablet, // 데스크톱 기본값
    height: typeof window !== 'undefined' ? window.innerHeight : BREAKPOINTS.mobile,
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