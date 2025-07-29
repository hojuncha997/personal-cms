// src/components/common/FilterContent.tsx
// 검색 및 정렬 옵션 컴포넌트

import React from 'react';
import DateRangeFilter from './DateRangeFilter';

interface FilterContentProps {
    // 검색 관련
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    // 정렬 관련
    sortValue: string;
    orderValue: string;
    onSortChange: (sortBy: string) => void;

    // 기간 관련
    startDate: string;
    endDate: string;
    onDateChange: (startDate: string, endDate: string) => void;

    // 카테고리 관련 (선택적)
    categoryValue?: string;
    onCategoryChange?: (category: string) => void;
    categories?: Array<{
        value: string;
        label: string;
    }>;
}

const FilterContent: React.FC<FilterContentProps> = ({
    searchValue,
    onSearchChange,
    onSearchSubmit,
    sortValue,
    orderValue,
    onSortChange,
    startDate,
    endDate,
    onDateChange,
    categoryValue,
    onCategoryChange,
    categories
}) => {
    return (
        <>
            {/* 정렬 옵션 */}
            <div className="mb-4 flex gap-4">
                <button
                    onClick={() => onSortChange('createdAt')}
                    className={`text-sm ${sortValue === 'createdAt' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                >
                    최신순 {sortValue === 'createdAt' && (orderValue === 'DESC' ? '↓' : '↑')}
                </button>
                <button
                    onClick={() => onSortChange('viewCount')}
                    className={`text-sm ${sortValue === 'viewCount' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                >
                    조회순 {sortValue === 'viewCount' && (orderValue === 'DESC' ? '↓' : '↑')}
                </button>
                <button
                    onClick={() => onSortChange('likeCount')}
                    className={`text-sm ${sortValue === 'likeCount' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                >
                    좋아요순 {sortValue === 'likeCount' && (orderValue === 'DESC' ? '↓' : '↑')}
                </button>
            </div>

            {/* 검색 영역 */}
            <div className="space-y-4">
                {/* 카테고리 선택 (선택적) */}
                {categories && onCategoryChange && (
                    <select
                        value={categoryValue}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                    >
                        <option value="">전체 카테고리</option>
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                )}

                {/* 날짜 선택 영역 */}
                <DateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={onDateChange}
                />
                
                {/* 검색어 입력 */}
                <form onSubmit={onSearchSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        className="flex-1 px-4 py-2 border rounded-md"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                    >
                        검색
                    </button>
                </form>
            </div>
        </>
    );
};

export default FilterContent; 