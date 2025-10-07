import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import Button from '../UI/Button'
import { scrollToTop } from '../../utils/scrollUtils'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const handleScrollToTop = () => {
    scrollToTop(true)
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={handleScrollToTop}
      className="fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
      title="Scroll to top"
    >
      <ChevronUp className="w-5 h-5" />
    </Button>
  )
}

export default ScrollToTopButton
