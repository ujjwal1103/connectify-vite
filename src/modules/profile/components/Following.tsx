import { getFollowing } from '@/api'
import Avatar from '@/components/shared/Avatar'
import People from '@/components/shared/People'
import { IUser } from '@/lib/types'
import { X } from 'lucide-react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useFollow } from '../hooks/useFollow'

const Following = ({ userId }: { userId: string }) => {
  const [query, setQuery] = useState<string>('')

  const {
    data: following,
    error,
    handleLoadMore,
    hasNextPage,
  } = useFollow(getFollowing, userId, query, 'following')

  if (error) return <div>Something Went Wrong</div>

  return (
    <div className="h-full w-full">
      <div>
        <div className="mx-2 my-2 flex h-10 items-center rounded-md bg-neutral-900">
          <input
            autoFocus={false}
            className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-[#a8a8a8] focus:outline-none"
            placeholder="Search following..."
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            value={query}
          />
          {query && (
            <span
              className="mr-2 cursor-pointer rounded-full bg-gray-300 text-[#262626]"
              onClick={() => {
                //   setFocused(false);
                setQuery('')
              }}
            >
              <X size={16} />
            </span>
          )}
        </div>
      </div>
      <InfiniteScroll
        dataLength={following?.length}
        next={handleLoadMore}
        hasMore={hasNextPage}
        loader={[12, 23, 34].map(() => (
          <li className="flex w-full items-center gap-3 px-2 py-2">
            <Avatar
              src="people"
              className={'h-8 w-8 rounded-full bg-gray-600'}
            />
            <div className="flex flex-col gap-2">
              <span className="h-4 w-24 rounded-md bg-zinc-800"></span>
              <span className="h-4 w-16 rounded-md bg-zinc-800"></span>
            </div>
            <div className="ml-auto mr-10 self-center">
              <button className="h-6 w-14 rounded bg-zinc-800"></button>
            </div>
          </li>
        ))}
        scrollableTarget={'scrollfollowers'}
      >
        {following?.map((people: IUser) => {
          return <People key={people._id} people={people} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default Following
