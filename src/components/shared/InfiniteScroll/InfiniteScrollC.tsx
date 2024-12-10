import React, { useEffect, useRef, useLayoutEffect, ReactNode } from 'react'

interface InfiniteScrollProps {
  loadMore: () => void
  children: ReactNode
  className?: string
  id?: string
  disableScroll?: boolean // New prop to control scroll behavior
}

const InfiniteScrollC: React.FC<InfiniteScrollProps> = ({
  loadMore,
  children,
  className,
  id,
  disableScroll = false, // Default is false (scroll behavior is enabled)
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = useRef(0)

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current

    if (scrollContainer && scrollContainer.scrollTop === 0) {
      loadMore()
    }
  }

  useLayoutEffect(() => {
    if (disableScroll) return // Skip if scrolling is disabled

    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      const previousScrollTop = scrollContainer.scrollTop
      const previousScrollHeight = prevScrollHeightRef.current
      scrollContainer.scrollTop =
        scrollContainer.scrollHeight - previousScrollHeight + previousScrollTop
    }
  }, [children, id, disableScroll])

  useEffect(() => {
    if (disableScroll) return // Skip if scrolling is disabled

    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [id, disableScroll])

  useEffect(() => {
    if (disableScroll) return // Skip if scrolling is disabled

    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      prevScrollHeightRef.current = scrollContainer.scrollHeight
    }
  }, [children, id, disableScroll])

  return (
    <div ref={scrollContainerRef} className={className}>
      {children}
    </div>
  )
}

export default InfiniteScrollC
