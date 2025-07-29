import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '게시판',
  description: '게시판 페이지입니다.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/posts`
  }
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 
