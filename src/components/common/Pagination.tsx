import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    activeColor?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    activeColor = 'bg-gray-700'
}) => {
    return (
        <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 ${
                        currentPage === page 
                            ? `${activeColor} text-white` 
                            : 'border border-gray-300 hover:bg-gray-300'
                    }`}
                >
                    {page}
                </button>
            ))}
        </div>
    );
}; 