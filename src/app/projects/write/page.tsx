'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProject } from '@/hooks/projects/useCreateProject';
import ProjectForm from '@/components/projects/ProjectForm';
import { ProjectData } from '@/types/projects/projectTypes';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProjectWrite() {
    const router = useRouter();
    const { createProject } = useCreateProject();
    const { isAuthenticated, role } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || role !== 'ADMIN') {
            router.push('/projects');
        }
    }, [isAuthenticated, role, router]);

    const handleSubmit = async (data: ProjectData) => {
        await createProject(data);
        router.push('/projects');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <AdminGuard fallback={null}>
            <ProjectForm
                mode="create"
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </AdminGuard>
    );
} 