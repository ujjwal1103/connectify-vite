import Avatar from '@/components/shared/Avatar'
import { Button } from '@/components/ui/button'
import { IUser } from '@/lib/types'
import { Link } from 'react-router-dom'

interface ChatProfileCardProps {
  friend: IUser
}

const ChatProfileCard = ({ friend }: ChatProfileCardProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 mb-2">
      <div className="flex">
        <div className="flex flex-col items-center justify-center rounded-full">
          <Avatar className="mb-2 size-28" src={friend?.avatar?.url} />
          <span className="text-lg font-semibold">{friend?.name}</span>
          <span className="mb-4">{friend?.username}</span>
          <Button variant={'secondary'}>
            <Link to={`/u/${friend.username}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatProfileCard
