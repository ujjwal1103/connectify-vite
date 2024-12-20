import Avatar from '@/components/shared/Avatar'
import { TabControl } from '@/components/shared/TabControl'
import { Button } from '@/components/ui/button'
import { Bookmark, Grid } from 'lucide-react'
import { IoIosSettings } from 'react-icons/io'
import { Link, useSearchParams } from 'react-router-dom'
import Posts from './components/Posts'
import SavedPost from './components/SavedPost'
import Counts from './components/Counts'
import PageLoading from '@/components/shared/Loading/PageLoading'
import PageError from '@/components/shared/Error/PageError'
import { useAuth } from '@/context/AuthContext'

const tabs = [
  {
    icon: <Grid />,
    name: 'posts',
    id: 'posts',
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
      className="relative mb-8 mt-10 flex h-dvh min-h-dvh w-screen flex-1 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-none md:mb-0 md:mt-0 md:w-full md:flex-1"
      id="scrollableDiv"
    >
      <div className="w-screen flex-1 text-sm md:w-full md:text-sm">
        <div className="flex justify-center gap-3 px-2 py-3 md:mx-auto md:justify-evenly md:px-10 md:py-5 lg:w-[80%]">
          <div className="flex size-[90px] flex-col items-center justify-center rounded-full border-zinc-800 p-[4px] md:size-[162px] md:flex-row md:border-2">
            <Avatar
              src={user?.avatar?.url}
              name={user?.name}
              className="size-[90px] md:size-[150px]"
            />
          </div>
          <div className="space-y-2 text-sm md:space-y-3 md:text-sm">
            <div className="flex items-center gap-1 md:gap-3">
              <div className="hidden md:inline">
                <span>{user?.username}</span>
              </div>
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
            <Counts
              posts={user?.posts}
              followers={user?.followers}
              following={user?.following}
              userId={user?._id}
              canViewFollowers={true}
            />
            <div className="">
              <span>{user?.name}</span>
            </div>
            <div>
            <pre className="text-txs md:text-sm font-sans">{user?.bio}</pre>
            </div>
          </div>
        </div>
        <TabControl
          tabId={'tabs'}
          selectedTab={tab}
          setSelectedTab={handleTabChange}
          tabs={tabs}
        />
        {tab === 'posts' && <Posts />}
        {tab === 'saved' && <SavedPost />}
      </div>
    </div>
  )
}

export default SelfProfile
