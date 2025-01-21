import Avatar from '@/components/shared/Avatar'
import UsernameLink from '@/components/shared/UsernameLink'
import FollowRequestButtons from './FollowRequestButtons'
import { ChevronLeft } from 'lucide-react'

interface FollowRequestsProps {
  requests: any[]
  onClose: () => void
  handleAccept: (requestId: string, accept: boolean) => void
}

const FollowRequests = ({
  requests = [],
  onClose,
  handleAccept,
}: FollowRequestsProps) => {
  return (
    <>
      <div className="flex w-full justify-between p-2 pb-2">
        <h1 className="flex items-center gap-4 text-2xl font-semibold dark:text-gray-50">
          <button className="text-2xl" onClick={onClose}>
            <ChevronLeft />
          </button>
          Follow Request
        </h1>
      </div>
      <ul className="flex flex-col gap-2">
        {requests?.map((request: any) => (
          <>
            <li className="flex items-center gap-4 p-2">
              <Avatar
                src={request.requestedBy?.avatar?.url}
                className={'size-9 rounded-full'}
              />
              <UsernameLink
                onClick={() => {}}
                className="flex-1"
                username={request.requestedBy.username}
              >
                {request.requestedBy.username}
              </UsernameLink>
              <FollowRequestButtons
                handleAccept={handleAccept}
                requestId={request._id}
              />
            </li>
          </>
        ))}
      </ul>
    </>
  )
}

export default FollowRequests
