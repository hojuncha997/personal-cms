import { useState, useEffect, useRef } from 'react'

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY === 0) {
        setIsScrollingDown(false)
        return
      }

      setIsScrollingDown(currentScrollY > lastScrollY.current && currentScrollY > 64)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return isScrollingDown
} 