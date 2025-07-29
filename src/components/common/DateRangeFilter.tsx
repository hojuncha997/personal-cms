// src/components/common/DateRangeFilter.tsx
// 날짜 범위 필터 컴포넌트

import React from 'react';
import { format, subMonths } from 'date-fns';

interface DateRangeFilterProps {
    startDate: string;
    endDate: string;
    onDateChange: (startDate: string, endDate: string) => void;
    className?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    startDate,
    endDate,
    onDateChange,
    className = ''
}) => {
    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 ${className}`}>
            <div className="w-full sm:w-auto">
                <label className="block text-sm text-gray-600 mb-1">시작일</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onDateChange(e.target.value, endDate)}
                    className="w-full sm:w-auto px-3 py-2 border rounded-md"
                />
            </div>
            <span className="hidden sm:block">~</span>
            <div className="w-full sm:w-auto">
                <label className="block text-sm text-gray-600 mb-1">종료일</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onDateChange(startDate, e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border rounded-md"
                />
            </div>
            {/* 기간 단축 버튼 */}
            <div className="flex gap-2 ml-2">
                <button
                    onClick={() => {
                        const end = new Date();
                        const start = subMonths(end, 1);
                        onDateChange(
                            format(start, 'yyyy-MM-dd'),
                            format(end, 'yyyy-MM-dd')
                        );
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                    1개월
                </button>
                <button
                    onClick={() => {
                        const end = new Date();
                        const start = subMonths(end, 3);
                        onDateChange(
                            format(start, 'yyyy-MM-dd'),
                            format(end, 'yyyy-MM-dd')
                        );
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                    3개월
                </button>
            </div>
        </div>
    );
};

export default DateRangeFilter; 