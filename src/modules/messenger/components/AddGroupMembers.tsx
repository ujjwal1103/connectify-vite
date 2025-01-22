import { addGroupMembers } from '@/api'
import Avatar from '@/components/shared/Avatar'
import Modal from '@/components/shared/modal/Modal'
import UsernameLink from '@/components/shared/UsernameLink'
import { makeRequest } from '@/config/api.config'
import { IMember, IUser } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useChatSlice } from '@/redux/services/chatSlice'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Circle, CircleCheck, PlusIcon, X } from 'lucide-react'
import { useState, useCallback, useEffect, ReactNode } from 'react'
import { BiLoader } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'
import { toast } from 'sonner'

const AddGroupMembers = ({
  chatId,
  members,
  children,
}: {
  chatId: string
  members: string[]
  children?: ReactNode
}) => {
  const [openList, setOpenList] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [users, setUsers] = useState<IUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { addNewMembers } = useChatSlice()

  const MEMBER_LIMIT = 10

  const getAllUsers = useCallback(async (showLoader = true) => {
    showLoader && setIsLoading(true)
    try {
      const res = await makeRequest.get(`/newchat/users`)
      setUsers(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getAllUsers()
  }, [getAllUsers])

  const addMembers = () => {
    const totalMembers = members.length + selectedUsers.length
    const remainingSlots = MEMBER_LIMIT - members.length

    if (totalMembers > MEMBER_LIMIT) {
      toast.error(`Only ${remainingSlots} more members can be added.`)
      return
    }

    try {
      addNewMembers(selectedUsers as IMember[])
      const res = addGroupMembers({
        chatId,
        newMembers: selectedUsers.map((u) => u._id),
      })
      console.log(res)
      setSelectedUsers([])
      setOpenList(false)
      toast.success('Members added successfully!')
    } catch (error) {
      console.log(error)
      toast.error('Failed to add members.')
    }
  }

  const handleSelectChat = (user: IUser, isSelected: boolean) => {
    setSelectedUsers((prev) => {
      if (isSelected) {
        return prev.filter((u) => u._id !== user._id)
      }
      return [...prev, user]
    })
  }

  return (
    <>
      <button
        onClick={() => {
          setOpenList(true)
        }}
        disabled={members.length >= 10}
        className="disabled:pointer-events-none disabled:opacity-25"
      >
        {children ? (
          children
        ) : (
          <div className="mr-2 flex size-8 items-center justify-center rounded hover:bg-secondary/40">
            <PlusIcon />
          </div>
        )}
      </button>
      <AnimatePresence>
        {openList && (
          <Modal showCloseButton={false}>
            <div className="relative z-10 flex h-dvh flex-col overflow-hidden bg-background text-foreground scrollbar-none md:h-144">
              <div className="h-full flex-1 overflow-y-scroll scrollbar-none">
                <div className="h-full w-screen overflow-y-scroll shadow-lg scrollbar-none md:w-96">
                  <div className="sticky top-0 z-10 bg-background">
                    <div className="flex items-center gap-2 rounded-sm p-2 font-medium text-foreground shadow-lg">
                      <button
                        type="button"
                        className="md:hidden"
                        onClick={() => setOpenList(false)}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <h1 className="text-lg md:text-2xl">Add Members</h1>
                      <button
                        type="button"
                        className="ml-auto hidden md:block"
                        onClick={() => setOpenList(false)}
                      >
                        <IoClose size={24} />
                      </button>
                    </div>
                    <div>
                      <div className="mx-2 my-2 flex h-10 items-center rounded-md bg-card">
                        <input
                          autoFocus={false}
                          className="text-forground w-full rounded bg-secondary px-3 py-2 text-sm placeholder:text-foreground focus:outline-none"
                          placeholder="Search..."
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                          }}
                          value={searchTerm}
                        />
                        {searchTerm && (
                          <span
                            className="mr-2 cursor-pointer rounded-full bg-foreground text-secondary"
                            onClick={() => {
                              setSearchTerm('')
                            }}
                          >
                            <X size={16} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isLoading && users.length === 0 && (
                    <div className="m-2 flex items-center gap-3 rounded-xl bg-zinc-800 p-4">
                      no user found
                    </div>
                  )}
                  {isLoading && (
                    <div className="flex-center">
                      <BiLoader className="animate-spin text-white" size={24} />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 px-3 pb-2">
                    {selectedUsers.map((user) => {
                      return (
                        <span
                          key={user._id}
                          className={cn(
                            'flex items-center gap-2 rounded-md bg-secondary px-2'
                          )}
                        >
                          <span>{user?.username}</span>
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedUsers((prev) =>
                                prev.filter((u) => u._id !== user._id)
                              )
                            }}
                          >
                            <X size={12} />
                          </span>
                        </span>
                      )
                    })}
                  </div>
                  <div className="relative">
                    {users?.map((user) => {
                      const isSelected = members.includes(user._id)
                      const isChecked = selectedUsers.some(
                        (u) => u._id === user?._id
                      )
                      return (
                        <MemberItem
                          user={user}
                          isSelected={isSelected}
                          isChecked={isChecked}
                          handleSelectChat={handleSelectChat}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
              <AnimatePresence>
              {selectedUsers.length > 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y:20
                  }}
                  exit={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity:1,
                    y:0
                  }}
                  className="flex w-full items-center justify-center p-2"
                >
                  <button
                    className="w-full rounded-md bg-blue-500 p-2"
                    onClick={addMembers}
                  >
                    Add
                  </button>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

type MemberItemProps = {
  user: IUser
  isSelected: boolean
  isChecked: boolean
  handleSelectChat: (user: IUser, isSelected: boolean) => void
}

const MemberItem = ({
  user,
  isSelected,
  handleSelectChat,
  isChecked,
}: MemberItemProps) => {
  return (
    <div
      key={user._id}
      className={cn(
        'group flex items-center gap-3 p-2 px-4 transition-all hover:bg-secondary',
        isSelected && 'pointer-events-none opacity-20'
      )}
    >
      <div
        onClick={() => handleSelectChat(user, isChecked)}
        className="flex w-full items-center gap-3"
      >
        <Avatar
          src={user?.avatar?.url}
          className="inline-block h-8 w-8 rounded-full object-cover duration-500 hover:scale-90"
        />
        <UsernameLink
          username={user?.username}
          className="text-sm text-foreground"
        >
          <span>{user?.username}</span>
        </UsernameLink>

        <span className="ml-auto flex">
          {isChecked || isSelected ? (
            <CircleCheck size={20} className="rounded-full fill-green-600" />
          ) : (
            <Circle size={20} />
          )}
        </span>
      </div>
    </div>
  )
}

export default AddGroupMembers
