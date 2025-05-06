import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '../styles/editor.css'
import ClientRootLayout from '@/components/layouts/ClientRootLayout';
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  // 타이틀: 탭 제목
  title: "Notes and Nodes",
  // 디스크립션: 검색 엔진에서 보여질 설명
  description: "음악과 IT를 좋아하는 사람들의 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-gutter-stable" style={{ scrollBehavior:'auto' }}> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientRootLayout>
          {children}
        </ClientRootLayout>
        <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GA_ID}`} />
      </body>
    </html>
  );
}
