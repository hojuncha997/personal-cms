'use client'

interface NavigationProps {
  onOpenDrawer: () => void;
}

export default function Navigation({ onOpenDrawer }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-transparent z-40 border-b-[1px] border-gray-400">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onOpenDrawer}
            className="p-2 hover:bg-gray-100 rounded-lg mr-4"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="#4B5563"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
          <h1 className="text-xl text-gray-600">차호준의 블로그</h1>
        </div>
        
        <button className="px-4 py-2 rounded-lg border-[1px] border-gray-400 bg-white text-gray-600 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-colors">
          로그인
        </button>
      </div>
    </nav>
  )
} 