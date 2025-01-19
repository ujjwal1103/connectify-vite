import { cn } from '@/lib/utils'
import useNewMessages from '@/zustand/useNewMessages'
import React, { useEffect, useRef, useLayoutEffect, ReactNode } from 'react'

interface InfiniteScrollProps {
  loadMore: () => void
  children: ReactNode
  className?: string
  id?: string
  disableScroll?: boolean
  isAddingContent: boolean
  setIsAddingContent: (isadding: boolean) => void
}

const InfiniteScrollC: React.FC<InfiniteScrollProps> = ({
  loadMore,
  children,
  id,
  disableScroll = false,
  isAddingContent,
  setIsAddingContent,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = useRef(0)
  const { scrollToBottom, setScrollToBottom } = useNewMessages()

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current

    if (scrollContainer && scrollContainer.scrollTop === 0) {
      loadMore()
    }
  }

  useLayoutEffect(() => {
    if (disableScroll) return

    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      const previousScrollHeight = prevScrollHeightRef.current
      const currentScrollHeight = scrollContainer.scrollHeight
      const previousScrollTop = scrollContainer.scrollTop
      scrollContainer.scrollTop =
        currentScrollHeight > previousScrollHeight
          ? scrollContainer.scrollHeight -
            previousScrollHeight +
            previousScrollTop
          : previousScrollTop
    }
  }, [id, disableScroll])

  useEffect(() => {
    if (disableScroll) return

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
    if (disableScroll) return

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      prevScrollHeightRef.current = scrollContainer.scrollHeight
    }
  }, [id, disableScroll])

  useEffect(() => {
    if (isAddingContent) {
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
        setIsAddingContent(false)
      }
    }
  }, [isAddingContent])

  useEffect(() => {
    if (scrollToBottom) {
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        const distanceFromBottom =
          scrollContainer.scrollHeight -
          scrollContainer.scrollTop -
          scrollContainer.clientHeight

        if (distanceFromBottom <= 300) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
          setScrollToBottom(false)
        }
      }
    }
  }, [scrollToBottom])

  return (
    <div className="flex flex-1 flex-col justify-end overflow-hidden bg-zinc-900">
      <div
        ref={scrollContainerRef}
        className={cn(
          'scrollbar-guttor flex flex-col overflow-y-auto scrollbar-thin'
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default InfiniteScrollC
