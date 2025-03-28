'use client'

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layouts/Container';
import { colors } from '@/constants/styles/colors';
import Link from 'next/link';
import { useGetProjectDetail } from '@/hooks/projects/useGetProjectDetail';
import { format } from 'date-fns';
import Tiptap from '@/components/editor/tiptap/Tiptap';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useIsAuthor } from '@/hooks/auth/useIsAuthor';
import { CommonPopover } from '@/components/common/common-popover';
import { MoreVertical } from 'lucide-react';
import { useDeleteProject } from '@/hooks/projects/useDeleteProject';
import Image from 'next/image';
import { User } from 'lucide-react';
import { useIncrementViewCount } from '@/hooks/projects/useIncrementViewCount';

interface ProjectDetailClientProps {
    publicId: string;
}

const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ publicId }) => {
    const { data: project, isLoading, error } = useGetProjectDetail(publicId);
    const { mutate: incrementViewCount } = useIncrementViewCount();
    const [isLiked, setIsLiked] = useState(false);
    const { mutateAsync: deleteProject } = useDeleteProject();
    const router = useRouter();
    const isAuthor = useIsAuthor(project?.author_uuid);

    useEffect(() => {
        if (project) {
            incrementViewCount(publicId);
        }
    }, [project, publicId, incrementViewCount]);

    const handleDeleteProject = async () => {
        if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
            try {
                await deleteProject(publicId);
                router.push('/projects');
            } catch (error) {
                console.error('프로젝트 삭제 실패:', error);
                alert('프로젝트 삭제에 실패했습니다.');
            }
        }
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error || !project) {
        notFound();
    }

    return (
        <div className={`bg-[${colors.primary.main}] min-h-screen text-black`} style={{backgroundColor: colors.primary.main}}>
            <Container className="px-0 sm:px-4">
                <div className="max-w-4xl w-full mx-auto py-4 sm:py-8">
                    <div className="w-full space-y-6">
                        <div className="bg-white rounded-lg sm:border-none">
                            <div className="p-0 sm:p-6">
                                {/* 헤더 */}
                                <div className="border-b border-gray-300 pb-4">
                                    <div className="mb-2">
                                        <span className="px-2 py-1 bg-gray-100 text-xs rounded-md">{project.categorySlug || 'no category'}</span>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-bold mb-2">{project.title}</h1>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                {project.author_profile_image ? (
                                                    <Image
                                                        src={project.author_profile_image}
                                                        alt="작성자 프로필"
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                )}
                                                <span>{project.author_display_name?.includes('@') ? project.author_display_name.split('@')[0] : project.author_display_name}</span>
                                            </div>
                                            <span>조회수: {project.viewCount}</span>
                                            <span>작성일: {format(new Date(project.createdAt), 'yyyy-MM-dd')}</span>
                                        </div>
                                        {isAuthor && (
                                            <CommonPopover
                                                trigger={
                                                    <button className="p-1 hover:bg-gray-100 rounded-full">
                                                        <MoreVertical className="w-5 h-5 text-gray-500" />
                                                    </button>
                                                }
                                                placement="bottom"
                                                className="w-32"
                                                offset={4}
                                                placementOffset="0"
                                            >
                                                <div className="py-1 text-black">
                                                    <button 
                                                        className="w-full px-4 py-2 text-xs text-left hover:bg-gray-50"
                                                        onClick={() => router.push(`/projects/${project.slug}-${publicId}/edit`)}
                                                    >
                                                        수정하기
                                                    </button>
                                                    <button 
                                                        className="w-full px-4 py-2 text-xs text-left text-red-500 hover:bg-red-50"
                                                        onClick={handleDeleteProject}
                                                    >
                                                        삭제하기
                                                    </button>
                                                </div>
                                            </CommonPopover>
                                        )}
                                    </div>
                                </div>

                                {/* 본문 내용 */}
                                <div className="mt-6 whitespace-pre-wrap">
                                    <Tiptap
                                        initialContent={project.content}
                                        contentStyle="min-h-[200px] bg-transparent prose-sm"
                                        wrapperStyle="overflow-hidden"
                                        editable={false}
                                    />
                                </div>

                                {/* 좋아요 버튼 */}
                                <div className="mt-8 border-t border-gray-300 pt-4">
                                    <div className="flex justify-center mb-8">
                                        <button 
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                                                ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                        >
                                            <span className="text-lg">❤️</span>
                                            <span>좋아요 {project.likeCount + (isLiked ? 1 : 0)}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 목록으로 버튼 */}
                        <div className="px-4 sm:px-0">
                            <div className="flex justify-end">
                                <Link 
                                    href="/projects" 
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    목록으로
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default ProjectDetailClient; 