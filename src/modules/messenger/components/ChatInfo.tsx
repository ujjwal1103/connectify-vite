import { updateGroupName } from '@/api'
import Avatar from '@/components/shared/Avatar'
import UsernameLink from '@/components/shared/UsernameLink'
import { IChat } from '@/lib/types'
import { useChatSlice } from '@/redux/services/chatSlice'
import { useClickOutside } from '@react-hookz/web'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, PencilLineIcon, X } from 'lucide-react'
import { useRef, useState } from 'react'

const ChatInfo = ({ onClose }: any) => {
  const { selectedChat, setGroupName } = useChatSlice()
  const { isGroup, friend, members, _id, groupAvatar, groupName } =
    selectedChat as IChat
  const [editGroupName, setEditGroupName] = useState(false)
  const [newGroupName, setNewGroupName] = useState(groupName)
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    null
  )
  const groupNameRef = useRef<HTMLDivElement|null>(null)
  const handleChangeNewName = async () => {
    setGroupName({ chatId: _id, newGroupName })
    await updateGroupName(_id, newGroupName!)
    setEditGroupName(false)
  }

  useClickOutside(groupNameRef, ()=>{
    setEditGroupName(false)
  })

  const allMembers = members?.map(member=>{
    return {
      role: member.role,
      user: selectedChat?.userDetails!.find(u=>u._id === member.user)
    }
  })
  
  return (
    <div className="z-100 p-2 w-[288px]">
      <div className="flex items-center gap-4">
        <span className="cursor-pointer" onClick={onClose}>
          <X />
        </span>
        <span className="py-3 text-xl">Chat Info</span>
      </div>
      <div className="flex flex-col items-center gap-2">
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
        <div className="mt-6 max-h-64 overflow-x-hidden overflow-y-scroll scrollbar-none">
          <p>Group Members</p>
          <div className="h-full space-y-2">
            {allMembers?.map(({user:member, role}) => {
              return (
                <div className="mt-3 flex h-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <Avatar
                        src={member?.avatar?.url}
                        className="size-8 h-full"
                      />
                    </div>
                    <div>
                      <UsernameLink username={member!.username}>
                        <span>{member!.username}</span>
                      </UsernameLink>
                    </div>
                  </div>
                  <div>
                    {role === "admin" && (
                      <span className='text-xs rounded bg-secondary p-1'>Admin</span>
                    )}
                  </div>
                </div>
              )
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

export default ChatInfo
