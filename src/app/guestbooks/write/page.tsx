// src/app/guestbooks/write/page.tsx

'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGuestbook } from '@/hooks/guestbooks/useCreateGuestbook';
import GuestbookForm from '@/components/guestbooks/GuestbookForm';
import { GuestbookData } from '@/types/guestbooks/guestbookTypes';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { useAuthStore } from '@/store/useAuthStore';

export default function GuestbookWrite() {
    const router = useRouter();
    const { createGuestbook } = useCreateGuestbook();
    const { isAuthenticated, role } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || role !== 'ADMIN') {
            router.push('/guestbooks');
        }
    }, [isAuthenticated, role, router]);

    const handleSubmit = async (data: GuestbookData) => {
        await createGuestbook(data);
        router.push('/guestbooks');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <AdminGuard fallback={null}>
            <GuestbookForm
                mode="create"
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </AdminGuard>
    );
} 