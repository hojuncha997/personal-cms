// src/hooks/posts/useDeletePost.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/lib/fetchClient';

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (publicId: string) => {
            const response = await fetchClient(`/posts/${publicId}`, {
                method: 'DELETE',
                skipAuth: false
            });
            // return response.json();
            // DELETE 요청은 보통 빈 응답을 반환하므로 json() 파싱 제거
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

/*



// useMutation이 실제로 반환하는 객체의 형태
{
    mutate: (variables: TVariables) => void,
    mutateAsync: (variables: TVariables) => Promise<TData>,
    isPending: boolean,
    isError: boolean,
    isSuccess: boolean,
    error: Error | null,
    data: TData | null,
    ...기타 속성들
}


//

/*
이전 코드와 비교한 변경사항과 장점:

1. 구조적 변화:
  - public_id를 훅 파라미터로 받지 않고 mutation 실행 시점에 받음
  - 더 유연한 재사용이 가능해짐 (여러 게시물에 같은 훅 인스턴스 사용 가능)

2. 캐시 관리 추가:
  - useQueryClient를 통한 캐시 무효화 로직 포함
  - 삭제 후 posts 목록이 자동으로 갱신됨
  - 사용자 경험 향상 (수동으로 새로고침할 필요 없음)

3. 상태 관리:
  - 이전: isPending, isError 등을 별칭으로 명시적 반환
  - 현재: useMutation이 제공하는 상태들을 그대로 사용
  - 사용하는 쪽에서 필요한 상태만 구조분해할당으로 가져다 사용 가능
  
4. 사용 방식:
  이전:
  const { deletePost, isDeleting, isDeleteError } = useDeletePost(publicId);
  
  현재:
  const { mutate: deletePost, isPending, isError } = useDeletePost();
  deletePost(publicId);

장점:
- 더 유연한 재사용성
- 자동 캐시 갱신
- React Query의 기본 패턴에 더 부합
- 불필요한 별칭 제거로 코드 간소화

*/