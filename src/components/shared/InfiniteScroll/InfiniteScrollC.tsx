import { cn } from '@/lib/utils'
import useNewMessages from '@/zustand/useNewMessages'
import React, { useEffect, useRef, useLayoutEffect, ReactNode } from 'react'

interface InfiniteScrollProps {
  loadMore: () => void
  children: ReactNode
  className?: string
  id?: string
  isAddingContent: boolean
  setIsAddingContent: (isadding: boolean) => void
  setLastMessageId: React.Dispatch<React.SetStateAction<string | null>>
  lastMessageId: string | null
}

const InfiniteScrollC: React.FC<InfiniteScrollProps> = ({
  loadMore,
  children,
  id,
  isAddingContent,
  setIsAddingContent,
  setLastMessageId,
  lastMessageId,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageScrollPosition = useRef(0)
  const prevScrollHeightRef = useRef(0)
  const { scrollToBottom, setScrollToBottom } = useNewMessages()

  const scrollToLastElement = () => {
    if (lastMessageId) {
      const lastElement = document.getElementById(lastMessageId)
      if (lastElement) {
        lastElement.scrollIntoView({
          block: 'center', // Scroll to the start of the element
        })
      }
      setLastMessageId(null)
    }
  }

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current

    if (scrollContainer && scrollContainer.scrollTop === 0) {
      lastMessageScrollPosition.current = scrollContainer.scrollHeight
      loadMore()
    }
  }

  useLayoutEffect(() => {
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
  }, [id])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [id])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      prevScrollHeightRef.current = scrollContainer.scrollHeight
    }
  }, [id])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (lastMessageId && scrollContainer) {
      scrollToLastElement()
    }
  }, [lastMessageId])

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
