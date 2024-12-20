import Avatar from '@/components/shared/Avatar'
import { Button } from '@/components/ui/button'
import { InfoIcon, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import AddGroupMembers from './AddGroupMembers'
import { getCurrentUserId } from '@/lib/localStorage'
import { memo } from 'react'
import { useChat } from '@/redux/services/chatSlice'
const ChatProfileCard = () => {
  const { selectedChat, toggleShowChat } = useChat()

  if (!selectedChat) return

  const { isGroup, groupAvatar, groupName, friend, createdBy, members, _id } =
    selectedChat

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
    <div className="mb-2 mt-3 flex w-full flex-col items-center justify-center gap-2">
      <div className="flex w-80 items-center justify-center rounded bg-background p-3 py-5 md:w-96">
        <div className="flex flex-col items-center justify-center rounded-full">
          <Avatar className="mb-2 size-28" src={avatar} resize={300} />
          {isGroup ? (
            <>
              <div className="w-full text-ellipsis text-wrap text-center text-xl font-semibold md:text-2xl">
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
              {isMeAdmin && (
                <AddGroupMembers
                  chatId={_id}
                  members={members!.map((m) => m._id)}
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
                </AddGroupMembers>
              )}
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

export default memo(ChatProfileCard)
