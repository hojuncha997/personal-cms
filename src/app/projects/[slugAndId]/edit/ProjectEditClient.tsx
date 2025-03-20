'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetProjectDetail } from '@/hooks/projects/useGetProjectDetail';
import { useUpdateProject } from '@/hooks/projects/useUpdateProject';
import ProjectForm from '@/components/projects/ProjectForm';
import { ProjectData } from '@/types/projects/projectTypes';
import { useIsAuthor } from '@/hooks/auth/useIsAuthor';

interface ProjectEditClientProps {
    publicId: string;
}

export default function ProjectEditClient({ publicId }: ProjectEditClientProps) {
    const router = useRouter();
    const { data: project, isLoading } = useGetProjectDetail(publicId);
    const { mutateAsync: updateProject } = useUpdateProject();
    const isAuthor = useIsAuthor(project?.author_uuid);

    const handleSubmit = async (data: ProjectData) => {
        await updateProject({
            ...data,
            publicId,
            thumbnail: data.thumbnail || undefined,
            status: data.status as 'draft' | 'published',
        });
        router.push(`/projects/${project?.slug}-${publicId}`);
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!project) {
        return <div>프로젝트를 찾을 수 없습니다.</div>;
    }

    if (!isAuthor) {
        router.push(`/projects/${project?.slug}-${publicId}`);
        return null;
    }

    return (
        <ProjectForm
            mode="edit"
            initialData={project}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
} 