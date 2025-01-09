interface ContainerProps {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
}

export function Container({ children, fluid = false, className = '' }: ContainerProps) {
  return (
    <div className={`
      mx-auto
      px-4 sm:px-5 lg:px-6
      ${fluid ? 'w-full' : 'max-w-[1440px]'}
      ${className}
    `}>
      {children}
    </div>
  )
} 