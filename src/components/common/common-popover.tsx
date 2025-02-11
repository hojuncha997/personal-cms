// components/common/popover.tsx
import React, { useState } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

interface CommonPopoverProps {
  trigger: React.ReactNode; // 팝오버를 열 트리거 요소
  children: React.ReactNode; // 팝오버 내용
  placement?: 'top' | 'bottom' | 'left' | 'right'; // 팝오버가 나타날 위치
  offset?: number; // 트리거로부터의 거리
  className?: string; // 추가 스타일링
  onOpenChange?: (open: boolean) => void; // 팝오버 열림/닫힘 이벤트 핸들러
  placementOffset?: string; // 위치 오프셋 (예: '100%', '50px' 등)
  //  minWidth?: string;    // 최소 너비
  //  minHeight?: string;   // 최소 높이
  //  padding?: string;     // 패딩
}

export function CommonPopover({
  trigger,
  children,
  placement = 'bottom',
  offset = 8,
  className,
  onOpenChange,
  placementOffset = '100%',
  //  minWidth = '12rem',
  //  minHeight = '10rem',
  //  padding = '3'
}: CommonPopoverProps) {
  console.log("placement : ", placement)
  const [open, setOpen] = useState(false)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  // 위치에 따른 스타일 계산
  const getPlacementStyle = () => {
    switch (placement) {
      case 'top':
        return `bottom-[${placementOffset}] mb-${offset} `
      case 'bottom':
        return `top-[${placementOffset}] mt-${offset} `
      case 'left':
        return ` right-[${placementOffset}] mr-${offset} `
      case 'right':
        return `left-[${placementOffset}] ml-${offset} `
      default:
        return ''
    }
  }

  console.log("getPlacementStyle(): ", getPlacementStyle())

  return (
    // root는 팝오버의 최상위 컴포넌트
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      {/* trigger는 팝오버를 열 트리거 요소 */}
      <PopoverPrimitive.Trigger asChild>
        {trigger}
      </PopoverPrimitive.Trigger>

      {/* portal은 팝오버를 렌더링할 포탈 요소 */}
      <PopoverPrimitive.Portal>
        {/* content는 팝오버 내용을 렌더링할 컨텐츠 요소 */}
        <PopoverPrimitive.Content
          className={`
           z-50 
          
           border 
           border-black 
           bg-[#ffffff] 
           rounded-xl
           
           outline-none 
           data-[state=open]:animate-in 
           data-[state=closed]:animate-out 
           data-[state=closed]:fade-out-0 
           data-[state=open]:fade-in-0 
           data-[state=closed]:zoom-out-95 
           data-[state=open]:zoom-in-95 
           ${getPlacementStyle()}
           ${className}
         `}
          side={placement}
          sideOffset={offset}
          align="end"
          alignOffset={parseInt(placementOffset)}
        >
          {/* children은 팝오버 내용을 렌더링할 자식 요소 */}
          {children}
          {/* arrow는 팝오버 화살표 요소 */}
          <PopoverPrimitive.Arrow className="fill-current text-white" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}