// 프로젝트 타입

//프로젝트 작성 시 사용되는 타입
export interface ProjectData {
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

// 개별 프로젝트 상세 페이지를 가져오기 위한 타입
export interface ProjectDetail {
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

// 프로젝트 목록 페이지를 위한 개별 프로젝트 타입
export interface ProjectForList {
    public_id: string;
    title: string;
    excerpt: string | null;
    author_display_name: string;
    current_author_name: string;
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
    isSecret: boolean;
    description: string | null;
    readingTime: number | null;
    publishedAt: string | null;
    metaDescription: string | null;
    curation: {
        isCurated: boolean;
        curatedAt: string | null;
        curatedBy: string | null;
        curationOrder: number;
        curationType: string[];
    };
}

// 프로젝트 목록 페이지를 위한 타입
export interface ProjectListResponse {
    data: ProjectForList[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ProjectQueryParams {
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

    // export interface ProjectDetailResponse extends Project {}

// export interface ProjectDetailResponse {}
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

export interface UpdateProjectData {
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