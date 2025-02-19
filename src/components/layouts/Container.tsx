interface ContainerProps {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
}

export function Container({ children, fluid = false, className = '' }: ContainerProps) {
  // className에서 max-width 관련 클래스가 있는지 확인
  const hasMaxWidth = className.includes('max-w-');
  
  return (
    <div className={`
      mx-auto
      px-4 sm:px-5 lg:px-6
      ${fluid ? 'w-full' : hasMaxWidth ? '' : 'max-w-[1200px]'}
      ${className}
    `}>
      {children}
    </div>
  )
} 