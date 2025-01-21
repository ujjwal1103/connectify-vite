import { getRequest } from '@/api'
import { makeRequest } from '@/config/api.config'
import { useAuth } from '@/context/AuthContext'
import { IUser } from '@/lib/types'
import FollowRequestButtons from '@/modules/notifications/FollowRequestButtons'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  userId: string
  username: string
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const FollowRequest = ({ userId, username, setUser }: Props) => {
  const [request, setRequest] = useState<any>(null)
  const { updateUser, user } = useAuth()

  const getCurrentReq = useCallback(async () => {
    const res = (await getRequest(userId)) as any
    setRequest(res.request)
  }, [userId])

  useEffect(() => {
    getCurrentReq()
  }, [getCurrentReq])

  const handleAccept = async (reqId: string, accept: boolean) => {
    try {
      if (accept) {
        await makeRequest.patch(`/accept/${reqId}`)
        setUser((prevUser) => {
          if (prevUser) {
            return { ...prevUser, following: prevUser.following + 1 }
          }
          return prevUser
        })
        updateUser({ ...user!, followers: user!.followers + 1 })
      } else {
        await makeRequest.patch(`/accept/${reqId}?reject=true`)
      }
      getCurrentReq()
    } catch (error) {
      console.error('Error handling request:', error)
    }
  }
  if (!request) return null

  return (
    <div className="flex items-center justify-center gap-4 border-b border-border p-4">
      <span>{username} want to Follow you.</span>
      <FollowRequestButtons
        handleAccept={handleAccept}
        requestId={request?._id}
      />
    </div>
  )
}

export default FollowRequest
