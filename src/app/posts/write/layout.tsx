import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '게시글 작성',
  description: '게시글 작성 페이지입니다.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/write`
  }
}

export default function PostWriteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 