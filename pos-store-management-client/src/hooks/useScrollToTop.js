import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTopRAF, resetScrollPosition } from '../utils/scrollUtils'

/**
 * Custom hook to automatically scroll to top on route changes
 * @param {boolean} smooth - Whether to use smooth scrolling
 * @param {number} delay - Delay in milliseconds before scrolling
 */
export const useScrollToTop = (smooth = true, delay = 0) => {
  const location = useLocation()

  useEffect(() => {
    const scroll = () => {
      if (smooth) {
        scrollToTopRAF()
      } else {
        resetScrollPosition()
      }
    }

    if (delay > 0) {
      const timer = setTimeout(scroll, delay)
      return () => clearTimeout(timer)
    } else {
      scroll()
    }
  }, [location.pathname, smooth, delay])
}

/**
 * Hook to scroll to top on component mount
 * @param {boolean} smooth - Whether to use smooth scrolling
 */
export const useScrollToTopOnMount = (smooth = true) => {
  useEffect(() => {
    if (smooth) {
      scrollToTopRAF()
    } else {
      resetScrollPosition()
    }
  }, [smooth])
}

export default useScrollToTop
