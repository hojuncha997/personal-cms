// src/components/common/Accordion.tsx
// 아코디언 컴포넌트

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
    // 아코디언 제목: 접힌 상태에서는 제목만 보이고, 열린 상태에서는 제목과 내용이 모두 보임
    title: string;
    // 아코디언 내에 들어갈 컴포넌트: 접힌 상태에서는 보이지 않고, 열린 상태에서는 보임
    children: React.ReactNode;
    // 아코디언 클래스 이름: 컴포넌트 스타일링(tailwind css)을 위해 사용
    className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, className }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`mb-6 border border-gray-200 rounded-lg ${className || ''}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 flex items-center justify-between bg-white rounded-lg hover:bg-gray-50 ${className || ''}`}
            >
                {/* 아코디언 제목 */}
                <span className="font-medium">{title}</span>
                {/* 아코디언 화살표 아이콘: 클릭하면 아코디언 열림/닫힘 상태 변경 */}
                <ChevronDown 
                    className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>
            
            {isOpen && (
                <div className="p-4 border-t border-gray-200">
                    {/* 아코디언 자식 컴포넌트 */}
                    {children}
                </div>
            )}
        </div>
    );
};

export default Accordion; 