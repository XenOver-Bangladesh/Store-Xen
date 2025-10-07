import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTopRAF, resetScrollPosition } from '../../utils/scrollUtils'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Reset scroll position immediately for instant effect
    resetScrollPosition()
    
    // Then use smooth scrolling for better UX
    scrollToTopRAF()
  }, [pathname])

  return null
}

export default ScrollToTop
