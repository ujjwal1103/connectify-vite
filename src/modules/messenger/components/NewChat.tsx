import { createNewChat } from '@/api'
import Modal from '@/components/shared/modal/Modal'
// import UsernameLink from '@/components/shared/UsernameLink'
import { makeRequest } from '@/config/api.config'
import { IUser } from '@/lib/types'
import { useChatSlice } from '@/redux/services/chatSlice'

import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'

import { IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import CreateGroup from './CreateGroup'
import Avatar from '@/components/shared/Avatar'
import { useDebounce } from '@/hooks/useDebounce'
import { useQueryClient } from '@tanstack/react-query'
import { CHATS_KEY } from '@/constants/queryKeys'

const AddNewUser = ({ onClose }: any) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [createGroup, setCreateGroup] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])
  const queryClient = useQueryClient()
  const [selectedUsers, setSelectedUsers] = useState<
    { username: string; userId: string }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setChat } = useChatSlice()
  const navigate = useNavigate()
  const debouncedSearch = useDebounce(searchTerm, 400)

  const getAllUsers = useCallback(async (showLoader = true) => {
    showLoader && setIsLoading(true)
    try {
      const res = await makeRequest.get(
        `/newchat/users?search=${debouncedSearch}&limit=20`
      )
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

  const handleUserSelect = async () => {
    try {
      setLoading(true)
      const response = (await createNewChat(selectedUsers[0].userId)) as any
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: [CHATS_KEY] })
        setChat(response.chat)
        navigate(`/inbox/${response.chat._id}`)
        onClose()
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChat = (
    userId: string,
    username: string,
    isChecked: boolean
  ) => {
    setSelectedUsers((prev) => {
      if (isChecked) {
        return prev.filter((user) => user.userId !== userId)
      }
      return [...prev, { userId, username }]
    })
  }
  const handleCreateNewGroup = async () => {
    setCreateGroup(true)
  }

  const onClear = (id: string) =>
    setSelectedUsers((prev) => prev.filter((u) => u.userId !== id))

  const filteredUsers = users?.filter((user) =>
    user.username.includes(debouncedSearch)
  )

  return (
    <div className="relative z-10 flex h-dvh w-screen flex-col overflow-hidden rounded border-[0.5px] border-secondary/50 bg-background text-foreground shadow-sm md:h-144 md:w-96">
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col overflow-y-scroll shadow-lg scrollbar-none">
          <div className="sticky top-0 z-10 bg-background">
            <div className="mb-2 flex items-center justify-between p-2 font-medium text-foreground shadow-lg">
              <h1 className="text-xl">
                {selectedUsers.length <= 1 ? 'New Chat' : 'New Group'}
              </h1>
              <button type="button" onClick={onClose}>
                <IoClose size={24} />
              </button>
            </div>
            <div>
              <div className="relative mx-2 my-2 flex h-10 items-center rounded-md bg-card">
                <input
                  autoFocus={false}
                  className="text-forground w-full rounded-md border-2 border-transparent bg-secondary px-3 py-2 text-sm placeholder:text-foreground focus:outline-none focus-visible:border-sky-700"
                  placeholder="Search followers..."
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
                  value={searchTerm}
                />
                {searchTerm && (
                  <span
                    className="absolute right-0 mr-2 cursor-pointer rounded-full bg-foreground text-secondary"
                    onClick={() => {
                      //   setFocused(false);
                      setSearchTerm('')
                    }}
                  >
                    <X size={16} />
                  </span>
                )}
              </div>
            </div>
          </div>
          {Boolean(selectedUsers.length) && (
            <motion.div layout className="flex flex-wrap gap-2 px-3 pb-2">
              <AnimatePresence mode="sync">
                {selectedUsers.map((user) => {
                  return (
                    <UserChip key={user.userId} user={user} onClear={onClear} />
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && users.length === 0 && (
            <div className="m-2 flex items-center gap-3 rounded-xl bg-zinc-800 p-4">
              no user found
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin text-white" size={24} />
            </div>
          )}
          <div>
            <div>
              <AnimatePresence mode="popLayout">
                {filteredUsers?.map((user) => {
                  const isChecked = selectedUsers.some(
                    (u) => u.userId === user?._id
                  )
                  return (
                    <motion.div
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                      key={user._id}
                      layout
                    >
                      <div className="flex items-center gap-3 p-2 px-4 group-last:mb-14 hover:bg-secondary">
                        <div>
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleSelectChat(
                                user._id,
                                user?.username,
                                isChecked
                              )
                            }
                            checked={isChecked}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Avatar
                            resize={40}
                            src={user?.avatar?.url}
                            className="inline-block h-8 w-8 rounded-full object-cover duration-500 hover:scale-90"
                          />
                          <span
                            // username={user?.username}
                            className="flex flex-col text-sm text-foreground"
                          >
                            <span className="text-foreground">
                              {user?.name}
                            </span>
                            <span className="text-xs text-foreground/50">
                              {user?.username}
                            </span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
          <AnimatePresence>
            {Boolean(selectedUsers.length) && (
              <motion.div
                layoutId="newGroup"
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 100 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 flex w-full items-center justify-center bg-background p-2"
              >
                {selectedUsers.length <= 1 && (
                  <button
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-blue-500 p-2 disabled:opacity-50"
                    onClick={handleUserSelect}
                    disabled={loading || !selectedUsers.length}
                  >
                    <span> SEND MESSAGE </span>
                    <span>
                      {loading && <Loader size={16} className="animate-spin" />}
                    </span>
                  </button>
                )}
                {selectedUsers.length > 1 && (
                  <button
                    className="w-full rounded-md bg-blue-500 p-2"
                    onClick={handleCreateNewGroup}
                  >
                    Create New Group
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {createGroup && (
          <Modal
            onClose={() => {
              setCreateGroup(false)
            }}
            overlayClasses={'bg-opacity-90'}
            showCloseButton={false}
            animate={false}
          >
            <CreateGroup
              selectedUsers={selectedUsers}
              onGroupCreated={() => {
                setCreateGroup(false)
                onClose()
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddNewUser

type UserChipProps = {
  user: { username: string; userId: string }
  onClear: (id: string) => void
}

export const UserChip = ({ user, onClear }: UserChipProps) => {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      layout
      className="flex items-center gap-2 rounded-md bg-secondary px-2"
    >
      <span>{user?.username}</span>
      <span className="cursor-pointer" onClick={() => onClear(user.userId)}>
        <X size={12} />
      </span>
    </motion.span>
  )
}
