import { getFollowers } from '@/api'
import Avatar from '@/components/shared/Avatar'
import People from '@/components/shared/People'
import { IUser } from '@/lib/types'
import { X } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useFollow } from '../hooks/useFollow'
import { useState } from 'react'

const Followers = ({ userId }: { userId: string }) => {
  const [query, setQuery] = useState<string>('')

  const {
    data: followers,
    isLoading,
    error,
    handleLoadMore,
    hasNextPage,
  } = useFollow(getFollowers, userId, query, 'followers')

  if (error) return <div>Something Went Wrong</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div className="h-full w-full" id="scrollableDiv">
      <div>
        <div className="mx-2 my-2 flex h-10 items-center rounded-md bg-neutral-900">
          <input
            autoFocus={false}
            className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-[#a8a8a8] focus:outline-none"
            placeholder="Search followers..."
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            value={query}
          />
          {query && (
            <span
              className="mr-2 cursor-pointer rounded-full bg-gray-300 text-[#262626]"
              onClick={() => {
                setQuery('')
              }}
            >
              <X size={16} />
            </span>
          )}
        </div>
      </div>
      <InfiniteScroll
        dataLength={followers?.length}
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
        scrollableTarget={'scrollableDiv'}
      >
        {followers?.map((people: IUser) => {
          return <People key={people._id} people={people} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default Followers

// const [followers, setFollowers] = useState<IUser[]>([])
// const [isLoading, setIsLoading] = useState<boolean>(false)
// const [page, setPage] = useState<number>(1)

// const [error, setError] = useState<boolean>(false)
// const [hasNextPage, setHasNextPage] = useState<boolean>(false)

// const fetchFollowers = useCallback(async () => {
//   try {
//     setIsLoading(true)
//     const res = (await getFollowers(page, userId, query)) as any
//     setFollowers((prev: IUser[]) => [...prev, ...res.followers])
//     setHasNextPage(res.pagination.hasNext)
//   } catch (error) {
//     setError(false)
//   } finally {
//     setIsLoading(false)
//   }
// }, [page, query])

// const handleLoadMore = () => {
//   if (hasNextPage) {
//     setPage(page + 1)
//   }
// }

// useEffect(() => {
//   fetchFollowers()
// }, [fetchFollowers])
