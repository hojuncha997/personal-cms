'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetGuestbookDetail } from '@/hooks/guestbooks/useGetGuestbookDetail';
import { useUpdateGuestbook } from '@/hooks/guestbooks/useUpdateGuestbook';
import { GuestbookData } from '@/types/guestbooks/guestbookTypes';
import { useIsAuthor } from '@/hooks/auth/useIsAuthor';
import GuestbookDetailSkeleton from '@/components/guestbooks/skeletons/GuestbookDetailSkeleton';
import GuestbookForm from '@/components/guestbooks/GuestbookForm';

interface GuestbookEditClientProps {
    publicId: string;
}

    export default function GuestbookEditClient({ publicId }: GuestbookEditClientProps) {
    const router = useRouter();
    const { data: guestbook, isLoading } = useGetGuestbookDetail(publicId);
    const { mutateAsync: updateGuestbook } = useUpdateGuestbook();
    const isAuthor = useIsAuthor(guestbook?.author_uuid);

    const handleSubmit = async (data: GuestbookData) => {
        await updateGuestbook({
            ...data,
            publicId,
            thumbnail: data.thumbnail || undefined,
            status: data.status as 'draft' | 'published',
        });
        router.push(`/guestbooks/${guestbook?.slug}-${publicId}`);
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return <GuestbookDetailSkeleton />;
    }

    if (!guestbook) {
        return <div>방명록을 찾을 수 없습니다.</div>;
    }

    if (!isAuthor) {
        router.push(`/guestbooks/${guestbook?.slug}-${publicId}`);
        return null;
    }

    return (
        <GuestbookForm
            mode="edit"
            initialData={guestbook}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
} 