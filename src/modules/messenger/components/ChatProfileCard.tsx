import Avatar from '@/components/shared/Avatar'
import { Button } from '@/components/ui/button'
import { IChat } from '@/lib/types'
import { useChatSlice } from '@/redux/services/chatSlice'
import { InfoIcon, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import AddGroupMembers from './AddGroupMembers'
import { getCurrentUserId } from '@/lib/localStorage'

interface ChatProfileCardProps {
  chat?: IChat | null
}

const ChatProfileCard = ({ chat }: ChatProfileCardProps) => {
  if (!chat) return

  const { isGroup, groupAvatar, groupName, friend, createdBy, members } = chat
  const {toggleShowChat} = useChatSlice()

  const avatar = isGroup ? groupAvatar?.url : friend.avatar?.url
  const name = isGroup ? groupName : friend.name
  const username = isGroup ? groupName : friend.username
  const createdByName = members?.find(
    (member) => member._id === createdBy
  )?.name

  const isMeAdmin = members
  ?.filter((m) => m.role === 'admin')
  .some((m) => m._id === getCurrentUserId())
  
  return (
    <div className="mb-2 flex w-full flex-col items-center justify-center gap-2">
      <div className="flex md:w-96 w-80 items-center justify-center rounded bg-background p-3 py-5">
        <div className="flex flex-col items-center justify-center rounded-full">
          <Avatar className="mb-2 size-28" src={avatar} resize={300} />
          {isGroup ? (
            <>
              <div className="md:text-2xl w-full text-center text-xl text-wrap font-semibold text-ellipsis">
                {createdByName} created this group
              </div>
              <div>{members?.length} members</div>

              <div className="py-2">
                <Button
                  onClick={toggleShowChat}
                  variant={'secondary'}
                  className="space-x-2"
                >
                  <span>
                    <InfoIcon size={14} absoluteStrokeWidth={true} />
                  </span>
                  <span>Group Info</span>
                </Button>
              </div>
            {isMeAdmin &&  <AddGroupMembers
                chatId={chat?._id}
                members={chat!.members!.map(m=>m._id)}
              >
              <div className="py-2">
                <Button
                  disabled={members!.length >= 10}
                  variant={'secondary'}
                  className="space-x-2"
                >
                  <span>
                    <UserPlus size={14} absoluteStrokeWidth={true} />
                  </span>
                  <span>Add Members</span>
                </Button>
              </div>
              </AddGroupMembers>}
            </>
          ) : (
            <>
              <span className="text-lg font-semibold">{name}</span>
              <span className="mb-4">{username}</span>
              <Button variant={'secondary'}>
                <Link to={`/u/${username}`}>View Profile</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatProfileCard
