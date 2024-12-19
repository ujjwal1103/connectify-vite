import Avatar from '@/components/shared/Avatar'
import FollowButton from '@/components/shared/FollowButton'
import { TabControl } from '@/components/shared/TabControl'
import { Button } from '@/components/ui/button'
import { Grid, Video } from 'lucide-react'
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
      className="relative flex min-h-dvh w-screen flex-1 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-none md:w-full md:flex-1"
      id="scrollableDiv"
    >
      <div className="min-w-screen flex-1 text-sm md:w-auto md:text-sm">
        {user?._id && (
          <FollowRequest
            userId={user?._id}
            username={user?.username}
            setUser={setUser}
          />
        )}
        <div className="flex justify-center gap-6  px-2 py-3 md:mx-auto mdjustify-evenly md:px-10 md:py-5 lg:w-[80%]">
          <div className="flex size-[90px] flex-col items-center justify-center rounded-full border-zinc-800 p-[4px] md:size-[162px] md:flex-row md:border-2">
            <Avatar

              src={user?.avatar?.url}
              name={user?.name}
              className="size-[90px] md:size-[150px] select-none pointer-events-none"
            />
          </div>
          <div className="space-y-2 text-sm md:space-y-3 md:text-sm">
            <div className="flex items-center gap-1 md:gap-3">
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
            <Counts
              posts={user?.posts}
              followers={user?.followers}
              following={user?.following}
              userId={user?._id}
              canViewFollowers={!isPrivateAndNotFollowed}
            />
            <div className='hidden md:block'>
              <span>{user?.name}</span>
            </div>
            <div className="hidden md:block">
              <pre className="text-sm font-sans">{user?.bio}</pre>
            </div>
          </div>
        </div>
        <div className="mx-5 mb-5 space-y-2 block md:hidden">
          <div>
            <span>{user?.name}</span>
          </div>
          <div className="block md:hidden">
            <pre className="text-xs">{user?.bio}</pre>
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
              <Posts isSelfPosts={false} userId={user?._id} />
            )}
            {selectedTab === 'reels' && <Reels />}
          </>
        )}
      </div>
    </div>
  )
}

export default OtherUserProfile
