'use client'

import Navigation from './Navigation'

'use client'

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 드로어 */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* 드로어 헤더 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-700 font-semibold">메뉴</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 드로어 메뉴 */}
        <nav className="p-4">
          <ul className="space-y-3">
            <li>
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">
                홈
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">
                소개
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">
                서비스
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">
                문의하기
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
} 