import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

import FollowButton from '@/components/shared/FollowButton'
import UsernameLink from '@/components/shared/UsernameLink'
import Avatar from '@/components/shared/Avatar'

import { IUser } from '@/lib/types'

const SuggetionsSlider = ({ username }: { username?: string }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const { suggetions, loading } = useGetSuggestedUsers() as any

  const scrollRef = useRef<HTMLDivElement>(null)

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

    return () => {
      scrollRef.current?.removeEventListener('scroll', updateScrollButtons)
    }
  }, [JSON.stringify(suggetions)])

  const handleScrollLeft = () => {
    if (suggetions.length && scrollRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } = scrollRef.current
      const scroll = scrollLeft + clientWidth - scrollWidth
      const absScroll = Math.abs(scroll)
      const left =
        absScroll < clientWidth ? clientWidth + absScroll : clientWidth
      scrollRef.current.scrollBy({ left: -left, behavior: 'smooth' })
    }
  }
  const handleScrollRight = () => {
    if (suggetions.length && scrollRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } = scrollRef.current

      const scroll = scrollLeft + clientWidth - scrollWidth
      const absScroll = Math.abs(scroll)
      scrollRef.current.scrollBy({
        left: absScroll < clientWidth ? clientWidth + absScroll : clientWidth,
        behavior: 'smooth',
      })
    }
  }

  if (loading) {
    return (
      <div className="hidden w-20 bg-[#0D0D0D]">
        <div className="m-auto flex w-[50%] flex-col items-center">
          <div className="flex w-full justify-start p-2">
            <span className="h-6 w-44 rounded-md bg-zinc-800"></span>
          </div>
          loading
        </div>
      </div>
    )
  }

  if (
    suggetions.filter((people: IUser) => people.username !== username)
      .length === 0
  ) {
    return null
  }

  return (
    <div className=" ">
      <div className="flex justify-between p-2">
        <span>Suggested for you</span>
        <Link to="/explore">See all</Link>
      </div>
      <div className="z-1 relative">
        <div className="absolute top-1/2 z-10 mb-2 flex w-full -translate-y-1/2 justify-between px-2">
          <button
            className="absoulute left-0 ml-2 rounded border bg-background p-1 text-sm disabled:opacity-50"
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronLeft />
          </button>
          <button
            className="absoulute right-0 mr-2 rounded border bg-background p-1 text-sm disabled:opacity-50"
            onClick={handleScrollRight}
            disabled={!canScrollRight}
          >
            <ChevronRight />
          </button>
        </div>
        <div
          ref={scrollRef}
          className="relative snap-x overflow-hidden overflow-x-scroll scrollbar-none"
        >
          <div className="inline-flex h-44 max-h-44 snap-center">
            {suggetions
              .filter((people: IUser) => people.username !== username)
              ?.map((people: IUser) => {
                return <People key={people._id} {...people} />
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuggetionsSlider

const People = ({ avatar, username, name, _id }: any) => (
  <div className="mx-2 mb-2 flex w-36 flex-col items-center justify-between rounded-lg border p-2 dark:border-zinc-500/30">
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
