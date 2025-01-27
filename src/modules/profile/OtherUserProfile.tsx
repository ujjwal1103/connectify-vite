import Avatar from '@/components/shared/Avatar'
import FollowButton from '@/components/shared/FollowButton'
import { TabControl } from '@/components/shared/TabControl'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Grid, Video } from 'lucide-react'
import { useCallback, useState } from 'react'

import Posts from './components/Posts'
import { PrivateUser } from './components/PrivateUser'
import Reels from './components/Reels'
import Counts from './components/Counts'
import PageLoading from '@/components/shared/Loading/PageLoading'
import PageError from '@/components/shared/Error/PageError'
import useOtherUserProfile from './hooks/useOtherUserProfile'
import FollowRequest from './components/FollowRequest'
import { ACCEPT_REQUEST } from '@/constants/Events'
import useSocketEvents from '@/hooks/useSocketEvent'
import { useSocket } from '@/context/SocketContext'

const tabs = [
  {
    icon: <Grid />,
    name: 'posts',
    id: 'posts',
  },
  {
    icon: <Video />,
    name: 'reels',
    id: 'reels',
  },
]

const OtherUserProfile = () => {
  const { loading, user, initialTab, username, navigate, refetch, setUser } =
    useOtherUserProfile()
  const [selectedTab, setSelectedTab] = useState(initialTab)
  const { socket } = useSocket()

  const handleRefech = useCallback(() => {
    refetch()
  }, [refetch])

  const eventHandlers = {
    [ACCEPT_REQUEST]: handleRefech,
  }

  useSocketEvents(socket, eventHandlers)

  const isPrivateAndNotFollowed = user?.isPrivate && !user?.isFollow

  if (loading) return <PageLoading />

  if (!user && !loading)
    return <PageError message={`User with username ${username} Not Found`} />

  return (
    <div
      className="relative mb-8 h-dvh overflow-x-hidden overflow-y-scroll scrollbar-thin sm:pt-0 md:my-0 md:w-full"
      id="scrollableDiv"
    >
      <div className="w-full text-sm">
        <div className="flex items-center gap-3 border-b border-background/35 p-2 sm:hidden">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft />
          </button>
          <span>{user?.username}</span>
        </div>
        {user?._id && (
          <FollowRequest
            userId={user?._id}
            username={user?.username}
            setUser={setUser}
          />
        )}
        <div className="flex flex-col justify-center gap-3 px-2 py-3 md:mx-auto md:justify-evenly md:px-10 md:py-5 lg:w-4/5">
          <div className="flex justify-center gap-8 sm:justify-start sm:gap-5">
            <div className="flex size-24 flex-col items-center justify-center rounded-full border-zinc-800 p-1 md:size-40 md:flex-row md:border-2">
              <Avatar
                src={user?.avatar?.url}
                name={user?.name}
                className="size-24 md:size-40"
              />
            </div>
            <div className="space-y-2 text-sm md:space-y-3 md:text-sm">
              <div className="flex items-center gap-1 md:gap-3">
                {/* <div className="hidden md:inline">
                  <span>{user?.username}</span>
                </div> */}
                <div className="hidden gap-2 md:flex">
                  <div className="hidden md:block">
                    <span>{username}</span>
                  </div>
                  <FollowButton
                    userId={user?._id!}
                    isFollow={user?.isFollow}
                    showRemoveFollowerBtn={false}
                    isRequested={user?.isRequested}
                    isPrivate={user?.isPrivate}
                    callBack={handleRefech}
                    size={'follow'}
                  />
                  {user?.isFollow && (
                    <Button className="h-6 bg-gradient-to-l from-blue-900 to-violet-900 px-2 py-0.5 text-sm text-white hover:bg-zinc-900 md:h-8">
                      Message
                    </Button>
                  )}
                </div>
              </div>
              <Counts
                posts={user?.posts}
                followers={user?.followers}
                following={user?.following}
                userId={user?._id}
                canViewFollowers={true}
                username={user?.username}
              />
              <div className="md:hidden">
                <span>{user?.username}</span>
              </div>
              <div>
                <span>{user?.name}</span>
              </div>
              <div className="hidden sm:block">
                <pre className="font-sans sm:text-sm">{user?.bio}</pre>
              </div>
            </div>
          </div>
          <div className="sm:hidden">
            <pre className="font-sans sm:text-sm">{user?.bio}</pre>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <FollowButton
              className="h-8 w-full bg-gradient-to-l from-blue-900 to-violet-900 px-2 py-2 text-sm md:h-9 md:px-4 md:text-sm"
              userId={user?._id!}
              isFollow={user?.isFollow}
              showRemoveFollowerBtn={false}
              isRequested={user?.isRequested}
              isPrivate={user?.isPrivate}
              callBack={handleRefech}
              size={'follow'}
            />

            {user?.isFollow && (
              <Button className="h-8 w-full bg-gradient-to-l from-blue-900 to-violet-900 px-2 py-2 text-sm md:h-9 md:px-4 md:text-sm">
                Message
              </Button>
            )}
          </div>
        </div>
        {isPrivateAndNotFollowed ? (
          <PrivateUser username={user?.username} />
        ) : (
          <>
            <TabControl
              tabId={'usersTabs'}
              selectedTab={selectedTab}
              setSelectedTab={(tab: string) => {
                setSelectedTab(tab)
                navigate(`?tab=${tab}`, { replace: true })
              }}
              tabs={tabs}
            />
            {selectedTab === 'posts' && (
              <Posts
                isSelfPosts={false}
                userId={user?._id}
                shouldFetchPosts={(user?.posts ?? 0) > 0}
              />
            )}
            {selectedTab === 'reels' && <Reels />}
          </>
        )}
      </div>
    </div>
  )
}

export default OtherUserProfile
