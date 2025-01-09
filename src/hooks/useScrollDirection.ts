import { useState, useEffect } from 'react'

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY === 0) {
        setIsScrollingDown(false)
        return
      }

      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 64)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return isScrollingDown
} 