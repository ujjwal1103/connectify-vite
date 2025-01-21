import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

import FollowButton from '@/components/shared/FollowButton'
import UsernameLink from '@/components/shared/UsernameLink'
import Avatar from '@/components/shared/Avatar'

import { IUser } from '@/lib/types'

const SuggestionsSlider = ({ username }: { username?: string }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { suggetions, loading } = useGetSuggestedUsers() as any

  // Update scroll buttons visibility
  useEffect(() => {
    const updateScrollButtons = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
      }
    }

    updateScrollButtons()
    scrollRef.current?.addEventListener('scroll', updateScrollButtons)
    return () =>
      scrollRef.current?.removeEventListener('scroll', updateScrollButtons)
  }, [suggetions, loading])

  // Filter suggestions excluding the current user
  const filteredSuggestions = useMemo(
    () => suggetions.filter((person: IUser) => person.username !== username),
    [suggetions, username]
  )

  const handleScrollLeft = () => {
    if (filteredSuggestions.length && scrollRef.current) {
      const { clientWidth } = scrollRef.current
      scrollRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' })
    }
  }

  const handleScrollRight = () => {
    if (filteredSuggestions.length && scrollRef.current) {
      const { clientWidth } = scrollRef.current
      scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="hidden w-full bg-gray-800">
        <div className="m-auto flex flex-col items-center p-4">
          <div className="w-full animate-pulse">
            <div className="mb-2 h-6 w-44 rounded-md bg-gray-600"></div>
            <span className="text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (filteredSuggestions.length <= 11) {
    return null
  }

  return (
    <div ref={scrollContainerRef} className="flex w-full flex-col items-center ">
      <div className="flex items-center justify-between lg:w-192 md:w-160 xl:w-256 sm:w-128 w-screen py-2 px-3 sm:px-0">
        <span className="text-lg font-medium">Suggested for you</span>
        <Link to="/explore" className="text-blue-500 hover:underline">
          See all
        </Link>
      </div>
      <div className="relative lg:w-192 md:w-160 xl:w-256 sm:w-128 w-screen px-3 sm:px-0">
        <div className="absolute top-1/2 z-10 flex w-full -translate-y-1/2 justify-between">
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll Left"
            className="rounded-full bg-gray-700 p-2 text-white disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll Right"
            className="rounded-full bg-gray-700 p-2 mr-5 sm:mr-0 text-white disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
        <div
          ref={scrollRef}
          className="flex snap-x gap-4 overflow-x-auto scrollbar-none"
        >
          <div className="flex h-auto max-h-[30vh] gap-3">
            {filteredSuggestions.map((person: IUser) => (
              <People {...person} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuggestionsSlider

const People = ({ avatar, username, name, _id }: any) => (
  <div className="flex w-36 flex-col items-center justify-between rounded-lg border p-2 dark:border-zinc-500/30">
    <Avatar src={avatar?.url} className={'h-14 w-14 rounded-full'} />
    <div className="flex flex-col justify-center">
      <span className="text-sm">{name}</span>
      <UsernameLink username={username} className="text-xs text-gray-400">
        <span>{username}</span>
      </UsernameLink>
    </div>
    <div className="flex justify-center">
      <FollowButton
        size="sm"
        isFollow={false}
        userId={_id}
        showRemoveFollowerBtn={false}
        isRequested={false}
        isPrivate={false}
      />
    </div>
  </div>
)
