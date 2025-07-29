'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// z-index 관리를 위한 상수
const Z_INDEX = {
  overlay: 'z-[15]',
  drawer: 'z-[15]'
} as const;

interface CommonDrawerProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    portalTo?: string;
    /** 드로어의 높이 (rem 또는 vh 단위) */
    drawerHeight?: string;
    /** 드로어의 너비 (rem 단위) */
    drawerWidth?: string;
    /** 드로어의 위치 */
    position?: 'left' | 'right' | 'top' | 'bottom';
    /** 백드롭 블러 효과 사용 여부 */
    hasBlur?: boolean;
    /** 드로어 제목 */
    title?: string;
    /** 오버레이 표시 여부 */
    hasOverlay?: boolean;
    /** 추가 클래스명 */
    className?: string;
    /** 드로어 열릴 때 스크롤 방지 여부 */
    preventScroll?: boolean;
}

const getTransformValue = (position: string, isOpen: boolean) => {
    if (!isOpen) {
        switch(position) {
            case 'left': return '-translate-x-full';
            case 'right': return 'translate-x-full';
            case 'top': return '-translate-y-full';
            case 'bottom': return 'translate-y-full';
            default: return '';
        }
    }
    return 'translate-x-0 translate-y-0';
};

export function CommonDrawer({ 
    portalTo,
    drawerHeight = '100vh',
    drawerWidth = '24rem', // 384px
    position = 'right',
    hasBlur = false,
    hasOverlay = true,
    preventScroll = true, // 기본값은 true로 설정
    title = '메뉴',
    className = '',
    ...props 
}: CommonDrawerProps) {
    // SSR 환경에서 document 객체 접근을 안전하게 하기 위한 mounted 상태
    const [mounted, setMounted] = useState(false);
    
    // 드로어가 열리기 전 활성화된 요소를 저장
    const previousActiveElement = useRef<HTMLElement | null>(null);
    // 드로어의 첫 번째 포커스 가능한 요소를 저장할 ref
    const drawerRef = useRef<HTMLDivElement>(null);

    const drawerStyle = {
        height: drawerHeight,
        width: drawerWidth,
        maxWidth: 'min(calc(100vw - 2rem), 32rem)', // 최대 너비를 뷰포트 기준으로 제한
        minWidth: '18rem' // 288px
    };

    // 포커스 트랩 구현
    const handleTabKey = useCallback((e: KeyboardEvent) => {
        if (!drawerRef.current || !props.isOpen) return;

        const focusableElements = drawerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }, [props.isOpen]);

    // 컴포넌트 마운트/언마운트 시 mounted 상태 관리
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // 드로어 열림/닫힘 시 포커스 관리
    useEffect(() => {
        if (props.isOpen && drawerRef.current) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            const focusableElement = drawerRef.current.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as HTMLElement;
            if (focusableElement) {
                focusableElement.focus();
            }
        } else if (!props.isOpen && previousActiveElement.current) {
            previousActiveElement.current.focus();
        }
    }, [props.isOpen]);

    // ESC 키와 포커스 트랩 이벤트 리스너
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && props.isOpen) {
                props.onClose();
            }
            handleTabKey(event);
        };

        if (props.isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [props.isOpen, props.onClose, handleTabKey]);

    // 드로어가 열릴 때 스크롤 방지
    useEffect(() => {
        if (props.isOpen && preventScroll) {
            const scrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            document.body.style.cssText = `
                overflow: hidden;
                position: fixed;
                top: -${scrollY}px;
                left: 0;
                right: 0;
                width: 100%;
                padding-right: ${scrollbarWidth}px;
            `;

            return () => {
                document.body.style.cssText = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [props.isOpen, preventScroll]);

    const content = (
        <>
            <div>{props.trigger}</div>
            
            {/* 오버레이 */}
            {hasOverlay && (
                <div 
                    className={`
                        fixed inset-0 bg-black/50 ${Z_INDEX.overlay}
                        transition-opacity duration-300 ease-in-out
                        ${props.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
                        ${hasBlur ? 'backdrop-blur-sm' : ''}
                    `}
                    onClick={props.onClose}
                    aria-hidden="true"
                />
            )}

            {/* 드로어 */}
            <div 
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                style={drawerStyle}
                className={`
                    fixed ${position === 'top' || position === 'bottom' ? `${position}-0 left-0 w-full` : `top-0 ${position}-0 h-full`} 
                    bg-white shadow-xl ${Z_INDEX.drawer}
                    transform transition-all duration-300 ease-in-out
                    ${props.isOpen 
                        ? 'opacity-100 visible' 
                        : `${getTransformValue(position, false)} opacity-0 invisible`
                    }
                    ${className}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* 헤더 */}
                    <div className="flex justify-between items-center p-3.5 sm:p-3.5 border-b border-gray-200">
                        <div className="text-lg font-semibold text-gray-900">{title}</div>
                        <button 
                            onClick={props.onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            aria-label="닫기"
                        >
                            <svg 
                                className="h-5 w-5" 
                                fill="none" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* 컨텐츠 */}
                    {/* <div className="flex-1 overflow-y-auto p-4 sm:p-6"> */}
                    <div className="flex-1 overflow-y-auto">
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    );

    // mounted 상태일 때만 Portal 생성 시도 (SSR 시 document 접근 에러 방지)
    if (mounted && portalTo) {
        const portalElement = document.getElementById(portalTo);
        // portalElement가 없을 경우 fallback으로 일반 렌더링
        if (portalElement) {
            return createPortal(content, portalElement);
        }
        console.warn(`Portal element with id "${portalTo}" not found. Rendering inline.`);
    }

    return content;
}


// 'use client'

// import { useState, useEffect } from 'react';
// import { createPortal } from 'react-dom';

// interface CommonDrawerProps {
//     trigger: React.ReactNode,
//     children: React.ReactNode,
//     isOpen: boolean,
//     onClose: () => void,
//     portalTo?: string;
//     drawerWidth?: string;
// }

// export function CommonDrawer({ portalTo, drawerWidth = '30', ...props }: CommonDrawerProps) {
    
//     // SSR 환경에서 document 객체 접근을 안전하게 하기 위한 mounted 상태              
//     const [mounted, setMounted] = useState(false);

//     const drawerStyle = {
//         width: `${drawerWidth}vw`,
//         maxWidth: '500px', // 최대 너비 제한
//         minWidth: '280px'  // 최소 너비 제한
//     };
    
//     // 컴포넌트 마운트/언마운트 시 mounted 상태 관리
//     useEffect(() => {
//         setMounted(true);
//         return () => setMounted(false);
//     }, []);

//     const content = (
//         <>
//             <div>{props.trigger}</div>            
//                 {/* 오버레이 */}
//                 <div 
//                     className={`
//                         fixed inset-0 bg-black z-[100]
//                         transition-opacity duration-300 ease-in-out
//                         ${props.isOpen ? 'opacity-50 visible' : 'opacity-0 invisible'}
//                     `}
//                     onClick={props.onClose}
//                 />
//                 {/* 드로어 */}
//                 <div style={drawerStyle} //w-[${drawerWidth}px]는 사용불가. 테일윈드는 빌드타임에 클래스를 생성하기 때문에 동적 값 사용 어려움
//                     className={`
//                         fixed top-0 right-0 h-full  bg-white shadow-lg z-[101]
//                         transform transition-all duration-300 ease-in-out
//                         ${props.isOpen 
//                             ? 'translate-x-0 opacity-100 visible' 
//                             : 'translate-x-full opacity-0 invisible'
//                         }
//                     `}
//                 >
//                     <div className="flex flex-col h-full">
//                         <div className="flex justify-end p-5 border-b border-gray-200">
//                             <button onClick={props.onClose} className="text-gray-500">
//                                 <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path d="M6 18L18 6M6 6l12 12"></path>
//                                 </svg>
//                             </button>
//                         </div>
//                         <div className="flex-1 overflow-y-auto">
//                             {props.children}
//                         </div>
//                     </div>
//                 </div>
//         </>
//     );

//     // mounted 상태일 때만 Portal 생성 시도 (SSR 시 document 접근 에러 방지)
//     if (mounted && portalTo) {
//         // portalTo 속성에 전달된 값을 사용하여 포탈 요소 찾기
//         const portalElement = document.getElementById(portalTo);
//         if (portalElement) {
//             return createPortal(content, portalElement);
//         }
//     }

//     return content;
// }
