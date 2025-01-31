/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // 기존 theme 설정들...
        },
    },
    plugins: [
        require('@tailwindcss/typography'),  // 기존 typography 플러그인
        require('tailwind-scrollbar'),       // 스크롤바 플러그인 추가
    ],
} 