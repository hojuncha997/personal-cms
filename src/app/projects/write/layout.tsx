import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '프로젝트 작성',
  description: '프로젝트 작성 페이지입니다.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/write`
  }
}

export default function ProjectWriteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 