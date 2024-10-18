import { motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import Tabs from './Tabs'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const Counts = ({
  posts,
  followers,
  following,
  userId,
  canViewFollowers,
}: any) => {
  const location = useLocation()
  const [followersOrFollowing, setFollowersOrFollowing] = useState<
    'following' | 'followers' | null
  >(null)

  useEffect(() => {
    setFollowersOrFollowing(null)
  }, [location.pathname])

  return (
    <div className="flex gap-4 md:gap-10">
      <div className="flex flex-col items-center text-sm md:text-sm md:only:space-x-2">
        <span>{posts}</span>
        <span>Posts</span>
      </div>
      <button
        onClick={() => {
          if (canViewFollowers && followers) {
            setFollowersOrFollowing('followers')
          }
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center text-sm md:space-x-2 md:text-sm',
          {
            'cursor-auto opacity-80': !(canViewFollowers && followers),
          }
        )}
      >
        <span>{followers}</span>
        <span>Followers</span>
      </button>
      <button
        onClick={() => {
          if (canViewFollowers && following) {
            setFollowersOrFollowing('following')
          }
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center text-sm md:space-x-2 md:text-sm',
          {
            'cursor-auto opacity-80': !(canViewFollowers && following),
          }
        )}
      >
        <span>{following}</span>
        <span>Following</span>
      </button>
      {followersOrFollowing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 mx-auto h-dvh w-screen bg-zinc-900 bg-opacity-60 backdrop-blur"
        >
          <button
            className="absolute right-5 top-5 hidden md:block"
            onClick={() => {
              setFollowersOrFollowing(null)
            }}
          >
            <XIcon size={30} />
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="mx-auto md:w-1/2 lg:w-1/3"
          >
            <Tabs
              tabId={'bubble'}
              activeTab={followersOrFollowing}
              userId={userId}
              onClose={() => {
                setFollowersOrFollowing(null)
              }}
              disabledTabs={{
                followers: !(canViewFollowers && followers),
                following: !(canViewFollowers && following),
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default memo(Counts)
