import type { Metadata } from 'next'
import ProjectLayoutClient from '@/components/projects/ProjectLayoutClient';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles';

export const metadata: Metadata = {
  title: '프로젝트 목록',
  description: '프로젝트 목록 페이지입니다.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/projects`
  },
  robots: 'noindex, nofollow' // 검색 엔진에 색인되지 않도록 설정
}

export default function ProjectListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
      <ProjectLayoutClient>
        {children}
      </ProjectLayoutClient>
    </div>
  )
}