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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* 드로어 */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl text-gray-600">메뉴</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
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
          
          <nav className="space-y-4">
            <a href="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">홈</a>
            <a href="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">소개</a>
            <a href="/posts" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">게시글</a>
            <a href="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">연락처</a>
          </nav>
        </div>
      </div>
    </>
  )
} 