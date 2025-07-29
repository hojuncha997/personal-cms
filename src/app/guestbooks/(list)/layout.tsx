import type { Metadata } from 'next'
import GuestbookLayoutClient from '@/components/guestbooks/GuestbookLayoutClient';
// import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles';

export const metadata: Metadata = {
  title: '방명록 목록',
  description: '방명록 목록 페이지입니다.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/guestbooks`
  }
}

export default function GuestbookListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
      <GuestbookLayoutClient>
        {children}
      </GuestbookLayoutClient>
    </div>
  )
} 
