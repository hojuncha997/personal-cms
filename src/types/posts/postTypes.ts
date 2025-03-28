// 포스팅 타입

//포스팅 작성 시 사용되는 타입
export interface PostData {
    title: string;
    categorySlug?: string;
    isSecret: boolean | false;
    // password: string;
    content: Record<string, any>;
    slug: string | null;
    tags: string[] | [];
    thumbnail: string | null;
    isFeatured: boolean | false;
    status: string | 'published';
}

// 개별 포스팅 상세 페이지를 가져오기 위한 타입
export interface PostDetail {
    public_id: string;
    title: string;
    content: {
        type: string;
        content: any[];
        // content: Array<{
        //     type: string;
        //     attrs?: {
        //         textAlign: string | null;
        //     };
        //     content?: Array<{
        //         type: string;
        //         text?: string;
        //     }>;
        // }>;
    };
    author_display_name: string;
    current_author_name: string;
    author_profile_image?: string;
    isSecret: boolean;
    author_uuid: string;
    categorySlug: string;
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
    description: string | null;
    readingTime: number | null;
    publishedAt: string | null;
    coverImageAlt: string | null;
    viewTimeInSeconds: number;
    curation: {
        isCurated: boolean;
        curatedAt: string | null;
        curatedBy: string | null;
        curationOrder: number;
        curationType: string[];
    };
    excerpt?: string;
}

// 포스팅 목록 페이지를 위한 개별 포스팅 타입
export interface PostForList {
    public_id: string;
    title: string;
    slug: string;
    excerpt?: string;
    thumbnail?: string;
    categorySlug?: string;
    author_display_name: string;
    current_author_name: string;
    author_uuid: string;
    author_profile_image?: string;
    viewCount: number;
    likeCount: number;
    createdAt: string;
    isSecret: boolean;
}

// 포스팅 목록 페이지를 위한 타입
export interface PostListResponse {
    data: PostForList[];
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
    categorySlug?: string;
    status?: string;
    sortBy?: 'createdAt' | 'viewCount' | 'likeCount';
    order?: 'ASC' | 'DESC';
    tag?: string;
    startDate?: string;
    endDate?: string;
}

// export interface PostDetailResponse extends Post {}

// export interface PostDetailResponse {}
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

export interface UpdatePostData {
    publicId: string;
    title: string;
    categorySlug?: string;
    content: Record<string, any>;
    thumbnail?: string;
    isSecret: boolean;
    isFeatured: boolean;
    status: 'draft' | 'published';
    tags: string[];
}