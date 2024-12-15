import { removeGroupMember, updateGroup } from '@/api'
import Avatar from '@/components/shared/Avatar'
import UsernameLink from '@/components/shared/UsernameLink'
import { IChat, IMember, IUser } from '@/lib/types'
import { useChatSlice } from '@/redux/services/chatSlice'
import { useClickOutside } from '@react-hookz/web'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Loader,
  MoreHorizontal,
  PencilIcon,
  PencilLineIcon,
  X,
} from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import AddGroupMembers from './AddGroupMembers'
import DropDownMenu from '@/components/shared/dialogs/DropDownMenu/DropDownMenu'
import { getCurrentUserId } from '@/lib/localStorage'

const ChatInfo = () => {
  const { selectedChat, updateGroupInfo, toggleShowChat, closeShowChat } =
    useChatSlice()

  const { isGroup, friend, members, _id, groupAvatar, groupName } =
    selectedChat as IChat
  const [editGroupName, setEditGroupName] = useState(false)
  const [status, setStatus] = useState('idel')
  const [newGroupName, setNewGroupName] = useState(groupName)
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    null
  )
  const groupNameRef = useRef<HTMLDivElement | null>(null)

  const handleChangeNewName = async () => {
    if (!newGroupName) return
    updateGroupInfo({ chatId: _id, newGroupName })

    const formData = new FormData()

    formData.append('name', newGroupName)

    await updateGroup(_id, formData)
    setEditGroupName(false)
  }

  useEffect(() => {
    return closeShowChat
  }, [])

  useClickOutside(groupNameRef, () => {
    setEditGroupName(false)
  })

  const handleNewAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const formData = new FormData()

    formData.append('avatar', file)

    setStatus('loading')
    try {
      const res = await updateGroup(_id, formData)
      console.log(res)
      if (res.isSuccess) {
        setStatus('Success')
        updateGroupInfo({ chatId: _id, groupAvatar: res.chat.groupAvatar })
      }
    } catch (error) {}
  }

  const isMeAdmin = members
    ?.filter((m) => m.role === 'admin')
    .some((m) => m._id === getCurrentUserId())

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
          className="relative"
        >
          <Avatar
            src={isGroup ? groupAvatar?.url : friend?.avatar?.url}
            className="z-100 size-24"
          />
          {status === 'loading' && (
            <div className="absolute inset-0 z-[111] flex items-center justify-center rounded-full bg-black/60">
              <Loader className="animate-spin" />
            </div>
          )}
       {isMeAdmin &&  <label
            htmlFor="new Avatar"
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="absolute bottom-0 right-0 z-[110] cursor-pointer rounded-full border border-border bg-background p-1"
          >
            <PencilIcon size={16} />
            <input
              type="file"
              id="new Avatar"
              hidden
              onChange={handleNewAvatar}
            />
          </label>}
        </motion.div>
        <div ref={groupNameRef}>
          {isGroup ? (
            <div className="flex items-center gap-2">
              <div>
                {editGroupName && isMeAdmin ? (
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
             {isMeAdmin && <div>
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
              </div>}
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
            {selectedChat && members && isMeAdmin && (
              <AddGroupMembers
                chatId={_id}
                members={members.map((m) => m._id)}
              />
            )}
          </div>
          <div className="space-y-2">
            {members?.map((member: IMember) => {
              if (!member) return <></>
              return (
                <MemberItem
                  key={member._id}
                  member={member}
                  chatId={_id}
                  isMeAdmin={isMeAdmin}
                />
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

type MemberItemProps = {
  member: IUser & { role: 'member' | 'admin' }
  chatId: string
  isMeAdmin: boolean | undefined
}

const MemberItem = ({ member, chatId, isMeAdmin }: MemberItemProps) => {
  const { removeMember } = useChatSlice()
  const handleRemoveMember = async () => {
    try {
      removeMember(member)
      await removeGroupMember({ chatId, memberId: member._id })
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      layout
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0, y: -200 }}
      className="flex h-full items-center justify-between p-2 hover:bg-secondary/40"
    >
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
      {isMeAdmin && (
        <div>
          {member.role === 'admin' ? (
            <span className="rounded bg-secondary p-1 text-xs">Admin</span>
          ) : (
            <DropDownMenu
              onPressItem={(title) => {
                if (title === 'Remove') {
                  handleRemoveMember()
                }
              }}
              items={[
                {
                  title: 'Make Group Admin',
                  onPress: () => {},
                },
                {
                  title: 'Remove',
                },
              ]}
            >
              <span>
                <MoreHorizontal />
              </span>
            </DropDownMenu>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ChatInfo
