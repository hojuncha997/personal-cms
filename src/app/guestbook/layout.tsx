import type { Metadata } from 'next'
import { Container } from '@/components/layouts/Container'
import { colors } from '@/constants/styles'

export const metadata: Metadata = {
  title: '방명록',
  description: '방명록 목록 페이지입니다.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/guestbook`
  }
}

export default function GuestbookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
      <Container>
        <div className="max-w-4xl w-full mx-auto py-8">
          {children}
        </div>
      </Container>
    </div>
  )
} 