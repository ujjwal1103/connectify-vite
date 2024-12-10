import { updateGroupName } from '@/api'
import Avatar from '@/components/shared/Avatar'
import UsernameLink from '@/components/shared/UsernameLink'
import { IChat, IUser } from '@/lib/types'
import { useChatSlice } from '@/redux/services/chatSlice'
import { useClickOutside } from '@react-hookz/web'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  MoreHorizontal,
  PencilLineIcon,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import AddGroupMembers from './AddGroupMembers'
import DropDownMenu from '@/components/shared/dialogs/DropDownMenu/DropDownMenu'

const ChatInfo = () => {
  const { selectedChat, setGroupName, toggleShowChat, closeShowChat } =
    useChatSlice()
  const { isGroup, friend, members, _id, groupAvatar, groupName, membersInfo } =
    selectedChat as IChat
  const [editGroupName, setEditGroupName] = useState(false)
  const [newGroupName, setNewGroupName] = useState(groupName)
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    null
  )
  const groupNameRef = useRef<HTMLDivElement | null>(null)

  const handleChangeNewName = async () => {
    setGroupName({ chatId: _id, newGroupName })
    await updateGroupName(_id, newGroupName!)
    setEditGroupName(false)
  }

  useEffect(() => {
    return closeShowChat
  }, [])

  useClickOutside(groupNameRef, () => {
    setEditGroupName(false)
  })

  const allMembers = members?.map((member) => {
    return {
      role: member.role,
      user: membersInfo?.find((u) => u._id === member.user),
    }
  })

  return (
    <div className="z-100 h-full w-[288px] overflow-y-scroll scrollbar-none">
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-background p-2">
        <span className="cursor-pointer" onClick={toggleShowChat}>
          <X />
        </span>
        <span className="py-3 text-xl">Chat Info</span>
      </div>
      <div className="relative z-0 flex flex-col items-center gap-2">
        <motion.div
          layoutId={_id}
          onClick={() =>
            setImagePreview(isGroup ? groupAvatar?.url : friend?.avatar?.url)
          }
        >
          <Avatar
            src={isGroup ? groupAvatar?.url : friend?.avatar?.url}
            className="z-100 size-24"
          />
        </motion.div>
        <div ref={groupNameRef}>
          {isGroup ? (
            <div className="flex items-center gap-2">
              <div>
                {editGroupName ? (
                  <input
                    autoFocus
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-secondary p-1.5 focus-visible:outline-none"
                  />
                ) : (
                  <span>{groupName}</span>
                )}
              </div>
              {!editGroupName ? (
                <button onClick={() => setEditGroupName(true)}>
                  <PencilLineIcon size={15} />
                </button>
              ) : (
                <button
                  onClick={handleChangeNewName}
                  className="disabled:opacity-70"
                  disabled={groupName === newGroupName}
                >
                  <Check size={15} />
                </button>
              )}
            </div>
          ) : (
            <div>{friend.username}</div>
          )}
        </div>
        {isGroup && <span>Group: {members?.length} members</span>}
      </div>
      {isGroup && (
        <div className="mt-6">
          <div className="flex justify-between">
            <p className="p-2 text-base font-[500]">Group Members</p>
            {selectedChat && members && (
              <AddGroupMembers
                chatId={selectedChat?._id}
                members={members?.map((m) => m.user)}
              />
            )}
          </div>
          <div className="space-y-2">
            {allMembers?.map(({ user: member, role }) => {
              if (!member) return <></>
              return <MemberItem member={member} role={role} />
            })}
          </div>
        </div>
      )}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImagePreview(null)}
            className="fixed inset-0 z-100 flex h-dvh w-screen items-center justify-center bg-background bg-opacity-60"
          >
            <div className="aspect-square w-1/3">
              <motion.div layoutId={_id}>
                <img
                  src={imagePreview}
                  alt="image preview"
                  className="h-full w-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type MemberItemProps = {
  member: IUser
  role: 'member' | 'admin'
}

const MemberItem = ({ member, role }: MemberItemProps) => {
  return (
    <div className="flex h-full items-center justify-between p-2 hover:bg-secondary">
      <div className="flex items-center gap-3">
        <div>
          <Avatar src={member?.avatar?.url} className="size-8 h-full" />
        </div>
        <div>
          <UsernameLink username={member.username}>
            <span>{member?.username}</span>
          </UsernameLink>
        </div>
      </div>
      <div>
        {role === 'admin' ? (
          <span className="rounded bg-secondary p-1 text-xs">Admin</span>
        ) : (
          <DropDownMenu
            items={[
              {
                title: 'Make Group Admin',
                onPress: () => {},
              },
              {
                title: 'Remove',
                onPress: () => {},
              },
            ]}
          >
            <span>
              <MoreHorizontal />
            </span>
          </DropDownMenu>
        )}
      </div>
    </div>
  )
}

export default ChatInfo
