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
  username,
}: any) => {
  const location = useLocation()
  const [followersOrFollowing, setFollowersOrFollowing] = useState<
    'following' | 'followers' | null
  >(null)

  useEffect(() => {
    setFollowersOrFollowing(null)
  }, [location.pathname])

  return (
    <div className="flex gap-8 md:gap-10">
      <div className="flex flex-col items-center w-14 text-sm md:text-sm md:only:space-x-2">
        <span className='text-base'>{posts}</span>
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
        <span className='text-base'>{followers}</span>
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
        <span className='text-base'>{following}</span>
        <span>Following</span>
      </button>
      {followersOrFollowing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 mx-auto sm:mx-0 sm:ml-[10.7%] md:ml-0 h-dvh sm:w-[89.9%] md:w-screen md:max-auto bg-opacity-60 backdrop-blur-sm"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              username={username}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default memo(Counts)
