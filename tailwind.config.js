/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // CSS 변수를 참조하는 색상 설정
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                'primary-light': 'var(--color-gray-600)',
                'primary-dark': 'var(--color-gray-800)',
                gray: {
                    100: 'var(--color-gray-100)',
                    200: 'var(--color-gray-200)',
                    300: 'var(--color-gray-300)',
                    400: 'var(--color-gray-400)',
                    500: 'var(--color-gray-500)',
                    600: 'var(--color-gray-600)',
                    700: 'var(--color-gray-700)',
                    800: 'var(--color-gray-800)',
                    900: 'var(--color-gray-900)',
                },
            },
            backgroundColor: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
            },
            textColor: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
            },
            borderColor: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),  // 기존 typography 플러그인
        require('tailwind-scrollbar'),       // 스크롤바 플러그인 추가
    ],
    // 세이프리스트 추가 - 핵심 클래스 보존
    safelist: [
        'bg-primary',
        'text-primary',
        'border-primary',
        'bg-primary-light', 
        'bg-primary-dark',
        'text-white'
    ]
} 