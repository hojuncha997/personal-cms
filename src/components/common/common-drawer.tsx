'use client'

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CommonDrawerProps {
    trigger: React.ReactNode,
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void,
    portalTo?: string;
    drawerWidth?: string;
}

export function CommonDrawer({ portalTo, drawerWidth = '30', ...props }: CommonDrawerProps) {
    
    // SSR 환경에서 document 객체 접근을 안전하게 하기 위한 mounted 상태              
    const [mounted, setMounted] = useState(false);

    const drawerStyle = {
        width: `${drawerWidth}vw`,
        maxWidth: '500px', // 최대 너비 제한
        minWidth: '280px'  // 최소 너비 제한
    };
    
    // 컴포넌트 마운트/언마운트 시 mounted 상태 관리
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const content = (
        <>
            <div>{props.trigger}</div>            
                {/* 오버레이 */}
                <div 
                    className={`
                        fixed inset-0 bg-black z-[100]
                        transition-opacity duration-300 ease-in-out
                        ${props.isOpen ? 'opacity-50 visible' : 'opacity-0 invisible'}
                    `}
                    onClick={props.onClose}
                />
                {/* 드로어 */}
                <div style={drawerStyle} //w-[${drawerWidth}px]는 사용불가. 테일윈드는 빌드타임에 클래스를 생성하기 때문에 동적 값 사용 어려움
                    className={`
                        fixed top-0 right-0 h-full  bg-white shadow-lg z-[101]
                        transform transition-all duration-300 ease-in-out
                        ${props.isOpen 
                            ? 'translate-x-0 opacity-100 visible' 
                            : 'translate-x-full opacity-0 invisible'
                        }
                    `}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex justify-end p-5 border-b border-gray-200">
                            <button onClick={props.onClose} className="text-gray-500">
                                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {props.children}
                        </div>
                    </div>
                </div>
        </>
    );

    // mounted 상태일 때만 Portal 생성 시도 (SSR 시 document 접근 에러 방지)
    if (mounted && portalTo) {
        // portalTo 속성에 전달된 값을 사용하여 포탈 요소 찾기
        const portalElement = document.getElementById(portalTo);
        if (portalElement) {
            return createPortal(content, portalElement);
        }
    }

    return content;
}
