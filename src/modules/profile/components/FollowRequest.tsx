import { getRequest } from '@/api'
import FollowRequestButtons from '@/modules/notifications/FollowRequestButtons'
import { useEffect, useState } from 'react'

interface Props {
  userId: string
  username: string
}

const FollowRequest = ({ userId, username }: Props) => {
  const [request, setRequest] = useState<any>(null)

  useEffect(() => {
    const getCurrentReq = async () => {
      const res = (await getRequest(userId)) as any
      setRequest(res.request)
    }

    getCurrentReq()
  }, [userId])

  if(!request) return null;

  return (
    
      <div className='flex items-center justify-center  border-border border-b p-4 gap-4'>
        <span>{username} want to Follow you.</span>
        <FollowRequestButtons
          handleAccept={() => {}}
          requestId={request?._id}
        />
      </div>

  )
}

export default FollowRequest
