// 관련 포스트 컴포넌트

import Link from 'next/link';
import { useGetRelatedGuestbooks } from '@/hooks/guestbooks/useGetRelatedGuestbooks';
import { format } from 'date-fns';
import { GuestbookForList } from '@/types/guestbooks/guestbookTypes';

interface RelatedGuestbooksProps {
    publicId: string;
}

const GuestbookList = ({ guestbooks, title }: { guestbooks: GuestbookForList[], title: string }) => (
    <div className="space-y-3">
        <h4 className="text-sm text-gray-500 font-medium">{title}</h4>
        {guestbooks.map((guestbook) => (
            <Link 
                key={guestbook.public_id}
                href={`/guestbooks/${guestbook.slug}-${guestbook.public_id}`}
                className="block border rounded-lg hover:bg-gray-50 transition-colors"
            >
                <div className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-gray-100 text-xs rounded">
                            {guestbook.categorySlug}
                        </span>
                        <span className="text-xs text-gray-500">
                            {format(new Date(guestbook.createdAt), 'yyyy.MM.dd')}
                        </span>
                    </div>
                    <h5 className="font-medium text-sm line-clamp-2 text-gray-900">{guestbook.title}</h5>
                </div>
            </Link>
        ))}
    </div>
);

export const RelatedGuestbooks = ({ publicId }: RelatedGuestbooksProps) => {
    const { data: relatedGuestbooks, isLoading } = useGetRelatedGuestbooks(publicId);
    
    if (isLoading || !relatedGuestbooks) return null;

    return (
        <div>
            <h3 className="text-lg font-semibold mb-6">관련 방명록</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedGuestbooks.manual.length > 0 && (
                    <GuestbookList 
                        guestbooks={relatedGuestbooks.manual} 
                        title="추천 방명록" 
                    />
                )}
                
                {relatedGuestbooks.auto.length > 0 && (
                    <GuestbookList 
                        guestbooks={relatedGuestbooks.auto} 
                        title="비슷한 주제의 방명록" 
                    />
                )}
            </div>
        </div>
    );
}; 