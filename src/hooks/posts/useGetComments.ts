import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/useAuthStore';

interface Comment {
  id: number;
  content: string;
  isEdited: boolean;
  isDeleted: boolean;
  isSecret: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  member: {
    uuid: string;
    nickname: string;
    profileImage?: string;
  };
  replies: Array<{
    id: number;
    content: string;
    isEdited: boolean;
    isDeleted: boolean;
    isSecret: boolean;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
    member: {
      uuid: string;
      nickname: string;
      profileImage?: string;
    };
  }>;
  replyCount: number;
}

interface CommentsResponse {
  comments: Comment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useGetComments = (publicId: string, page: number = 1, limit: number = 20) => {
  const { isAuthenticated, sub } = useAuthStore();
  
  return useQuery<CommentsResponse>({
    // React Query의 캐시 키 설정
    // 이 키가 변경되면 React Query는 새로운 데이터를 서버에서 가져옴
    // 
    // 비밀 댓글 기능을 위한 핵심 로직:
    // - 로그인 상태: ['post', 'abc123', 'comments', 1, 20, 'user-sub-id']
    // - 로그아웃 상태: ['post', 'abc123', 'comments', 1, 20, 'anonymous']
    // 
    // 로그인/로그아웃 시 sub 값이 변경되므로 캐시 키가 달라짐
    // → React Query가 자동으로 새 데이터를 서버에서 가져옴
    // → 서버는 사용자 권한에 따라 비밀 댓글 내용을 필터링해서 보냄
    // → 비밀 댓글이 즉시 보이거나 숨겨짐
    queryKey: ['post', publicId, 'comments', page, limit, isAuthenticated ? sub : 'anonymous'],
    
    // 서버에서 데이터를 가져오는 함수
    queryFn: async () => {
      // 댓글 조회는 공개 API이므로 인증 헤더를 선택적으로 포함
      // 로그인 상태: Authorization 헤더 포함 → 비밀 댓글 권한 확인 가능
      // 로그아웃 상태: Authorization 헤더 없음 → 일반 댓글만 볼 수 있음
      const response = await fetchClient(
        `/posts/${publicId}/comments?page=${page}&limit=${limit}`,
        { 
          // skipAuth를 사용하지 않고, 토큰이 있으면 보내고 없으면 안 보냄
          // 이렇게 하면 토큰 갱신 시도를 하지 않음
          skipAuth: !isAuthenticated 
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      return response.json();
    },
    
    // publicId가 있을 때만 쿼리 실행
    enabled: !!publicId,
    
    // 캐시된 데이터를 1분간 최신 상태로 간주 (refetch 방지)
    staleTime: 1000 * 60, // 1분
  });
};