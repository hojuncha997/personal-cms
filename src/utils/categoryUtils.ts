// src/utils/categoryUtils.ts
// 카테고리 데이터 가공 유틸리티(카테고리 선택 드롭다운에 보여지는 데이터 가공)

import { PostCategory } from '@/hooks/posts/useGetPostCategories';

interface ProcessedCategory {
    value: string;
    label: string;
}

export const processCategories = (categories: PostCategory[] = []): ProcessedCategory[] => {
    const result: ProcessedCategory[] = [];
    
    const processCategory = (category: PostCategory, parentPath?: string) => {
        // 카테고리가 자식이 없는 경우 현재 카테고리만 추가
        if (!category.children?.length) {
            result.push({
                value: category.slug,
                label: parentPath ? `${parentPath}/${category.name}` : category.name
            });
            return;
        }
        
        // 자식이 있는 경우 각 자식에 대해 처리: '/' 구분자로 카테고리 경로 생성
        // 예: 'tech' -> 'tech'
        // 예: 'tech/frontend' -> 'tech/frontend'
        category.children.forEach(child => {
            const currentPath = parentPath ? `${parentPath}/${category.name}` : category.name;
            processCategory(child, currentPath);
        });
    };

    // 카테고리 데이터 배열을 순회하며 처리
    categories.forEach(category => processCategory(category));
    return result;
}; 