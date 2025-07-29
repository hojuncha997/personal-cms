import React from 'react';

type SkeletonProps = {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  circle?: boolean;
};

type CategorySkeletonProps = {
  count?: number;
  className?: string;
};

/**
 * 기본 스켈레톤 컴포넌트
 */
export const Skeleton = ({
  className = '',
  count = 1,
  height = '10',
  width = 'full',
  circle = false,
}: SkeletonProps) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`bg-gray-200 animate-pulse ${className} ${
              circle ? 'rounded-full' : 'rounded-md'
            } h-${height} w-${width} mb-2`}
          />
        ))}
    </>
  );
};

/**
 * 카테고리 목록을 위한 스켈레톤 컴포넌트
 */
export const CategorySkeleton = ({
  count = 3,
  className = '',
}: CategorySkeletonProps) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <li key={i} className={`animate-pulse ${className}`}>
            <div className="block p-2 rounded-md bg-gray-200 h-10 w-full" />
          </li>
        ))}
    </>
  );
};

export default Skeleton; 