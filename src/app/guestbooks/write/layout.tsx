// src/app/guestbooks/write/layout.tsx

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '방명록 작성',
  description: '방명록 작성 페이지입니다.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/guestbooks/write`
  }
}

export default function GuestbookWriteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 