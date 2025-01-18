import Avatar from '@/components/shared/Avatar'
import { TabControl } from '@/components/shared/TabControl'
import { Button } from '@/components/ui/button'
import { Bookmark, Grid, VideoIcon } from 'lucide-react'
import { IoIosSettings } from 'react-icons/io'
import { Link, useSearchParams } from 'react-router-dom'
import Posts from './components/Posts'
import SavedPost from './components/SavedPost'
import Counts from './components/Counts'
import PageLoading from '@/components/shared/Loading/PageLoading'
import PageError from '@/components/shared/Error/PageError'
import { useAuth } from '@/context/AuthContext'
import Reels from './components/Reels'

const tabs = [
  {
    icon: <Grid />,
    name: 'posts',
    id: 'posts',
  },
  {
    icon: <VideoIcon />,
    name: 'reels',
    id: 'reels',
  },
  {
    icon: <Bookmark />,
    name: 'saved',
    id: 'saved',
  },
]

const SelfProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'posts'
  const { user, loading } = useAuth()

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab }, { replace: true })
  }

  if (loading) return <PageLoading />

  if (!user && !loading) return <PageError message="User Not Found" />

  return (
    <div
      className="relative mb-8 flex h-dvh min-h-dvh w-screen flex-1 overflow-x-hidden overflow-y-scroll pt-16 scrollbar-thin scrollbar-none md:mb-0 md:mt-0 md:w-full md:flex-1 md:pt-0"
      id="scrollableDiv"
    >
      <div className="w-screen flex-1 text-sm md:w-full md:text-sm">
        <div className="flex flex-col justify-center gap-3 px-2 py-3 md:mx-auto md:justify-evenly md:px-10 md:py-5 lg:w-4/5">
          <div className="flex gap-5">
            <div className="flex size-24 flex-col items-center justify-center rounded-full border-zinc-800 p-1 md:size-40 md:flex-row md:border-2">
              <Avatar
                src={user?.avatar?.url}
                name={user?.name}
                className="size-24 md:size-40"
              />
            </div>
            <div className="space-y-2 text-sm md:space-y-3 md:text-sm">
              <div className="flex items-center gap-1 md:gap-3">
                <div className="hidden md:inline">
                  <span>{user?.username}</span>
                </div>
                <div className="hidden gap-2 md:flex">
                  <Button asChild>
                    <Link
                      to="/edit"
                      className="h-5 px-2 text-sm md:h-9 md:px-4 md:text-sm"
                    >
                      Edit Profile
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      to="/archives"
                      className="h-5 px-2 text-sm md:h-9 md:px-4 md:text-sm"
                    >
                      View Archive
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      to="/edit?tab=settings"
                      className="h-5 px-2 text-sm md:h-9 md:px-4 md:text-sm"
                    >
                      <IoIosSettings size={24} className="size-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Counts
                posts={user?.posts}
                followers={user?.followers}
                following={user?.following}
                userId={user?._id}
                canViewFollowers={true}
              />
              <div>
                <span>{user?.username}</span>
              </div>
              <div>
                <span>{user?.name}</span>
              </div>
              <div className="hidden md:block">
                <pre className="font-sans text-txs md:text-sm">{user?.bio}</pre>
              </div>
            </div>
          </div>
          <div className='md:hidden'>
            <pre className="font-sans text-txs md:text-sm">{user?.bio}</pre>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Button asChild>
              <Link
                to="/edit"
                className="h-8 w-full px-2 py-2 text-sm md:h-9 md:px-4 md:text-sm"
              >
                Edit Profile
              </Link>
            </Button>
            <Button asChild>
              <Link
                to="/archives"
                className="h-8 w-full px-2 text-sm md:h-9 md:px-4 md:text-sm"
              >
                View Archive
              </Link>
            </Button>
          </div>
        </div>
        <TabControl
          tabId={'tabs'}
          selectedTab={tab}
          setSelectedTab={handleTabChange}
          tabs={tabs}
        />
        {tab === 'posts' && <Posts />}
        {tab === 'reels' && <Reels />}
        {tab === 'saved' && <SavedPost />}
      </div>
    </div>
  )
}

export default SelfProfile;
