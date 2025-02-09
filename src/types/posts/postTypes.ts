// 포스팅 타입

export type PostData = {
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

export interface Post {
    public_id: string;
    title: string;
    content: {
        type: string;
        content: any[];
    };
    author_display_name: string;
    current_author_name: string;
    isSecret: boolean;
    category: string;
    slug: string;
    tags: string[];
    thumbnail: string | null;
    status: string;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
}

export interface PostResponse {
    posts: Post[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface PostQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sortBy?: 'createdAt' | 'viewCount' | 'likeCount';
    order?: 'ASC' | 'DESC';
    tag?: string;
    startDate?: string;
    endDate?: string;
}

export interface PostDetailResponse extends Post {}

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