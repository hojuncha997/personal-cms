// 방명록 타입

export type GuestbookData = {
    title: string;
    category: string;
    isSecret: boolean | false;
    // password: string;
    content: Record<string, any>;
    slug: string | null;
    tags: string[] | [];
    thumbnail: string | null;
    isFeatured: boolean | false;
    status: string | 'published';
}

/*
{
    "title" : "test-guestbook1",
    "content": {
        "text": "test content"
    },
    "author": "test-author",
    "category": "일상",
    "slug": "테스트-방명록-1",
    "tags" : ["tag1", "tag2"],
    "thumbnail":"test-thumbnail",
    "isFeatured": true,
    "status": "published"
}
*/