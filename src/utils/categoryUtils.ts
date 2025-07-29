// src/utils/categoryUtils.ts
// 카테고리 데이터 가공 유틸리티(카테고리 선택 드롭다운에 보여지는 데이터 가공)

import { PostCategory } from '@/hooks/posts/useGetPostCategories';
// import { ProjectCategory } from '@/hooks/projects/useGetProjectCategories';

interface ProcessedCategory {
    value: string;
    label: string;
}

// 카테고리 타입에 대한 기본 인터페이스
interface BaseCategory {
    slug: string;
    name: string;
    children?: BaseCategory[];
}

// type Category = PostCategory | ProjectCategory;

export const processCategories = <T extends BaseCategory>(categories: T[] = []): ProcessedCategory[] => {
    const result: ProcessedCategory[] = [];
    
    const processCategory = (category: T, parentPath?: string) => {
        if (!category.children?.length) {
            // 자식이 없는 경우 현재 카테고리만 배열에 추가
            // 예: 'tech' -> 'tech'
            result.push({
                value: category.slug,
                label: parentPath ? `${parentPath}/${category.name}` : category.name
            });
            return;
        }
        
        // 자식이 있는 경우 각 자식에 대해 처리: '/' 구분자로 카테고리 경로 생성
        // 예: 'tech/frontend' -> 'tech/frontend'
        category.children.forEach(child => {
            const currentPath = parentPath ? `${parentPath}/${category.name}` : category.name;
            processCategory(child as T, currentPath);
        });
    };

    // 카테고리 데이터 배열을 순회하며 처리
    categories.forEach(category => processCategory(category));
    return result;
}; 