import { memo, useEffect, useState } from 'react'

import { Button } from '../ui/button'
import { isCurrentUser } from '@/lib/localStorage'
import {
  cancelFollowRequest,
  followUsers,
  sentFriendRequest,
  unFollowUsers,
} from '@/api'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { IUser } from '@/lib/types'

type FollowButtonProps = {
  userId: string
  callBack?: (data: any, error?: any) => void
  isFollow?: boolean
  showRemoveFollowerBtn: boolean
  isRequested?: boolean
  isPrivate?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'follow' | null | undefined
}

const FollowButton = ({
  userId,
  callBack = () => {},
  isFollow = false,
  showRemoveFollowerBtn = false,
  isRequested = false,
  isPrivate = true,
  size = 'sm',
}: FollowButtonProps) => {
  const [follow, setFollow] = useState(isFollow)
  const [isRequestSent, setIsRequestSent] = useState(false)
  const { updateUser } = useAuth()

  useEffect(() => {
    setIsRequestSent(isRequested)
    setFollow(isFollow)
  }, [isRequested, isFollow])

  const handleFollowRequest = async () => {
    try {
      if (isPrivate) {
        setIsRequestSent(true)
        await sentFriendRequest(userId)
      } else {
        setFollow(true)
        callBack({ isFollow: true })
        updateUser((prev: IUser | null) =>
          prev ? { ...prev, following: prev.following + 1 } : null
        )
        const data = await followUsers(userId)
        if (data.follow) {
          toast.success('Started Following')
        }
      }
    } catch (error: any) {
      if ((error.message = 'ALREADY_FOLLOWING')) {
        setFollow(false)
        updateUser((prev: IUser | null) =>
          prev ? { ...prev, following: prev.following - 1 } : null
        )
        callBack(null, error)
      }
      toast.error('Already Follow This User')
    }
  }
  const handleCancelFollowRequest = async () => {
    if (isPrivate) {
      setIsRequestSent(false)
      await cancelFollowRequest(userId)
    }
  }

  const handleUnfollow = async () => {
    if (!follow) return
    const data = await unFollowUsers(userId)
    if (data.unfollow) {
      setFollow(false)
      callBack(data)
    }
  }

  if (isCurrentUser(userId)) {
    return <span></span>
  }

  if (showRemoveFollowerBtn) {
    return (
      <Button
        className="bg-gradient-to-l from-blue-900 to-violet-900 px-2 py-0.5 text-sm text-sky-100 md:h-8"
        onClick={handleUnfollow}
        size={size}
      >
        Remove
      </Button>
    )
  }
  if (isRequestSent) {
    return (
      <Button
        className="bg-zinc-900 px-2 py-0.5 text-sky-100 hover:bg-zinc-800"
        onClick={handleCancelFollowRequest}
        size={size}
      >
        Requested
      </Button>
    )
  }

  if (follow) {
    return (
      <Button variant="following" onClick={handleUnfollow} size={size}>
        Following
      </Button>
    )
  }

  return (
    <Button onClick={handleFollowRequest} size={size} variant={'follow'}>
      Follow
    </Button>
  )
}

export default memo(FollowButton)
